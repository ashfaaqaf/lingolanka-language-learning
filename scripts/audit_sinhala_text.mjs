/**
 * Mechanical audit of the Sinhala text in the curriculum.
 *
 *   node scripts/audit_sinhala_text.mjs
 *
 * This checks only what can be decided WITHOUT knowing Sinhala: encoding
 * well-formedness, internal self-consistency, and disagreement between the web
 * and mobile curricula. It deliberately does not judge whether a word is the
 * right word, spelled the standard way, or pitched at the right register —
 * those need a Sinhala educator, and findings go to CONTENT_REVIEW.md.
 *
 * Exits non-zero if any TIER 1 (self-evident) defect is found, so it can gate CI.
 *
 * Reference for the conjunct rules: The Unicode Standard, ch. 13 (South and
 * Central Asia-I), "Sinhala" — an al-lakuna is visible and does NOT join unless
 * combined with ZWJ; <al-lakuna, ZWJ> produces ligated conjuncts such as the
 * yansaya (post-base ya) and rakaransaya (below-base ra).
 */
import { readFileSync } from "node:fs";

const AL = "්"; // SINHALA SIGN AL-LAKUNA (virama)
const ZWJ = "‍";
const CONS = /[ක-ෆ]/;
const VSIGN = /[ා-ෟ]/;
const SIN = /[඀-෿]/;
const YA = "ය";
const RA = "ර";

const codepoints = (s) =>
  [...s].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" ");

function entriesFrom(src) {
  const out = [];
  const line = (i) => src.slice(0, i).split("\n").length;
  for (const m of src.matchAll(/\[\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\]/g))
    if (SIN.test(m[2])) out.push({ en: m[1], si: m[2], tr: m[3], line: line(m.index) });
  for (const m of src.matchAll(/english:\s*"([^"]*)"[^}]{0,240}?sinhala:\s*"([^"]*)"/g))
    if (SIN.test(m[2])) out.push({ en: m[1], si: m[2], tr: "", line: line(m.index) });
  for (const m of src.matchAll(/sinhala:\s*"([^"]*)"[^}]{0,240}?english:\s*"([^"]*)"/g))
    if (SIN.test(m[1])) out.push({ en: m[2], si: m[1], tr: "", line: line(m.index) });
  return out;
}

const web = entriesFrom(readFileSync("src/data/content.ts", "utf8"));
const mobile = entriesFrom(readFileSync("mobile/src/data/curriculum.ts", "utf8"));

const tier1 = [];
const tier2 = [];

// --- T1: the same consonant cluster encoded both with and without ZWJ -------
// Self-evident: whichever is right, the corpus contradicts itself.
const clusters = new Map();
for (const e of web) {
  const s = e.si;
  for (let i = 1; i < s.length - 1; i++) {
    if (s[i] !== AL || !CONS.test(s[i - 1])) continue;
    const zwj = s[i + 1] === ZWJ;
    const next = zwj ? s[i + 2] : s[i + 1];
    if (!next || !CONS.test(next)) continue;
    const key = s[i - 1] + next;
    if (!clusters.has(key)) clusters.set(key, { with: [], without: [] });
    clusters.get(key)[zwj ? "with" : "without"].push(`${s} (${e.en})`);
  }
}
for (const [key, u] of clusters)
  if (u.with.length && u.without.length)
    tier1.push({
      check: "conjunct encoded inconsistently",
      cluster: key,
      withZwj: [...new Set(u.with)],
      withoutZwj: [...new Set(u.without)]
    });

// --- T1: malformed sequences ------------------------------------------------
for (const e of [...web, ...mobile]) {
  const s = e.si;
  for (let i = 0; i < s.length; i++) {
    if (VSIGN.test(s[i]) && !(CONS.test(s[i - 1] ?? "") || VSIGN.test(s[i - 1] ?? "")))
      tier1.push({
        check: "vowel sign with no base consonant",
        word: s,
        en: e.en,
        codepoints: codepoints(s)
      });
    if (s[i] === ZWJ && s[i - 1] !== AL && s[i + 1] !== AL)
      tier1.push({ check: "stray ZWJ", word: s, en: e.en, codepoints: codepoints(s) });
  }
  if (s !== s.normalize("NFC"))
    tier1.push({ check: "not NFC-normalised", word: s, en: e.en, codepoints: codepoints(s) });
}

// --- T1: the two apps disagree about the same string ------------------------
const byWord = (list) => {
  const m = new Map();
  for (const e of list) {
    if (!m.has(e.si)) m.set(e.si, new Set());
    m.get(e.si).add(e.en.toLowerCase().trim());
  }
  return m;
};
const w = byWord(web);
const mo = byWord(mobile);
for (const [si, mEn] of mo) {
  if (!w.has(si)) continue;
  const wEn = [...w.get(si)];
  if (![...mEn].some((x) => wEn.includes(x)))
    tier1.push({ check: "web and mobile disagree", sinhala: si, web: wEn, mobile: [...mEn] });
}

// --- T2: conjunct candidates needing an educator ----------------------------
// A visible al-lakuna is correct in plenty of words, and the Unicode encoding
// cannot be inferred from how a word looks on paper, so these are questions,
// not defects.
for (const e of web) {
  const s = e.si;
  for (let i = 1; i < s.length - 1; i++) {
    if (s[i] !== AL || !CONS.test(s[i - 1])) continue;
    if ((s[i + 1] === YA || s[i + 1] === RA) && s[i + 1] !== ZWJ)
      tier2.push({
        check: `${s[i + 1] === YA ? "yansaya" : "rakaransaya"} candidate: no ZWJ, so the al-lakuna stays visible`,
        word: s,
        en: e.en,
        tr: e.tr,
        line: `src/data/content.ts:${e.line}`,
        codepoints: codepoints(s)
      });
  }
}

const show = (title, list) => {
  console.log(`\n${title} (${list.length})`);
  for (const f of list) console.log("  " + JSON.stringify(f));
};
console.log(`web entries: ${web.length}   mobile entries: ${mobile.length}`);
show("TIER 1 — self-evident, fix without needing Sinhala expertise", tier1);
show("TIER 2 — needs a Sinhala educator to decide", tier2);
console.log(
  `\n${tier1.length} tier-1 defect(s). Record outcomes in CONTENT_REVIEW.md; never edit learner text on this script's word alone.`
);
process.exit(tier1.length ? 1 : 0);
