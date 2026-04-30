# Deferred items

Things from the Vite repo not in v1 of next.js rebuild. Add when the corresponding tools are ready.

## Features not in scaffolding (v1)

- **Favorites system** — localStorage-based, used by ToolCard star icon. Add `AppProvider` + `/favorites` page later.
- **/search page** — header search submits to `/search?q=...`, will 404 until built.
- **ShareButtons** — Vite footer has social share buttons, dropped from v1 footer.
- **ChatBot** — Vite has an AI chatbot component. Skip per user instruction (no AI features).

## API routes deferred

- `ssl-check` — port to Next.js route handler when ssl-checker tool is built.
- `text-to-docx` and `text-to-pdf` (Python) — replace with browser-side `docx` and `jspdf` libraries when those tools are built.
- AI routes (caption-generator, content-writer, tool-search) — skipped permanently.
