# AZ Tools Next.js Migration — CONTEXT

Living handoff doc. Read top-to-bottom to resume work in any chat.

## What this project is

Full rebuild of [aztools.in](https://aztools.in) from React + Vite to Next.js 16 for SEO. The Vite repo (`KshitijKoranne/az-tools`) is the live functional reference. The next.js repo (`KshitijKoranne/aztools-next`) is the rebuild target. After parity, Vite repo will be deleted.

## Repos

- **Source of truth (live)**: https://github.com/KshitijKoranne/az-tools — React + Vite, deployed to aztools.in
- **Target (rebuild)**: https://github.com/KshitijKoranne/aztools-next — Next.js 16, will replace Vite repo on aztools.in when complete
- **Live URL**: https://aztools.in (currently Vite, eventual switchover to Next)

## Stack (locked, verified building)

- Next.js 16.2.4 (App Router, Turbopack)
- React 19.2.4
- Tailwind CSS v4 (CSS-first config in `globals.css`, no `tailwind.config.ts`)
- TypeScript 5
- shadcn/ui — **radix-nova preset** (style: `radix-nova`, base: radix-ui, supports `asChild`)
- lucide-react 1.x
- next-themes (light/dark/system)
- Geist + Geist Mono fonts (next/font/google)
- Sonner for toasts
- react-type-animation for hero typing

**Why radix-nova not base-nova**: base-nova uses @base-ui/react and drops `asChild`, which breaks `<Button asChild><Link>` patterns used everywhere. radix-nova uses radix-ui (with Slot), keeps `asChild`.

## Working principles

User preferences (`userPreferences`):

1. Minimum tokens, no over-explanation
2. Ask questions before proceeding when scope is unclear
3. Act with 25+ years of QA/PM/SEO experience
4. Use Context7 for current docs
5. Search GitHub as additional source
6. Free first, freemium second, paid last
7. Step-by-step, one actionable item at a time
8. Doing > explaining
9. Quality over quantity. Self-criticise before executing. >90% confidence required
10. Help earn real money
11. No emojis unless essential

User's additional rules for this project:
- "It just works" (Apple Inc guideline) — fix incompatibilities, don't paper over
- Quality over quantity always
- Pace: one tool at a time, tight feedback per tool
- Match Vite functionally, allow improvements where obvious

## What's done (commits on main)

```
24f7cd9 chore: package.json name and version
1b00b7e scaffold: pages, SEO, redirects, build verified
9a76c75 scaffold: layouts, theme, data file, public assets
e53ee1c scaffold: shadcn/ui + base deps
46258b5 init: fresh Next.js 16 scaffold
```

The repo was force-pushed to main (clean wipe) on 2026-04-30, history before `46258b5` is gone.

### Verified working

- `npm run build` produces 23 static routes, no errors
- All 15 categories pre-rendered as SSG
- Sitemap, robots, manifest all generate
- TypeScript strict, zero errors

### Routes built

- `/` — home (categories grid, hero with cycling category names)
- `/category/[id]` — dynamic, generateStaticParams pre-renders all 15
- `/privacy-policy`
- `/not-found` (404)
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` — auto-generated

### Data file

`src/data/tools.ts` — 99 tools, 15 categories, ported faithfully from Vite. Three SEO slug renames applied:

| Old (Vite, has 301 redirect) | New (Next) |
|---|---|
| `color-contrast` | `color-contrast-checker` |
| `color-palette` | `color-palette-generator` |
| `compound-interest` | `compound-interest-calculator` |

Helpers: `getToolById`, `getToolsByCategory`, `getCategoryById`.

### Components built

- `src/components/header.tsx` — sticky, scroll shadow, search dropdown (top 10 + see-all link)
- `src/components/footer.tsx` — KSK Labs branding, privacy/support/report links
- `src/components/mobile-nav.tsx` — drawer with logo, search, category list, support
- `src/components/theme-provider.tsx` + `theme-toggle.tsx`
- `src/components/category-card.tsx`, `tool-card.tsx`
- `src/components/home-hero.tsx` — client island with TypeAnimation
- `src/components/layouts/main-layout.tsx`, `tool-layout.tsx`
- `src/components/ui/*` — shadcn radix-nova components (button, card, input, label, textarea, badge, select, tabs, separator, dropdown-menu, sheet, dialog, tooltip, switch, slider, checkbox, radio-group, progress, sonner, accordion, popover)

### SEO

- Full root metadata in `src/app/layout.tsx` (OG, Twitter, canonical, robots, icons, viewport themeColor)
- Per-page metadata via Next's `generateMetadata` for category pages
- 301 redirects in `next.config.ts` for the 3 SEO slug renames
- 302 redirect `/favorites` → `/` (until favorites system built)

## Tool migration plan

**Status**: 0 of 99 tools built.

### Tool pattern

Each tool: `src/app/tools/<slug>/page.tsx` (server, metadata) + `client.tsx` (client logic, 'use client').

```tsx
// page.tsx (server)
import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Tool Name",
  description: "...",
  alternates: { canonical: "https://aztools.in/tools/<slug>" },
};

export default function Page() {
  return <Client />;
}
```

```tsx
// client.tsx
"use client";
import { ToolLayout } from "@/components/layouts/tool-layout";

export default function Client() {
  return (
    <ToolLayout toolId="<slug>">
      {/* tool UI */}
    </ToolLayout>
  );
}
```

`ToolLayout` reads tool name/description from `getToolById` and renders back-button + title + description automatically.

### Migration order (proposed)

Working through categories in this order:

1. **Text Utilities** (12 tools) — simplest, establishes pattern
2. **Developer Tools** (~13)
3. **Color Tools** (~7)
4. **Calculators** (~9)
5. **IT Tools** (~8)
6. **Time Tools** (~5)
7. **Content Tools** (~6)
8. **Random Tools** (~5)
9. **Productivity Tools** (~3)
10. **Data Tools** (~4)
11. **Finance Tools** (~3)
12. **Security Tools** (~6)
13. **SEO Tools** (~6)
14. **PDF Tools** (~6) — heavy client libs (pdf-lib, etc)
15. **Image Tools** (~7) — heavy client libs (canvas, browser-image-compression)

Heavy categories (PDF, Image) saved for last because they need extra deps and bigger validation.

### Per-tool process

For each tool:
1. Read Vite source: `az-tools/src/pages/tools/<Name>.tsx`
2. Identify any deps used (e.g. tesseract, qrcode, jsbarcode)
3. Add deps to next repo
4. Port functionality faithfully into next/client.tsx pattern
5. Type-check + build + visual sanity check
6. Commit, push, get user approval
7. Repeat

### Tools deferred / out of scope

See `DEFERRED.md` in repo root. Notable:
- AI tools (`ai-caption-generator`, `ai-content-writer`, `ai-tool-search`) — skipped permanently
- Favorites localStorage system — defer to later
- `/search` page — defer to later (header still submits to /search?q=...)
- Python API routes (`text-to-docx`, `text-to-pdf`) — replace with browser-side libs (jspdf, docx) when those tools are built
- `ssl-check` JS API — port to Next route handler when ssl-checker tool comes up

## Known constraints / gotchas

- **Tailwind v4** uses `@import "tailwindcss"` and `@theme inline` in `globals.css`, NOT `tailwind.config.ts`. Don't try to add a config file.
- **shadcn radix-nova** Button supports `asChild` via `radix-ui` Slot. Imports look like `import { Slot } from "radix-ui"` (the umbrella package), not `@radix-ui/react-slot`.
- Geist fonts are loaded via `next/font/google`, not via package imports.
- `next.config.ts` is TypeScript, not `.js`.
- React 19 strict mode is on. Hydration warnings on `<html>` are silenced via `suppressHydrationWarning` (needed for next-themes).
- Container width: components use `container mx-auto px-4` — Tailwind v4 doesn't auto-center the container, so `mx-auto` is required.
- For tool pages: pass `toolId` to `ToolLayout`. The layout looks up name+description from `tools.ts`. **Don't** duplicate name/description in the JSX.

## Live aztools.in DNS

Currently points at Vite repo. **DO NOT** point at next repo until parity reached and user approves cutover. There's no aztools.in deploy from the next repo yet, only Vercel preview deploys.

## Vercel

Repo `KshitijKoranne/aztools-next` should be connected to Vercel. Each push to main triggers a preview/production deploy depending on settings. The user can verify scaffold by visiting Vercel preview URL.

## When stuck / "it just works" violations

If a tool migration hits an incompatibility (Tailwind v3 syntax, missing dep, broken import, deprecated API), **fix it properly**, don't work around it. The user's standard is Apple-grade reliability.

If a Vite tool uses something that doesn't translate (window APIs unavailable in SSR, missing browser permission, etc), make it client-side only via 'use client' or `dynamic(import, { ssr: false })`.

## Token rotation reminder

User shared a GitHub PAT (`ghp_2fz0HjhX...`) in chat for pushing. Once each session ends, that token should be revoked at github.com/settings/tokens. The user is OK with sharing tokens but rotation is the safety practice.

---

*Last updated: 2026-04-30, after scaffolding pushed (commit 24f7cd9). Next: start tool 1 (Text Formatter, Text Utilities category).*
