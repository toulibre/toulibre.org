# toulibre.org

Site web de l'association **Toulibre**, association loi 1901 de promotion du Logiciel Libre en Occitanie, basee a Toulouse.

## Stack technique

- [Astro 5](https://astro.build/) (SSG)
- [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- TypeScript strict
- pnpm

## Prerequis

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)

## Installation

```bash
pnpm install
```

## Commandes

```bash
pnpm dev        # Serveur de developpement (localhost:4321)
pnpm build      # Build de production (astro check + astro build)
pnpm preview    # Previsualiser le build de production
```

## Structure du projet

```
src/
├── components/       # Composants Astro reutilisables
├── data/
│   └── events.json   # Donnees des evenements
├── layouts/
│   └── Layout.astro  # Layout principal (meta SEO, JSON-LD)
├── pages/            # Pages du site
│   ├── index.astro
│   ├── evenements.astro
│   ├── association.astro
│   ├── adhesion.astro
│   ├── faq.astro
│   ├── code-de-conduite.astro
│   └── mentions-legales.astro
└── styles/
    └── global.css    # Tailwind CSS 4 config, polices, animations
public/
├── favicon.svg
├── robots.txt
└── static/img/       # Images et logo
```

## Ajouter un evenement

Editer `src/data/events.json` et ajouter un objet :

```json
{
  "title": "Nom de l'evenement",
  "date": "2026-03-12T19:30:00",
  "endDate": "2026-03-12T22:30:00",
  "location": "Lieu, Toulouse",
  "description": "Description courte.",
  "type": "qjelt"
}
```

Types disponibles : `qjelt`, `dropIn`, `workshop`, `screening`, `conference`.

Sur la page d'accueil, seuls les evenements a venir sont affiches. La page `/evenements` affiche l'historique complet.

## Licence

Contenu sous licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr).
Code source sous licence libre.
