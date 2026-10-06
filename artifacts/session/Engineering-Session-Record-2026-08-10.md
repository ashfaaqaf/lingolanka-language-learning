# Engineering session record — 2026-08-10

Covers the project relocation, a design and accessibility pass, motion work on both
apps, and a mechanical audit of the Sinhala text. Written so the reasoning survives
independently of the commit messages.

**Everything described here is committed.** Nothing is left only on disk.

---

## Repositories

| | Location | Branch | State |
| --- | --- | --- | --- |
| Web PWA | `github.com/ashfaaqaf/lingolanka-language-learning` | `agent/mobile-pwa-install` | pushed |
| Mobile (Expo) | `github.com/ashfaaqaf/lingolanka-mobile` | `master` | pushed |

`origin/main` is at **`b7c8f6e`** and deployed live. The most recent commit,
`5dbc437`, is pushed to the branch but **not merged to main**, so the trace scoring
described below is not yet live.

Live site: https://ashfaaqaf.github.io/lingolanka-language-learning/

### Web commits

| Commit | What |
| --- | --- |
| `323daf8` | heading typography scaled to size; press feedback; `prefers-contrast` |
| `5c6ac66` | prettier `endOfLine` and a `.prettierignore` |
| `d1c01f0` | WCAG contrast corrections |
| `c7f57a2` | critically damped springs; glass tracks the pointer 1:1 |
| `c1991da` | Sinhala text audit script and findings |
| `b7c8f6e` | the two tier-1 Sinhala fixes |
| `5dbc437` | trace scoring against the font glyph (**not on main**) |

### Mobile commits

`e5073bf` initial commit including the fluidity pass · `7ecd115` the `කොහොමද?` alignment.

---

## The relocation

Moved from `C:\Users\L E N O V O\Desktop\LingoLanka` to `C:\projects\LingoLanka`.
Git history and `node_modules` survived intact and **no source or config change was
needed** — the only stale references to the old path are in generated output
(`.codex-spreadsheet-work/`, `mobile/.expo/cache/`, `mobile/android/build/`, `work/`).

Incidental benefit: the new path has no spaces, so the browser-preview launcher works
without the batch-file workaround the old path required.

---

## Design and accessibility

**Typography.** Tracking and leading were fixed per tag, but `h2` runs from 17px
(`.settings-section`) to 58px (`.focus-card`), so one value was wrong at one end.
Both are now linear in the element's own font size, anchored at the two extremes
actually shipped — measured at -0.034em/1.08 at 50px through -0.004em/1.37 at 17px.
This avoids adding a pair of values to each of the ~35 size overrides.

Sinhala headings curve separately (1.45 → 1.71) because the script needs more leading,
and **regained `letter-spacing: 0`** — the `lang="si"` rule only reached headings by
inheritance, so the `h1/h2/h3` rule was beating it and applying -0.035em to vowel signs
and conjuncts. That was pre-existing.

**Contrast.** All ten foreground/background pairs were measured in both themes. Four
failed; the serious one was the **focus ring at 2.10:1**, where WCAG 1.4.11 requires
3:1 — a keyboard user in light mode could barely see where they were. It now has its
own `--focus` token. Corrections preserve hue and saturation and move lightness the
minimum distance to clear threshold, so nothing looks different.

| | before | after |
| --- | --- | --- |
| Focus ring (light) | 2.10:1 | 3.16:1 |
| `--brand-2` transliteration | 4.41:1 | 4.72:1 |
| `--accent-fill` (light) | 4.07:1 | 4.72:1 |
| `--accent-fill` (dark, trace score) | 3.14:1 | 4.55:1 |

---

## Motion

**Web.** Every spring was converted to its damping ratio. Four of six were
under-damped — AudioButton 0.73, ExerciseCard 0.79, choice press 0.72, feedback banner
0.68 — and **none followed a gesture carrying momentum**. Overshoot belongs to flicks
and throws, not to a card that appeared or a status banner. Six hand-rolled
stiffness/damping/mass triplets became two named tokens in `src/lib/motion.ts`.

The glass highlight was fighting itself: its gradient centre is a background position
and tracked the pointer 1:1, while the parallax drift sat inside a transform
transitioned over **0.5s**. Splitting onto the individual `translate` and `scale`
properties lets the drift track 1:1 while the scale still eases. A standing
`will-change` on every glass surface was also dropped in favour of promoting on
hover/active.

**Mobile.** Reanimated and Gesture Handler were both already dependencies and
**neither was used**; all motion was one legacy `Animated.timing`, and six touchables
had no press response at all.

The trace pad was the real cost. Every touch move rebuilt the whole stroke array,
re-rendered, and remounted the SVG path — the key embedded the point count. One letter
of ~300 points cost roughly **45,000 point copies, 300 renders and 300 remounts**. The
active stroke now lives in a shared value appended on the UI thread and rendered
through `useAnimatedProps`, reaching React only when the finger lifts.

`GestureHandlerRootView` was missing; without it gestures fail silently.

> **Not runtime-verified.** No simulator or device was available. `tsc --noEmit` and
> `expo lint` pass, but worklet compilation and gesture firing are not covered by
> either. The trace pad needs testing on hardware.

---

## Sinhala content

Audited with `node scripts/audit_sinhala_text.mjs`, which checks **only what can be
decided without knowing Sinhala** and exits non-zero on tier-1 findings. Both tier-1
items were fixed; full reasoning is in `CONTENT_REVIEW.md`.

The conjunct fix rests on **internal consistency alone** — ZWJ is invisible, so no web
source can settle it. Renaming that string orphaned its audio clip, since the manifest
is keyed by the text; the key was remapped to the same recording because ZWJ carries no
phonetic content.

**Four tier-2 questions remain open** and need an educator: `කාර්යාලය`, `දුම්රිය`,
`තැපැල් කාර්යාලය`, `අනිවාර්යයෙන්ම`.

---

## The writing tool

Gating the unverified centrelines was correct, but it left the tool unable to say
anything: it showed the letter, said "trace this", and returned *"a numeric score will
return only after an educator verifies the guide."*

Judging *shape* never needed those centrelines — the font glyph is the authoritative
letter form. `src/lib/glyphTrace.ts` rasterises it and reports coverage and control,
combined as a **harmonic mean** rather than a weighted sum: under the weighted version
inking the whole pad scored 69, one point under the 70 that marks a letter written.

Measured in a real browser against actual glyphs: faithful trace 100; full-pad scribble
35 (`අ`), 46 (`ආ`), 47 (`ක`), 49 (`ම`); stray line 0.

**This does not teach stroke order**, and the UI now says so in both languages.

---

## Outstanding

1. **Educator sign-off is the critical path.** No reviewed source gives a complete
   start/direction/lift specification for all 16 characters, so there is nothing correct
   to enable. The review pack in `artifacts/review/` plus
   `scripts/validate_stroke_review.py` is a human bottleneck, not an engineering one.
2. **`5dbc437` is not on main** — the trace scoring is not live.
3. **Trace-pad rewrite is untested on hardware.**
4. **39 uncommitted entries in the web repo** belong to a separate effort (the
   writing-tutorial/tracing feature, regenerated icons, `scripts/`, `artifacts/`) and
   were deliberately left untouched throughout.
5. **All 267 usage examples come from one template** (`src/data/content.ts:344`), and
   the mobile curriculum carries 8 Sinhala strings against the web's 267.
6. Deploy workflow actions target Node 20, which GitHub now force-runs on Node 24.
