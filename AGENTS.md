# LingoLanka Project Instructions

LingoLanka is a free, privacy-first bilingual learning PWA. It supports English speakers learning Sinhala and Sinhala speakers learning English.

## Stack

React, strict TypeScript, Vite, React Router hash routing, Framer Motion, Lucide, Dexie/IndexedDB, Zod, Vitest, Testing Library, ESLint, Prettier and vite-plugin-pwa. Do not add paid services, accounts, advertising, trackers, fake AI, fake handwriting recognition, or controls without working outcomes.

## Product and design

Pages sit in one comfortable centred column, apple.com style (`--page-max` in `src/layout.css`, shared by the nav bar), not edge to edge; single-column pages fill that column with side rails (`.page-split`) carrying real content. Run `npm run check:layout` after a build before every push. Use a warm ivory/emerald/teal/amber system with mature cards, restrained motion, responsive layouts, visible focus states, semantic HTML and complete light/dark/high-contrast support. Respect `prefers-reduced-motion`. Sinhala text must use valid Unicode, `lang="si"`, a Sinhala-capable fallback stack, generous line height and no clipping.

## Content

Keep curriculum and schemas outside UI components. Both directions contain the five core levels and at least eight modules; the Sinhala course adds Intermediate and Expert grammar levels (`src/data/advanced.ts`), where every Sinhala sentence must cite a reusable source and page (see `src/data/sources.ts`). Validate curriculum and imported backups with Zod. Centralize transliteration. Add uncertain linguistic entries to `CONTENT_REVIEW.md`, never to learner UI.

## Accessibility

Meet WCAG-friendly contrast, keyboard navigation, large touch targets, status announcements, transcripts, explicit labels, skip links and language attributes. Never communicate state only through colour.

## Commands

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:coverage`
- `npm run build`
- `npm run check:layout` (after a build without `GITHUB_REPOSITORY`: every route at 1920px must fill its centred column, none may scroll sideways at 360px)
- `npm run preview`

## Deployment

GitHub Pages deploys `dist` through `.github/workflows/deploy-pages.yml`. Keep `HashRouter`. Vite base must use `GITHUB_REPOSITORY` so assets, manifest and service worker work under the repository subpath. Never push failing checks or credentials.

## Browser voice

Speech synthesis and recognition depend on browser/device support. Prefer `si-LK`, then a compatible language voice. Always keep text usable. When recognition is absent, offer local microphone recording and self-assessment; never upload or permanently store recordings.
