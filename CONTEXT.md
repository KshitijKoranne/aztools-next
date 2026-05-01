# AZ Tools Next.js Migration - Context

Last updated: 2026-05-01

## Project

AZ Tools has been rebuilt from the old React + Vite repo into the Next.js repo:

- Old reference repo: `KshitijKoranne/az-tools`
- Official repo now: `KshitijKoranne/aztools-next`
- Live domain target: `https://aztools.in`
- Framework: Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui radix-nova, Sonner

The Vite repo should be archived until the Next deployment is verified on `aztools.in` for 48-72 hours.

## Current Status

All tools in `src/data/tools.ts` have routes and working client implementations.

Migration count check:

- Total tool routes: 96
- Remaining missing routes: 0

Recent pushed category commits:

```text
42ef8cf tools: pdf-tools category
0f4072d tools: remaining text utilities
7fb7d7b tools: image-tools category
92e61db tools: content-tools category
16abf62 tools: seo-tools category
69d0fcd tools: remaining it-tools
ecac44b tools: finance-tools category
a9c9529 tools: data-tools category
070c23f tools: security-tools category
a07bdb5 tools: time-tools category
120ef7a tools: random-tools category
3beedfc tool: pomodoro-timer
```

## Heavy Tool Dependencies

Added free client-side libraries:

- `pdf-lib` for PDF merge, split, rotate, and image-to-PDF
- `pdfjs-dist` for PDF text extraction and PDF-to-image rendering
- `tesseract.js` for OCR text extraction

PDF tools are currently browser-side. They should work for normal PDFs, but very large, encrypted, scanned, or unusual PDFs may need future backend hardening with `qpdf`, `poppler`, `ocrmypdf`, or a managed PDF API.

## SEO Work

SEO pass added:

- Stronger root metadata and descriptions
- Organization and WebApplication JSON-LD
- Home category ItemList JSON-LD
- Category BreadcrumbList and CollectionPage JSON-LD
- Tool BreadcrumbList and WebApplication JSON-LD
- Home internal-link section for popular tools
- Category titles adjusted to avoid duplicated `AZ Tools`

Files involved:

- `src/lib/seo.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/category/[id]/page.tsx`
- `src/components/layouts/tool-layout.tsx`

## Important Project Rules

- Do not use mock tools. Every tool must work as intended.
- Keep UI consistent through `ToolLayout`, existing shadcn components, and current spacing.
- Push after meaningful category-level work.
- Use the provided PAT/working Git auth when pushing, but never print tokens or commit secrets.
- Do not ask again for Google Fonts or normal git push permission.
- Keep user updates concise.

## Suggested Next Steps

1. Let Vercel build the latest pushed commit.
2. Run a full production smoke test:
   - Home
   - All category pages
   - 10-15 representative tools
   - PDF/image/OCR tools with real files
   - Sitemap and robots
3. Point `aztools.in` to the Next deployment only after green verification.
4. Keep old Vite repo archived until Next is stable on the live domain.
5. Add backend hardening only for PDF/OCR cases that fail real testing.
