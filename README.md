# Hexcrawler Map Editor

A browser-based editor for creating one-page hexcrawl RPG maps. No login required — save and share maps as `.hexcrawl.json` files.

## Features

- Fixed 19-hex map layout matching classic hexcrawl zines
- Upload artwork per hex with name and description
- Editable encounters (d6), rumours (d6), and three factions with goal clocks
- Export / import portable JSON files (images embedded as base64)
- Auto-saves draft to browser localStorage
- Print-optimized one-page layout (Letter size) — use **Print / Save PDF** in preview mode

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Static files are output to `dist/`.

## Hosting

Deploy the `dist/` folder to any static host:

| Host | Steps |
|------|-------|
| **Netlify** | Drag-and-drop `dist/` at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | Import repo, set build command `npm run build`, output `dist` |
| **GitHub Pages** | Enable Pages from GitHub Actions (workflow included). For project sites at `https://<user>.github.io/hexcrawler/`, set `base: '/hexcrawler/'` in `vite.config.ts` |

## Export / Import

- **Export** — downloads `{map-title}.hexcrawl.json` with all text and images
- **Import** — load a `.hexcrawl.json` file via the toolbar button or drag-and-drop onto the page
- **New blank** / **Load sample** — start fresh or load the Oakwood example

Share exported files with others; they can import them without an account.

## Print tips

1. Click **Preview & Print**
2. Click **Print / Save PDF**
3. Choose "Save as PDF" or your printer
4. Use **Letter** paper, scale **100%**, margins **Default**

## Map file format

```json
{
  "version": 1,
  "title": "Oakwood",
  "hexes": [{ "id": 1, "name": "...", "description": "...", "imageDataUrl": null }],
  "encounters": ["...", "...", "...", "...", "...", "..."],
  "rumours": ["...", "...", "...", "...", "...", "..."],
  "factions": [{ "name": "...", "resources": ["..."], "goals": [{ "text": "...", "clockSlots": 4 }] }]
}
```

## License

MIT
