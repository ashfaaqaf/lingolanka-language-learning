import { describe, expect, it } from "vitest";
import { advancedLessons } from "../data/advanced";
import { courses, vocabulary } from "../data/content";
import { sources } from "../data/sources";
import { transliterate } from "../lib/transliterate";

const sinhala = /[඀-෿]/;
// A vowel sign or al-lakuna with no consonant before it renders as a dotted circle.
const orphanSign = /(^|[^ක-ෆ‍])[්-ෟෲෳ]/u;

describe("Intermediate and Expert ledger", () => {
  it("quotes every sentence from a source that allows reuse, with a page", () => {
    for (const lesson of advancedLessons) {
      for (const example of lesson.examples) {
        expect(sources[example.cite.source].reuse, example.si).toBe("text and examples");
        expect(example.cite.at, example.si).toMatch(/^pp?\. \d/);
      }
    }
  });

  it("names a location for every cited fact", () => {
    for (const lesson of advancedLessons) {
      const cites = [
        ...lesson.points.flatMap((point) => (point.cite ? [point.cite] : [])),
        ...(lesson.checks ?? []).map((check) => check.cite)
      ];
      for (const cite of cites) {
        expect(sources[cite.source], lesson.id).toBeDefined();
        expect(cite.at.length, lesson.id).toBeGreaterThan(1);
      }
      // A lesson may carry one uncited editorial line, never more.
      expect(lesson.points.filter((point) => !point.cite).length, lesson.id).toBeLessThanOrEqual(1);
    }
  });

  it("keeps Sinhala normalised and well-formed", () => {
    for (const lesson of advancedLessons) {
      const texts = [
        lesson.titleSi,
        ...lesson.examples.map((example) => example.si),
        ...lesson.points.map((point) => point.text)
      ];
      for (const text of texts) {
        expect(text, text).toBe(text.normalize("NFC"));
        expect(orphanSign.test(text), text).toBe(false);
      }
      for (const example of lesson.examples) expect(sinhala.test(example.si)).toBe(true);
    }
  });

  it("gives every lesson something to practise, with distinct answers", () => {
    for (const lesson of advancedLessons) {
      expect(
        lesson.examples.length + (lesson.checks?.length ?? 0),
        lesson.id
      ).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.examples.map((example) => example.en)).size).toBe(
        lesson.examples.length
      );
      expect(new Set(lesson.examples.map((example) => example.si)).size).toBe(
        lesson.examples.length
      );
    }
  });

  it("adds two levels to the Sinhala course only", () => {
    const [toSinhala, toEnglish] = courses;
    expect(toSinhala!.levels.map((level) => level.name).slice(-2)).toEqual([
      "Intermediate",
      "Expert"
    ]);
    expect(toEnglish!.levels).toHaveLength(5);
    const lessons = toSinhala!.levels.slice(-2).flatMap((level) => level.modules[0]!.lessons);
    expect(lessons).toHaveLength(advancedLessons.length);
    for (const lesson of lessons) {
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(4);
      for (const exercise of lesson.exercises) {
        expect(exercise.distractors).not.toContain(exercise.correctAnswer);
        expect(exercise.distractors.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("transliterate", () => {
  it("agrees with the curriculum's hand-written transliterations", () => {
    const written = vocabulary.filter((word) => word.transliteration);
    const same = written.filter((word) => transliterate(word.sinhala) === word.transliteration);
    // The handful of differences are logged in CONTENT_REVIEW.md (ව after a
    // vowel, and prenasalised ඳ/ඹ written as plain n/m by hand).
    expect(same.length).toBeGreaterThanOrEqual(257);
  });

  it("handles conjuncts, inherent vowels and anusvara", () => {
    expect(transliterate("ඉංග්‍රීසි")).toBe("iṅgrīsi");
    expect(transliterate("මම ගෙදර යනවා.")).toBe("mama gedara yanavā.");
    expect(transliterate("බත්")).toBe("bat");
    expect(transliterate("ඳ")).toBe("n̆da");
  });
});
