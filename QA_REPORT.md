# LingoLanka QA report

Date: 2026-07-24  
Environment: Windows local verification plus GitHub-hosted Ubuntu deployment, Node.js 24, Vite production build

## Automated commands

- `npm ci --no-audit --no-fund` — completed
- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm run test` — 19 tests passed
- `npm run build` — passed; PWA service worker and offline precache generated

## Automated coverage

Verified curriculum quantities and IDs, both directions, eight exercise formats, Sinhala Unicode, answer normalisation, alternative answers, safe shuffling, speaking similarity, review scheduling, streaks, settings and backup validation, application startup, onboarding direction selection, navigation, unsupported recognition fallback, writing controls and error recovery.

## Manual checks

Completed in the in-app browser against development and repository-subpath production previews:

- Landing renders with intact English, Sinhala and transliteration; no console errors.
- Sinhala-known onboarding selects the Sinhala-to-English course and reaches the dashboard.
- A four-exercise lesson scores 100%, saves 60 XP and remains completed after refresh.
- Dashboard statistics and level progress are calculated from the persisted lesson.
- Vocabulary exposes 264 entries; search reduced “elephant” to one result.
- Normal device-speech playback control activated; slow controls are exposed throughout alphabet, listening and vocabulary.
- Speaking page clearly labels approximate feedback and exposes recognition plus local-recording paths.
- Canvas accepts pointer input, enables Undo, uses `touch-action: none` and no longer crashes.
- Theme and reduced-motion settings apply to the root document.
- Export reports success, invalid import is rejected without changes, and reset requires a confirmation dialog.
- 320, 375, 768, 1024 and 1440 px checks have no horizontal overflow; mobile bottom navigation and desktop sidebar switch at the intended breakpoint.
- Production preview works at `/lingolanka-language-learning/`; hash-route refresh returns the Vocabulary page.
- Manifest, service worker, 192/512 icons and social card return HTTP 200 beneath the repository subpath.
- Final production-preview console contains no errors or warnings.

The browser pass found and fixed three issues before this report was finalized: 320 px overflow caused by a body minimum width, an asynchronous pointer-event canvas crash, and rapid settings writes overwriting one another.

## Known browser limitations

- Sinhala speech voices are supplied by the browser/operating system and may be absent.
- `SpeechRecognition`/`webkitSpeechRecognition` availability and network behaviour vary; local recording and self-assessment remain available.
- Microphone access requires HTTPS or localhost and explicit learner action.
- Canvas feedback measures trace coverage; it is not handwriting recognition.

## Deployment verification

Public deployment completed successfully with the `Validate and deploy LingoLanka` workflow:

- Live URL: <https://ashfaaqaf-ai.github.io/lingolanka-language-learning/>
- Repository: <https://github.com/ashfaaqaf-ai/lingolanka-language-learning>
- Successful workflow run: <https://github.com/ashfaaqaf-ai/lingolanka-language-learning/actions/runs/30085305565>
- GitHub-hosted lint, typecheck, 19-test suite, subpath build, Pages artifact upload and deployment all passed.
- Root page, manifest, service worker, 192 px PWA icon and social image returned HTTP 200.
- The deployed Vocabulary hash route loaded with 264 entries and no browser console errors or warnings.
