# Linguistic content review

The core content is practical and internally consistent, but a qualified bilingual educator should review these areas before formal classroom adoption:

- Formal titles and vocative forms in “Greeting a teacher”
- Register differences for goodbye phrases (`ගිහින් එන්නම්`, `නැවත හමුවෙමු`)
- English loanword preference versus formal Sinhala in technology and workplace vocabulary
- Regional variation in common family terms and spoken question endings
- Transliteration treatment of prenasalised consonants and the `n̆d` readable approximation
- Medical vocabulary: confirm it remains strictly everyday communication and not clinical advice
- Native-audio spot checks across alphabet sounds, short and long vowels, prenasalised consonants, questions and full phrases
- Have a Sri Lankan primary-school Sinhala educator validate every authored SVG centreline, lift point and stroke sequence in `src/data/writingStrokes.ts` and `mobile/src/data/writing-strokes.ts` before formal classroom adoption; the current paths are adapted from the FSI construction diagrams and require teacher sign-off for regional handwriting conventions.
- The unverified Sinhala centreline drafts are intentionally excluded from the learner-facing web and mobile writing tools. Learners see the real rendered glyph shape and self-comparison only; numbered stroke order and numeric accuracy must remain disabled until an educator approves each guide.
- User-supplied visual references reviewed on 2026-08-10: [Sinhala Alphabet - Trace Sinhala Alphabet Letters](https://www.youtube.com/watch?v=BhjNj52RXwU) and [Sinhala Alphabet - Trace Sinhala Akuru](https://www.youtube.com/watch?v=37DIs9_QTxA), both published by Sinhala Hodiya. Their demonstrated `අ` guide uses six numbered checkpoints and visibly disagrees with LingoLanka's rejected three-path draft. Treat the videos as correction evidence, not final authority: the markers may be checkpoints within continuous pen movements rather than six separate pen lifts, so an educator must resolve that distinction before implementation.
- Expanded YouTube and official-source research is recorded in `artifacts/review/Sinhala-Stroke-YouTube-Evidence-Audit-2026-08-10.md`. It cross-checks the Ministry of Education Grade 1 resources against real-teacher demonstrations from Home School Lanka and independent Grade 1 channels. No reviewed source provides a complete official start/direction/lift specification for all 16 writing-studio characters, so every authored path remains blocked pending educator approval.
- Educator review started on 2026-08-10 with a 16-character DOCX pack and CSV register in `artifacts/review/`. Every linguistic and handwriting decision remains `PENDING` until a named Sinhala educator records and signs a decision.
- Learner-facing visual QA passed for all 16 writing-studio characters on 2026-08-10: the selected character, ghost glyph and animated outline matched, and no draft numbered path was present. This is a software-rendering result, not educator approval of handwriting formation.
- Run `scripts/validate_stroke_review.py` before implementing educator feedback. Engineering may begin only when all 16 rows contain a valid signed decision; `REVISE` rows must also contain concrete correction notes.
- Run `scripts/export-stroke-corrections.ps1` against the completed correction workbook before changing learner paths. It emits implementation CSV/JSON files only after all character decisions and active stroke rows pass the educator-approval gate.

## Mechanical text audit — 2026-08-10

Run `node scripts/audit_sinhala_text.mjs` to reproduce. It audits 267 web and 8 mobile Sinhala entries and checks **only what can be decided without knowing Sinhala**: Unicode well-formedness, internal self-consistency, and disagreement between the two apps. It deliberately does not judge word choice, standard spelling or register. It exits non-zero on any Tier 1 finding, so it can gate CI.

Conjunct rules are taken from [The Unicode Standard ch. 13, "Sinhala"](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-13/): an al-lakuna (`U+0DCA`) is **always visible and does not join** unless combined with ZWJ (`U+200D`); the sequence `<al-lakuna, ZWJ>` produces ligated conjuncts such as the yansaya (post-base `ය`) and rakaransaya (below-base `ර`).

### Tier 1 — self-evident, no Sinhala expertise required

- **`ද්‍ය` is encoded two different ways in the same corpus.** Three entries use `<al-lakuna, ZWJ>` — `වෛද්‍යවරයා` (doctor), `විද්‍යුත් තැපෑල` (email), `උද්‍යානය` (park) — while `උද්යෝගිමත්` (excited, `src/data/content.ts:259`) omits the ZWJ, so its al-lakuna renders visibly instead of ligating. Whichever spelling is correct, the corpus contradicts itself and the odd one out is the single entry. An educator should confirm the target form before either is changed.
- **The two apps translate `කොහොමද?` differently.** Web teaches "how?"; mobile teaches "how are you?" (`mobile/src/data/curriculum.ts:40`). Both are defensible readings, but a learner using both apps is taught two different things. Pick one and align.

### Tier 2 — needs a Sinhala educator to decide

Five entries write `consonant + al-lakuna + ය/ර` without ZWJ, so the al-lakuna stays visible rather than forming a yansaya or rakaransaya. **This may well be correct** — a visible al-lakuna is standard in many Sinhala words, and per the [ICTA/LK help centre guidance](https://helpcentre.lk/knowledgebase/issues-pertaining-to-rendering-and-resolving-labels-with-conjunct-consonants-rakaransaya-and-yansaya-forms-in-sinhala-script/) the underlying encoding cannot be inferred from how a word looks on paper. These are questions, not defects:

| Word              | Meaning     | Cluster | Location                  |
| ----------------- | ----------- | ------- | ------------------------- |
| `කාර්යාලය`        | office      | `ර්ය`   | `src/data/content.ts:157` |
| `දුම්රිය`         | train       | `ම්ර`   | `src/data/content.ts:171` |
| `තැපැල් කාර්යාලය` | post office | `ර්ය`   | `src/data/content.ts:195` |
| `උද්යෝගිමත්`      | excited     | `ද්ය`   | `src/data/content.ts:259` |
| `අනිවාර්යයෙන්ම`   | certainly   | `ර්ය`   | `src/data/content.ts:286` |

### Tier 3 — structural, not linguistic

- **Every usage example is one template.** `src/data/content.ts:344` generates each word's example as `"${sinhala}" එදිනෙදා කතාබහේ භාවිත කරන්න.` — "use X in everyday conversation" — for all 267 entries. No word gets a real usage sentence. This needs authored examples per word, and each will then need review.
- **The mobile curriculum teaches 8 Sinhala strings against the web's 267.** Not drift in content but a coverage gap; the apps are effectively different products.
- **Transliteration is hand-authored per entry, not centralised**, which `AGENTS.md` requires. The scheme is at least internally coherent — ISO 15919-style, using combining macron (143×), dot below (71×), breve for prenasalisation (11×) and acute (4×) — but nothing enforces that, so drift is invisible until someone reads it.

### Clean results worth recording

All 267 entries are NFC-normalised, no vowel sign appears without a base consonant, no stray ZWJ, and no conflicting transliteration for any repeated Sinhala string. The `මාළු`/`මාළුවා` (fish) and `දුරකථනය` (telephone/phone) pairs are plausible variants rather than contradictions and were not raised as findings.

Do not move these notes into the learner interface. Submit corrections with context and preserve all record IDs where possible.
