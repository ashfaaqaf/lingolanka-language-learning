import { describe, expect, it } from "vitest";
import {
  conversations,
  courses,
  englishAlphabet,
  grammarTopics,
  sinhalaAlphabet,
  vocabulary
} from "../data/content";
import audioManifest from "../data/audioManifest.json";
import { englishPronunciation, sinhalaPronunciation } from "../data/pronunciation";

describe("curriculum content", () => {
  it("ships both learning directions and forty complete lessons", () => {
    expect(courses.map((course) => course.id)).toEqual([
      "english-to-sinhala",
      "sinhala-to-english"
    ]);
    expect(
      courses.flatMap((course) => course.levels).every((level) => level.modules.length > 0)
    ).toBe(true);
    expect(
      courses.flatMap((course) =>
        course.levels.flatMap((level) => level.modules.flatMap((module) => module.lessons))
      )
    ).toHaveLength(40);
  });

  it("contains the required content quantities with unique identifiers", () => {
    expect(vocabulary.length).toBeGreaterThanOrEqual(250);
    expect(conversations).toHaveLength(12);
    expect(grammarTopics).toHaveLength(12);
    const ids = vocabulary.map((word) => word.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses intact Sinhala Unicode and complete alphabet entries", () => {
    expect(vocabulary.find((word) => word.english === "hello")?.sinhala).toBe("ආයුබෝවන්");
    expect(sinhalaAlphabet.length).toBeGreaterThanOrEqual(30);
    expect(englishAlphabet).toHaveLength(26);
    expect(vocabulary.every((word) => word.audioText.english && word.audioText.sinhala)).toBe(true);
  });

  it("exposes at least eight exercise formats", () => {
    const types = new Set(
      courses.flatMap((course) =>
        course.levels.flatMap((level) =>
          level.modules.flatMap((module) =>
            module.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.type))
          )
        )
      )
    );
    expect(types.size).toBeGreaterThanOrEqual(8);
  });

  it("packages audio for the curriculum and pronunciation starter", () => {
    const manifest = audioManifest as Record<string, string>;
    expect(
      vocabulary.every(
        (word) => manifest[`en:${word.english}`] && manifest[`si:${word.sinhala}`]
      )
    ).toBe(true);
    expect(
      [...englishPronunciation, ...sinhalaPronunciation].every(
        (item) => manifest[`${item.language}:${item.text}`]
      )
    ).toBe(true);
  });
});
