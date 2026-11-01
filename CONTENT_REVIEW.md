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

### Tier 1 — self-evident, no Sinhala expertise required — RESOLVED 2026-08-10

- **`ද්‍ය` was encoded two different ways in the same corpus.** Three entries used `<al-lakuna, ZWJ>` — `වෛද්‍යවරයා` (doctor), `විද්‍යුත් තැපෑල` (email), `උද්‍යානය` (park) — while `උද්යෝගිමත්` (excited) omitted the ZWJ, so its al-lakuna rendered visibly instead of ligating. **Fixed:** ZWJ inserted, `U+0DAF U+0DCA U+0DBA` → `U+0DAF U+0DCA U+200D U+0DBA`, bringing the outlier into line with the other three.

  **The basis for this fix is internal consistency only, and an educator should still confirm it.** Web sources cannot settle it: ZWJ is invisible, so a dictionary entry renders identically whether or not it is present, and searching for the word returns the same glyphs either way. What is certain is that the corpus previously contradicted itself; whether `උද්‍යෝගිමත්` or `උද්යෝගිමත්` is the standard spelling is still an open question, now applied consistently rather than inconsistently.

- **The two apps translated `කොහොමද?` differently.** Web taught "how?"; mobile taught "how are you?". **Fixed** in favour of the web mapping, which the corpus supports directly: `src/data/content.ts:273` teaches `කොහොමද?` = "how?" and `:22` teaches `ඔබට කොහොමද?` = "how are you?", and the conversation at `:638` uses `ආයුබෝවන්! ඔබට කොහොමද?` for the greeting. Mobile now teaches `ඔබට කොහොමද?` / `obaṭa kohomada?` for "how are you?", so both apps keep the distinction between the question word and the greeting.

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

## Writing tool: shape scoring enabled, stroke order still gated — 2026-08-10

Gating the unverified centrelines was right, but it left the trace tool unable to tell a learner anything: it showed the finished letter, said "trace this", and returned no feedback. Learners could copy a shape without ever learning whether they had drawn the letter.

Judging _shape_ never needed the authored centrelines. The glyph in the bundled font is the authoritative letter form, so `src/lib/glyphTrace.ts` rasterises it and compares it with the learner's ink. That reports two things a shape comparison honestly supports — coverage (how much of the letter was drawn over) and control (how much of the drawing landed on the letter) — combined as a harmonic mean so neither can carry the other.

**This still does not teach stroke order, and the UI says so** in both languages: stroke order, direction and pen lifts are explicitly excluded from the score. That remains blocked on educator sign-off, and the review pack in `artifacts/review/` is the critical path — no amount of pixel comparison substitutes for it.

Verified in a real browser against `අ`, `ආ`, `ක` and `ම`: a faithful trace scores 100, and inking the whole pad scores 35–49 and never reaches the 70 that marks the letter written.

Do not move these notes into the learner interface. Submit corrections with context and preserve all record IDs where possible.

## Usage notes — pending educator review (2026-11-01)

One-word translations were misleading learners in ways that can cause offence. `src/data/usageNotes.ts` now attaches a short plain-English note to 19 words, shown on Wordbook cards, flashcards, Review cards and in the lesson's "Learn this first" panel. Each is labelled **Meaning** (the gloss is narrower than the Sinhala), **Use with care** (safe in one use, insulting or loaded in another) or **How it's said** (correct, but not what people say aloud).

These notes introduce Sinhala words the curriculum did not previously teach (for example කෝවිල, අයියා, බාප්පා, සහල්). They were limited to well-established usage, but every one needs sign-off. Correct the wording in `usageNotes.ts`; a test fails if a note's key stops matching a taught word.

| Word              | Kind          | What the note says                                                                                         |
| ----------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| පන්සල             | Meaning       | Buddhist temple specifically; Hindu temple කෝවිල, church or mosque පල්ලිය                                  |
| ආයුබෝවන්          | Meaning       | "May you live long"; hello and goodbye; Tamil speakers say "vanakkam"                                      |
| ගිහින් එන්නම්     | Meaning       | "I will go and come"; a bare මම යනවා can sound abrupt or final                                             |
| ඔබට කොහොමද?       | How it's said | ඔබ is formal in speech; names or kin words preferred; never උඹ / තෝ with strangers or elders               |
| කරුණාකර           | How it's said | Formal, common on signs; speech relies on the polite verb ending                                           |
| සහෝදරයා / සහෝදරිය | How it's said | Formal; speech uses අයියා, මල්ලි, අක්කා, නංගි, also as friendly address                                    |
| නැන්දා            | Meaning       | Father's sister (also mother's brother's wife, mother-in-law); mother's sister is පුංචි / ලොකු අම්මා       |
| මාමා              | Meaning       | Mother's brother (also father's sister's husband, father-in-law); father's brother is බාප්පා / ලොකු තාත්තා |
| කාන්තාව           | Use with care | Respectful; ගෑනි is blunt and can insult                                                                   |
| ගුරුවරයා          | How it's said | Students say "sir" / "miss"; respectful written form ගුරුතුමා                                              |
| බල්ලා / වඳුරා     | Use with care | Insults when said to or about a person                                                                     |
| කළු / සුදු        | Use with care | Skin-colour use is sensitive; සුද්දා can be disparaging                                                    |
| ආඩම්බර            | Meaning       | Often "vain", not only "proud of"                                                                          |
| බත්               | Meaning       | Cooked rice; uncooked සහල්, growing වී                                                                     |
| මාළු / මාළුවා     | Meaning       | Fish as food / a living fish                                                                               |

### Also found while writing these

- **The generated example sentence is gone.** Every word showed "Use X in everyday conversation." It now shows a real sentence from the app's conversations or grammar guides when the word appears in one as a whole word (19 of 264 words), and nothing otherwise.
- **The corpus holds only 17 real sentences.** Conversation lines repeat across the 12 conversations, and every grammar topic shows the same two examples ("I read a book", "She is at home"). Both need authored, reviewed sentences.
- **Part of speech:** `lonely = තනිකම` is a noun ("loneliness") and `sad = දුකෙන්` is adverbial ("sadly"), while the English glosses are adjectives.
- **The "temple" card still glosses පන්සල as plain "temple"** above the note. Changing the English text would orphan its recorded audio clip, so the gloss should change together with a new recording.
