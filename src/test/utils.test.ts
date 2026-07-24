import { describe, expect, it } from "vitest";
import {
  calculateStreak,
  isCorrectAnswer,
  normalizeAnswer,
  scheduleReview,
  shuffleUnique,
  similarity
} from "../lib/utils";

describe("answer handling", () => {
  it("normalizes spacing, punctuation, case and composed Unicode", () => {
    expect(normalizeAnswer("  Hello,   WORLD! ")).toBe("hello world");
    expect(normalizeAnswer("ආයුබෝවන්!")).toBe("ආයුබෝවන්");
  });

  it("accepts alternatives without exposing or duplicating options", () => {
    expect(isCorrectAnswer("hi", "hello", ["Hi"])).toBe(true);
    expect(shuffleUnique(["a", "a", "b"], () => 0)).toHaveLength(2);
  });

  it("returns an honest word-overlap speaking score", () => {
    expect(similarity("how are you", "how are you")).toBe(100);
    expect(similarity("how are you", "how you")).toBe(67);
  });
});

describe("spaced review scheduler", () => {
  const now = new Date("2026-07-24T10:00:00.000Z");
  it("puts Again back in the queue after ten minutes", () => {
    const record = scheduleReview(undefined, "again", now);
    expect(record.intervalDays).toBe(0);
    expect(record.nextReview).toBe("2026-07-24T10:10:00.000Z");
    expect(record.incorrect).toBe(1);
  });

  it("increases intervals and confidence for successful recalls", () => {
    const good = scheduleReview(undefined, "good", now);
    const easy = scheduleReview(good, "easy", now);
    expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
    expect(easy.confidence).toBeGreaterThan(good.confidence);
    expect(easy.consecutiveCorrect).toBe(2);
  });

  it("calculates current and longest streaks", () => {
    const result = calculateStreak(
      ["2026-07-21T10:00:00Z", "2026-07-22T10:00:00Z", "2026-07-24T10:00:00Z"],
      now
    );
    expect(result).toEqual({ current: 1, longest: 2 });
  });
});
