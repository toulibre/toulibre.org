// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://toulibre.org",
  // Astro 7 defaults to 'jsx', which drops the whitespace separating inline
  // elements from surrounding text (e.g. "le <span>Logiciel Libre</span>").
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
