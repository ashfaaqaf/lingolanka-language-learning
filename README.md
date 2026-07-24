# LingoLanka

**Learn Sinhala. Learn English. Connect without limits.**

LingoLanka is a free, privacy-first bilingual language-learning PWA for English speakers learning Sinhala and Sinhala speakers learning English. It combines reading, writing, listening, speaking, vocabulary, grammar and practical conversations without accounts, ads, paid APIs or a backend.

## Live website

[Open LingoLanka](https://ashfaaqaf-ai.github.io/lingolanka-language-learning/)

The production site is published from `main` by the validated GitHub Pages workflow. The public app, manifest, service worker, PWA icon and social card were verified over HTTPS after deployment.

## Screenshots

The finished application includes a responsive public landing page, onboarding, dashboard, lesson player, libraries and focused practice tools. A branded social preview is at `public/og.png`.

## Main features

- Two independent learning paths with five levels, eight modules per course and 40 lessons total
- 264 bilingual vocabulary entries, 12 grammar guides and 12 role-play conversations
- Sinhala script and English alphabet/phonics libraries
- Device-supported English and Sinhala speech synthesis with normal/slow playback
- Browser speech recognition where available; private local recording fallback
- Mouse, touch and stylus tracing with guide, undo/redo and honest coverage feedback
- Eight exercise formats, instant feedback and repeatable lessons
- IndexedDB progress, daily activity, streaks, XP, achievements and spaced review
- Validated progress export/import and confirmed reset
- Light, dark, high-contrast, text-size and reduced-motion settings
- Hash routing, installable PWA and offline app shell for GitHub Pages

## Learning paths

1. **English → Sinhala** uses English explanations and teaches Sinhala script, pronunciation and practical communication.
2. **සිංහල → English** uses Sinhala explanations and teaches English alphabet, phonics and practical communication.

Each course contains Foundations, Beginner, Elementary, Everyday Communication and Intermediate Foundations.

## Technology

React, strict TypeScript, Vite, React Router, Framer Motion, Lucide, Dexie/IndexedDB, Zod, Vitest, Testing Library, ESLint, Prettier, local Fontsource packages and vite-plugin-pwa.

## Local setup

Requires Node.js 24 and npm.

```bash
npm ci
npm run dev
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run preview
```

## Production and deployment

`npm run build` creates `dist`. Vite reads `GITHUB_REPOSITORY` in CI and sets the repository subpath automatically. `HashRouter` keeps direct navigation and refreshes GitHub Pages-safe. `.github/workflows/deploy-pages.yml` validates lint, types and tests before an official GitHub Pages artifact can deploy.

## PWA and offline use

The generated service worker precaches the app shell, curriculum, fonts and static assets. Reading, vocabulary, grammar and writing work offline after the first complete visit. Browser speech may still depend on voices installed on the device.

## Content architecture

- `src/data/content.ts`: bilingual vocabulary, courses, alphabet, conversations and grammar
- `src/types.ts`: strict content and progress types
- `src/schemas.ts`: runtime validation for settings and backups
- `src/lib/db.ts`: versioned IndexedDB storage and migrations

To add a lesson, add a topic-backed lesson record in the content factory with a unique ID, vocabulary references, outcomes and validated exercises. To add vocabulary, add a unique English/Sinhala/transliteration tuple in the appropriate category. To add a conversation, include context, objective, at least two speakers, English, Sinhala, transliteration and a comprehension check.

## Transliteration

LingoLanka uses a consistent readable scholarly convention: long vowels use macrons (`ā`, `ī`, `ū`, `ē`, `ō`), retroflex consonants use underdots (`ṭ`, `ḍ`, `ṇ`, `ḷ`) and `æ/ǣ` represent the Sinhala ඇ/ඈ sounds. Transliteration is optional and can be always shown, shown on request or hidden.

## Voice and browser compatibility

Speech is honestly labelled device-supported pronunciation. `si-LK` voices and Sinhala recognition are not available on every platform. Recognition scoring is approximate word overlap, not accent science. Unsupported recognition falls back to local recording, replay and self-assessment; audio is never uploaded or stored permanently.

Modern Chrome, Edge, Firefox and Safari support the core app. Speech recognition support is strongest in Chromium browsers. Canvas practice supports pointer events across mouse, touch and stylus.

## Accessibility and privacy

The app includes semantic landmarks, skip links, visible focus, keyboard controls, status announcements, transcripts, language attributes, responsive touch targets, accessible chart summaries and no colour-only status. Progress stays on the current device unless exported. No analytics, ads, cookies, location, account or profile is required.

## Contributing corrections

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Language corrections should include the phrase, context, register, source and suggested Sinhala/English/transliteration.

## Licence

MIT
