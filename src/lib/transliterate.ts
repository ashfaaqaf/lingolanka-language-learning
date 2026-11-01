/**
 * Sinhala script → Latin transliteration, following the ISO 15919 style the
 * curriculum's hand-written transliterations use (ā ǣ ī ū ē ō for long
 * vowels, dot-below for retroflex consonants, breve for prenasalised stops).
 *
 * It transliterates spelling, not pronunciation: Sinhala speech reduces many
 * written "a" vowels, which this does not model. That matches the existing
 * curriculum and keeps the output checkable letter by letter.
 *
 * AGENTS.md asks for transliteration to be centralised; new content uses this
 * rather than hand-typed romanisation, and a test compares it with the
 * curriculum's existing hand-written entries.
 */

const INDEPENDENT_VOWELS: Record<string, string> = {
  අ: "a",
  ආ: "ā",
  ඇ: "æ",
  ඈ: "ǣ",
  ඉ: "i",
  ඊ: "ī",
  උ: "u",
  ඌ: "ū",
  ඍ: "ṛ",
  ඎ: "ṝ",
  ඏ: "ḷ",
  ඐ: "ḹ",
  එ: "e",
  ඒ: "ē",
  ඓ: "ai",
  ඔ: "o",
  ඕ: "ō",
  ඖ: "au"
};

const CONSONANTS: Record<string, string> = {
  ක: "k",
  ඛ: "kh",
  ග: "g",
  ඝ: "gh",
  ඞ: "ṅ",
  ඟ: "n̆g",
  ච: "c",
  ඡ: "ch",
  ජ: "j",
  ඣ: "jh",
  ඤ: "ñ",
  ඥ: "gn",
  ඦ: "n̆j",
  ට: "ṭ",
  ඨ: "ṭh",
  ඩ: "ḍ",
  ඪ: "ḍh",
  ණ: "ṇ",
  ඬ: "n̆ḍ",
  ත: "t",
  ථ: "th",
  ද: "d",
  ධ: "dh",
  න: "n",
  ඳ: "n̆d",
  ප: "p",
  ඵ: "ph",
  බ: "b",
  භ: "bh",
  ම: "m",
  ඹ: "m̆b",
  ය: "y",
  ර: "r",
  ල: "l",
  ව: "v",
  ශ: "ś",
  ෂ: "ṣ",
  ස: "s",
  හ: "h",
  ළ: "ḷ",
  ෆ: "f"
};

const VOWEL_SIGNS: Record<string, string> = {
  "ා": "ā",
  "ැ": "æ",
  "ෑ": "ǣ",
  "ි": "i",
  "ී": "ī",
  "ු": "u",
  "ූ": "ū",
  "ෘ": "ṛ",
  "ෲ": "ṝ",
  "ෟ": "ḷ",
  "ෳ": "ḹ",
  "ෙ": "e",
  "ේ": "ē",
  "ෛ": "ai",
  "ො": "o",
  "ෝ": "ō",
  "ෞ": "au"
};

const AL_LAKUNA = "්";
const ZWJ = "‍";
const ANUSVARA = "ං";
const VISARGA = "ඃ";

export function transliterate(sinhala: string): string {
  const chars = [...sinhala.normalize("NFC")];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    if (ch === ZWJ) continue;
    if (INDEPENDENT_VOWELS[ch]) {
      out += INDEPENDENT_VOWELS[ch];
    } else if (CONSONANTS[ch]) {
      out += CONSONANTS[ch];
      // Look past joiners for what modifies this consonant.
      let j = i + 1;
      while (chars[j] === ZWJ) j++;
      const next = chars[j];
      if (next === AL_LAKUNA) {
        i = j; // bare consonant, no vowel
      } else if (next && VOWEL_SIGNS[next]) {
        out += VOWEL_SIGNS[next];
        i = j;
      } else {
        out += "a"; // inherent vowel
      }
    } else if (ch === ANUSVARA) {
      // Sinhala anusvara is always pronounced /ŋ/, so ṅ rather than ISO's ṁ.
      out += "ṅ";
    } else if (ch === VISARGA) {
      out += "ḥ";
    } else if (ch === AL_LAKUNA || VOWEL_SIGNS[ch]) {
      // A sign with no consonant before it is malformed input; skip it.
    } else {
      out += ch;
    }
  }
  return out;
}
