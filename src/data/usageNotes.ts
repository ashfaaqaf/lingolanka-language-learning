/**
 * Notes that stop a learner from being misled — or from giving offence — by a
 * one-word translation. Keyed by the vocabulary entry's Sinhala text.
 *
 *   meaning   the English gloss is narrower or wider than the Sinhala word
 *   respect   the word is safe in one use and insulting or loaded in another
 *   register  the word is correct but not what people actually say aloud
 *
 * Kept deliberately short and limited to well-established usage. Every note is
 * listed in CONTENT_REVIEW.md for sign-off by a Sinhala educator; correct or
 * extend them there rather than here, and keep the wording in plain English so
 * it can be checked by someone who is not a programmer.
 */

export type UsageKind = "meaning" | "respect" | "register";

export interface UsageNote {
  kind: UsageKind;
  note: string;
}

export const usageNotes: Record<string, UsageNote> = {
  // ---- places of worship ------------------------------------------------
  පන්සල: {
    kind: "meaning",
    note: "පන්සල (pansala) means a Buddhist temple, not any temple. A Hindu temple is කෝවිල (kōvila), and a church or a mosque is පල්ලිය (palliya). Calling another faith's place of worship a පන්සල is wrong and can cause offence."
  },

  // ---- greetings and address ---------------------------------------------
  ආයුබෝවන්: {
    kind: "meaning",
    note: "Literally “may you live long”. A respectful Sinhala greeting, often said with the palms pressed together, and used for goodbye as well as hello. Tamil-speaking Sri Lankans greet each other with “vanakkam”."
  },
  "ගිහින් එන්නම්": {
    kind: "meaning",
    note: "Literally “I will go and come” — said by the person who is leaving, as a promise to return. A bare “I am going” (මම යනවා, mama yanavā) can sound abrupt or final."
  },
  "ඔබට කොහොමද?": {
    kind: "register",
    note: "ඔබ (oba) is the polite “you”, but it sounds formal in conversation. Many speakers avoid “you” altogether and use the person's name or a family word such as අක්කා (akkā) or අයියා (ayiyā). Never use උඹ (umba) or තෝ (tō) with strangers or elders: they are intimate at best and rude at worst."
  },
  කරුණාකර: {
    kind: "register",
    note: "Formal, and common on signs and notices. In conversation, politeness is carried more by the polite verb ending (for example -න්න, -nna) and tone of voice than by a separate word for “please”."
  },

  // ---- family: Sinhala names the side and the age -----------------------
  සහෝදරයා: {
    kind: "register",
    note: "Formal and written. In conversation people say අයියා (ayiyā) for an elder brother and මල්ලි (malli) for a younger one — and use the same words as a friendly way to address men of a similar age."
  },
  සහෝදරිය: {
    kind: "register",
    note: "Formal and written. In conversation people say අක්කා (akkā) for an elder sister and නංගි (naṅgi) for a younger one — and use the same words as a friendly way to address women of a similar age."
  },
  නැන්දා: {
    kind: "meaning",
    note: "Narrower than “aunt”: නැන්දා (nændā) is a father's sister, and also a mother's brother's wife and a mother-in-law. A mother's sister is පුංචි අම්මා (puṅci ammā) if she is younger than your mother, or ලොකු අම්මා (loku ammā) if older."
  },
  මාමා: {
    kind: "meaning",
    note: "Narrower than “uncle”: මාමා (māmā) is a mother's brother, and also a father's sister's husband and a father-in-law. A father's brother is බාප්පා (bāppā) if he is younger than your father, or ලොකු තාත්තා (loku tāttā) if older."
  },

  // ---- people ------------------------------------------------------------
  කාන්තාව: {
    kind: "respect",
    note: "The respectful word. Avoid ගෑනි (gǣni) about anyone you do not know well: it is blunt and can be insulting."
  },
  ගුරුවරයා: {
    kind: "register",
    note: "The dictionary word. Students speaking to a teacher usually say “sir” or “miss”, borrowed from English, and the respectful written form is ගුරුතුමා (gurutumā)."
  },

  // ---- words that wound when aimed at people -----------------------------
  බල්ලා: {
    kind: "respect",
    note: "Fine for the animal. Said to or about a person, it is a serious insult."
  },
  වඳුරා: {
    kind: "respect",
    note: "Fine for the animal. Said to or about a person, it is an insult."
  },
  කළු: {
    kind: "respect",
    note: "Neutral for things. Describing people by their skin colour is sensitive, and remarks about dark skin in particular can wound."
  },
  සුදු: {
    kind: "respect",
    note: "Neutral for things. Describing people by skin colour is sensitive, and සුදු is also the root of සුද්දා (suddā), a casual and sometimes disparaging word for a white foreigner."
  },
  ආඩම්බර: {
    kind: "meaning",
    note: "Can mean “proud of”, but often means vain or conceited — so calling a person ආඩම්බර can be a criticism rather than praise."
  },

  // ---- food --------------------------------------------------------------
  බත්: {
    kind: "meaning",
    note: "Cooked rice. Uncooked rice is සහල් (sahal), and rice still growing in the field is වී (vī)."
  },
  මාළු: {
    kind: "meaning",
    note: "Fish as food. A single living fish is මාළුවා (māḷuvā)."
  },
  මාළුවා: {
    kind: "meaning",
    note: "A living fish, the animal. Fish as food is මාළු (māḷu)."
  }
};

export const usageLabels: Record<UsageKind, string> = {
  meaning: "Meaning",
  respect: "Use with care",
  register: "How it's said"
};

export const usageNoteFor = (sinhala: string | undefined) =>
  sinhala ? usageNotes[sinhala] : undefined;
