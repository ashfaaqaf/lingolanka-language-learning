/**
 * Every outside work LingoLanka draws on, with its licence. Lessons cite these
 * by id and a locator (page, section), and the Sources page lists them all.
 *
 * Rule for adding a source: record the licence as the source states it, and
 * prefer public-domain or openly licensed works. A fact can be taken from any
 * reliable work with credit; wording and example sentences can only be reused
 * from works whose licence allows it, and that is what `reuse` records.
 */

export type SourceId =
  | "fsi-structures"
  | "wikipedia-sinhala"
  | "unicode-sinhala"
  | "icta-helpcentre"
  | "sinhala-vits"
  | "noto-sinhala"
  | "manrope"
  | "lucide";

export interface Source {
  id: SourceId;
  title: string;
  /** How a citation names it in running text. */
  short: string;
  author: string;
  publisher: string;
  year: string;
  url: string;
  licence: string;
  /** What LingoLanka takes from it. */
  use: string;
  /** Whether wording and examples may be reproduced, not only facts. */
  reuse: "text and examples" | "facts only" | "files under licence";
  note?: string;
}

export const sources: Record<SourceId, Source> = {
  "fsi-structures": {
    id: "fsi-structures",
    short: "FSI, Sinhala Structures (1979)",
    title: "Sinhala: Basic Course. Module 3: Sinhala Structures",
    author: "Bonnie Graham MacDougall and Kamini de Abrew",
    publisher:
      "Foreign Service Institute, U.S. Department of State (U.S. Government Printing Office); ERIC ED192571",
    year: "1979",
    url: "https://files.eric.ed.gov/fulltext/ED192571.pdf",
    licence:
      "Public domain in the United States: a work of the U.S. federal government (17 U.S.C. §105).",
    use: "Example sentences and grammar rules in the Intermediate and Expert levels.",
    reuse: "text and examples",
    note: "Sentences are quoted from the course with its page numbers. Where the 1979 typewriter print uses an older spelling (පුලුවනි, එලවන්න, නැ), the lesson uses today's standard spelling and says so. The book's photographs were supplied by the Ceylon Tourist Board and are not used."
  },
  "wikipedia-sinhala": {
    id: "wikipedia-sinhala",
    short: "Wikipedia, “Sinhala language”",
    title: "Sinhala language (revision 1378840435, 6 October 2026)",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    year: "2026",
    url: "https://en.wikipedia.org/w/index.php?title=Sinhala_language&oldid=1378840435",
    licence: "Creative Commons Attribution-ShareAlike 4.0",
    use: "Facts about word order, written and spoken Sinhala, and verb agreement.",
    reuse: "facts only",
    note: "Cited as a fixed revision so the source cannot change under the citation. Facts are restated in LingoLanka's own words; the two-word glossed examples it gives (පොත යට, මම පොහොසත්) are credited where they are used."
  },
  "unicode-sinhala": {
    id: "unicode-sinhala",
    short: "Unicode Standard, ch. 13",
    title: "The Unicode Standard, Chapter 13: South and Central Asia-II (Sinhala)",
    author: "The Unicode Consortium",
    publisher: "The Unicode Consortium",
    year: "2025",
    url: "https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-13/",
    licence: "Unicode Terms of Use",
    use: "Rules for al-lakuna and ZWJ used by the content audit.",
    reuse: "facts only"
  },
  "icta-helpcentre": {
    id: "icta-helpcentre",
    short: "Local Language Technical Help Center",
    title:
      "Issues pertaining to rendering and resolving labels with conjunct consonants, rakaransaya and yansaya forms in Sinhala script",
    author: "Local Language Technical Help Center",
    publisher: "helpcentre.lk",
    year: "n.d.",
    url: "https://helpcentre.lk/knowledgebase/issues-pertaining-to-rendering-and-resolving-labels-with-conjunct-consonants-rakaransaya-and-yansaya-forms-in-sinhala-script/",
    licence: "Not stated",
    use: "Why conjunct spellings are flagged for review rather than corrected automatically.",
    reuse: "facts only"
  },
  "sinhala-vits": {
    id: "sinhala-vits",
    short: "SinhalaVITS",
    title: "SinhalaVITS (Female Voice 2)",
    author:
      "Dialog Axiata PLC and the Dialog–University of Moratuwa Mobile Communications Research Laboratory",
    publisher: "Hugging Face Spaces",
    year: "2023",
    url: "https://huggingface.co/spaces/dialoglk/SinhalaVITS",
    licence: "Mozilla Public License 2.0 (model); generated clips bundled",
    use: "Recorded Sinhala pronunciation for the curriculum's words.",
    reuse: "files under licence",
    note: "The model is not shipped; only the clips it generated. See AUDIO_ATTRIBUTION.md."
  },
  "noto-sinhala": {
    id: "noto-sinhala",
    short: "Noto Sans Sinhala",
    title: "Noto Sans Sinhala",
    author: "Google and the Noto project",
    publisher: "Google Fonts via Fontsource",
    year: "2024",
    url: "https://fonts.google.com/noto/specimen/Noto+Sans+Sinhala",
    licence: "SIL Open Font License 1.1",
    use: "The Sinhala typeface, and the letter shapes that writing practice is scored against.",
    reuse: "files under licence"
  },
  manrope: {
    id: "manrope",
    short: "Manrope",
    title: "Manrope",
    author: "Mikhail Sharanda",
    publisher: "Google Fonts via Fontsource",
    year: "2019",
    url: "https://fonts.google.com/specimen/Manrope",
    licence: "SIL Open Font License 1.1",
    use: "The Latin typeface.",
    reuse: "files under licence"
  },
  lucide: {
    id: "lucide",
    short: "Lucide",
    title: "Lucide icons",
    author: "Lucide contributors",
    publisher: "lucide.dev",
    year: "2026",
    url: "https://lucide.dev",
    licence: "ISC License",
    use: "Interface icons.",
    reuse: "files under licence"
  }
};

export interface Citation {
  source: SourceId;
  /** Where in the source: a page and section, or a section heading. */
  at: string;
}

export const citationLabel = ({ source, at }: Citation) => `${sources[source].short}, ${at}`;
