// Unified event source for the site.
//
// Events come from two places and are merged at build time:
//   1. events.json — manually curated events that LibreRegistration does not
//      know about (external talks, médiathèque permanences, Blender, cinemas…).
//   2. The iCal feeds exposed by LibreRegistration on evenements.toulibre.org —
//      the registration-based QJeLT events.
//
// The feed is fetched once during the static build. If it is unreachable the
// build silently falls back to events.json alone, so the site always builds.
//
// Because this runs at build time (SSG), a freshly created QJeLT only appears
// after the site is rebuilt — this is intentional (manual rebuild workflow).

import rawEvents from "./events.json";

export interface EventItem {
  title: string;
  date: string; // ISO 8601, local (Europe/Paris) wall-clock, e.g. "2026-04-02T20:30:00"
  endDate?: string;
  location: string;
  description: string;
  type: string; // "qjelt" | "permanence" | "atelier" | "projection" | "conference"
  url?: string;
}

const jsonEvents = rawEvents as EventItem[];

// Base URL of the LibreRegistration instance. Override with the
// PUBLIC_EVENTS_ICS_BASE env var (e.g. to point at a staging instance or to
// disable the feed by pointing it somewhere unreachable).
const ICS_BASE = (
  import.meta.env.PUBLIC_EVENTS_ICS_BASE ?? "https://evenements.toulibre.org"
).replace(/\/+$/, "");

// Upcoming events plus the last 12 months of past events (the feed's default
// window). Both feeds are optional — each is best-effort.
const FEED_URLS = [`${ICS_BASE}/events.ics`, `${ICS_BASE}/events/past.ics`];

const FETCH_TIMEOUT_MS = 8000;

// Mirror of the slug logic in EventCard.astro so the same event computed from
// either source collapses to the same identity.
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Identity used for de-duplication. The public event-page URL is the most
// reliable key (it survives small title differences between the two sources);
// otherwise fall back to the title+date slug.
function eventKey(e: EventItem): string {
  if (e.url) {
    const m = e.url.match(/evenements\.toulibre\.org\/event\/([^/?#]+)/);
    if (m) return `url:${m[1]}`;
  }
  return `slug:${slugify(e.title)}-${e.date.slice(0, 10)}`;
}

// ---- iCal parsing (tailored to the feed LibreRegistration emits) ----

function unescapeICS(s: string): string {
  // Reverse of the server-side escaping: \\ \; \, and \n / \N.
  return s.replace(/\\([\\;,nN])/g, (_, c: string) =>
    c === "n" || c === "N" ? "\n" : c,
  );
}

// Parse an iCal timestamp into a Date. LibreRegistration emits real UTC
// instants with a "Z" suffix (e.g. an event at 20h00 Paris is 18:00:00Z).
// Date-only values are treated as midnight UTC. Returns null otherwise.
function parseICSDate(value: string): Date | null {
  const dt = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (dt) {
    const [, y, mo, d, h, mi, s] = dt;
    return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  }
  const date = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (date) {
    const [, y, mo, d] = date;
    return new Date(Date.UTC(+y, +mo - 1, +d, 0, 0, 0));
  }
  return null;
}

// Format an instant as a naive Europe/Paris ISO string (no timezone suffix),
// matching the convention used in events.json so both sources sort and display
// consistently regardless of the build machine's timezone.
function toParisNaiveISO(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}`;
}

interface RawVEvent {
  [key: string]: string;
}

function parseICS(text: string): RawVEvent[] {
  // Unfold continuation lines (a line starting with space or tab continues the
  // previous one), then split on any line ending.
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r\n|\n|\r/);

  const events: RawVEvent[] = [];
  let current: RawVEvent | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;
    let name = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const semi = name.indexOf(";"); // drop property parameters (e.g. DTSTART;TZID=…)
    if (semi !== -1) name = name.slice(0, semi);
    current[name.toUpperCase()] = value;
  }
  return events;
}

function veventToItem(v: RawVEvent): EventItem | null {
  const summary = v.SUMMARY ? unescapeICS(v.SUMMARY) : "";
  const start = v.DTSTART ? parseICSDate(v.DTSTART) : null;
  if (!summary || !start) return null;

  const end = v.DTEND ? parseICSDate(v.DTEND) : null;
  const category = v.CATEGORIES
    ? unescapeICS(v.CATEGORIES).split(",")[0].trim().toLowerCase()
    : "";

  return {
    title: summary,
    date: toParisNaiveISO(start),
    endDate: end ? toParisNaiveISO(end) : undefined,
    location: v.LOCATION ? unescapeICS(v.LOCATION) : "",
    description: v.DESCRIPTION ? unescapeICS(v.DESCRIPTION) : "",
    type: category || "qjelt",
    url: v.URL ? unescapeICS(v.URL) : undefined,
  };
}

async function fetchFeed(url: string): Promise<EventItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      console.warn(`[events] feed ${url} returned ${res.status}, skipping`);
      return [];
    }
    const text = await res.text();
    return parseICS(text)
      .map(veventToItem)
      .filter((e): e is EventItem => e !== null);
  } catch (err) {
    console.warn(`[events] could not fetch ${url}: ${(err as Error).message}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function loadEvents(): Promise<EventItem[]> {
  const feeds = await Promise.all(FEED_URLS.map(fetchFeed));
  const icsEvents = feeds.flat();

  // iCal events win over JSON entries that describe the same event.
  const byKey = new Map<string, EventItem>();
  for (const e of icsEvents) byKey.set(eventKey(e), e);
  for (const e of jsonEvents) {
    const key = eventKey(e);
    if (!byKey.has(key)) byKey.set(key, e);
  }

  return [...byKey.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export const events: EventItem[] = await loadEvents();
