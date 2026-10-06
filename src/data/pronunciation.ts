export interface PronunciationItem {
  id: string;
  text: string;
  language: "en" | "si";
  sayLike: string;
  meaningEn: string;
  meaningSi: string;
  tipEn: string;
  tipSi: string;
}

export const sinhalaPronunciation: PronunciationItem[] = [
  {
    id: "si-a-short",
    text: "අ",
    language: "si",
    sayLike: "a",
    meaningEn: "a short open sound",
    meaningSi: "කෙටි විවෘත හඬක්",
    tipEn: "Keep it short and relaxed.",
    tipSi: "හඬ කෙටිව සහ සැහැල්ලුවෙන් කියන්න."
  },
  {
    id: "si-a-long",
    text: "ආ",
    language: "si",
    sayLike: "aa",
    meaningEn: "a longer open sound",
    meaningSi: "දිගු විවෘත හඬක්",
    tipEn: "Hold the sound a little longer than අ.",
    tipSi: "අ හඬට වඩා ටිකක් දිගට කියන්න."
  },
  {
    id: "si-i",
    text: "ඉ",
    language: "si",
    sayLike: "i",
    meaningEn: "a short i sound",
    meaningSi: "කෙටි ඉ හඬ",
    tipEn: "Smile slightly and keep the sound short.",
    tipSi: "මඳක් සිනාසී හඬ කෙටිව කියන්න."
  },
  {
    id: "si-u",
    text: "උ",
    language: "si",
    sayLike: "u",
    meaningEn: "a short u sound",
    meaningSi: "කෙටි උ හඬ",
    tipEn: "Round your lips gently.",
    tipSi: "තොල් මඳක් වට කර කියන්න."
  },
  {
    id: "si-hello",
    text: "ආයුබෝවන්",
    language: "si",
    sayLike: "ā-yu-bō-van",
    meaningEn: "hello",
    meaningSi: "ආචාර කිරීම",
    tipEn: "Keep ā and bō long: ā · yu · bō · van.",
    tipSi: "ā සහ bō හඬ දිගට තබා ā · yu · bō · van ලෙස කියන්න."
  },
  {
    id: "si-thanks",
    text: "ස්තුතියි",
    language: "si",
    sayLike: "stu-ti-yi",
    meaningEn: "thank you",
    meaningSi: "ස්තුති කිරීම",
    tipEn: "Start with st, then say tu-ti-yi clearly.",
    tipSi: "st හඬෙන් අරඹා tu-ti-yi පැහැදිලිව කියන්න."
  },
  {
    id: "si-water",
    text: "වතුර",
    language: "si",
    sayLike: "va-tu-ra",
    meaningEn: "water",
    meaningSi: "ජලය",
    tipEn: "Use three even beats: va · tu · ra.",
    tipSi: "va · tu · ra ලෙස සමාන කොටස් තුනකින් කියන්න."
  },
  {
    id: "si-home",
    text: "ගෙදර",
    language: "si",
    sayLike: "ge-da-ra",
    meaningEn: "home",
    meaningSi: "නිවස",
    tipEn: "Keep each syllable light; do not rush the middle sound.",
    tipSi: "සෑම අක්ෂර මාලාවක්ම සැහැල්ලුවෙන් කියන්න."
  }
];

export const englishPronunciation: PronunciationItem[] = [
  {
    id: "en-a",
    text: "A",
    language: "en",
    sayLike: "ay",
    meaningEn: "letter A",
    meaningSi: "A අකුර",
    tipEn: "Listen to the letter name, then repeat once.",
    tipSi: "අකුරේ නම අසා එක් වරක් නැවත කියන්න."
  },
  {
    id: "en-e",
    text: "E",
    language: "en",
    sayLike: "ee",
    meaningEn: "letter E",
    meaningSi: "E අකුර",
    tipEn: "Stretch the ee sound gently.",
    tipSi: "ee හඬ මඳක් දිගට කියන්න."
  },
  {
    id: "en-i",
    text: "I",
    language: "en",
    sayLike: "eye",
    meaningEn: "letter I",
    meaningSi: "I අකුර",
    tipEn: "The letter name sounds like the word eye.",
    tipSi: "මෙම අකුරේ නම eye යන වචනය වගේ ඇසෙයි."
  },
  {
    id: "en-o",
    text: "O",
    language: "en",
    sayLike: "oh",
    meaningEn: "letter O",
    meaningSi: "O අකුර",
    tipEn: "Round your lips and say oh.",
    tipSi: "තොල් වට කර oh ලෙස කියන්න."
  },
  {
    id: "en-hello",
    text: "hello",
    language: "en",
    sayLike: "heh-loh",
    meaningEn: "a greeting",
    meaningSi: "ආචාර කිරීමක්",
    tipEn: "Stress the second part slightly: he-LO.",
    tipSi: "දෙවන කොටස මඳක් පැහැදිලිව කියන්න: he-LO."
  },
  {
    id: "en-thanks",
    text: "thank you",
    language: "en",
    sayLike: "thank-yoo",
    meaningEn: "showing thanks",
    meaningSi: "ස්තුති කිරීම",
    tipEn: "Let a little air pass for the th sound.",
    tipSi: "th හඬ කියන විට මඳක් වාතය පිට කරන්න."
  },
  {
    id: "en-water",
    text: "water",
    language: "en",
    sayLike: "waw-ter",
    meaningEn: "water",
    meaningSi: "වතුර",
    tipEn: "Say it in two clear parts: wa · ter.",
    tipSi: "wa · ter ලෙස පැහැදිලි කොටස් දෙකකින් කියන්න."
  },
  {
    id: "en-please",
    text: "please",
    language: "en",
    sayLike: "pleez",
    meaningEn: "a polite word",
    meaningSi: "ආචාරශීලී වචනයක්",
    tipEn: "Join pl smoothly and finish with a z sound.",
    tipSi: "pl එකට කියා අවසානයේ z හඬක් යොදන්න."
  }
];
