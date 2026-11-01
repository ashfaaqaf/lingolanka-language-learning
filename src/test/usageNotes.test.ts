import { describe, expect, it } from "vitest";
import { vocabulary } from "../data/content";
import { usageNotes } from "../data/usageNotes";
import { realExampleFor } from "../lib/examples";

describe("usage notes", () => {
  it("attaches every note to a word the app actually teaches", () => {
    // A key with a typo, a stray ZWJ or a different spelling would never be
    // shown to anyone, silently.
    const taught = new Set(vocabulary.map((word) => word.sinhala));
    const orphans = Object.keys(usageNotes).filter((key) => !taught.has(key));
    expect(orphans).toEqual([]);
  });

  it("warns about the translations most likely to mislead or offend", () => {
    expect(usageNotes["පන්සල"]?.note).toMatch(/Buddhist/);
    expect(usageNotes["බල්ලා"]?.kind).toBe("respect");
    expect(usageNotes["නැන්දා"]?.kind).toBe("meaning");
  });

  it("keeps notes normalised so they render as the curriculum does", () => {
    for (const [key, value] of Object.entries(usageNotes)) {
      expect(key).toBe(key.normalize("NFC"));
      expect(value.note).toBe(value.note.normalize("NFC"));
      expect(value.note.length).toBeGreaterThan(20);
    }
  });
});

describe("real examples", () => {
  it("finds a word used in one of the app's own sentences", () => {
    expect(realExampleFor("තේ")?.english).toBe("Tea, please.");
  });

  it("matches whole words only, not a word hidden inside an inflected one", () => {
    // ඔබ appears only as part of ඔබට in the corpus, which is a different word form.
    expect(realExampleFor("ඔබ")).toBeUndefined();
  });

  it("shows nothing rather than inventing a sentence", () => {
    expect(realExampleFor("සමනලයා")).toBeUndefined();
  });
});
