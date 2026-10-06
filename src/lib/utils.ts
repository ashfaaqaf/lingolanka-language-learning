import type { ReviewRecord } from "../types";

export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,!?;:'"“”‘’]/g, "")
    .replace(/\s+/g, " ");
}

export function isCorrectAnswer(
  input: string,
  correct: string | string[],
  alternatives: string[] = []
): boolean {
  const accepted = [...(Array.isArray(correct) ? correct : [correct]), ...alternatives].map(
    normalizeAnswer
  );
  return accepted.includes(normalizeAnswer(input));
}

export function shuffleUnique<T>(values: T[], random = Math.random): T[] {
  const unique = [...new Set(values)];
  for (let index = unique.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [unique[index], unique[swapIndex]] = [unique[swapIndex] as T, unique[index] as T];
  }
  return unique;
}

export function similarity(expected: string, actual: string): number {
  const left = normalizeAnswer(expected).split(" ").filter(Boolean);
  const right = new Set(normalizeAnswer(actual).split(" ").filter(Boolean));
  if (!left.length) return 0;
  return Math.round((left.filter((word) => right.has(word)).length / left.length) * 100);
}

export type ReviewRating = "again" | "difficult" | "good" | "easy";

export function scheduleReview(
  previous: ReviewRecord | undefined,
  rating: ReviewRating,
  now = new Date()
): ReviewRecord {
  const base = previous ?? {
    id: "",
    timesSeen: 0,
    correct: 0,
    incorrect: 0,
    confidence: 0,
    lastReviewed: "",
    nextReview: "",
    intervalDays: 0,
    consecutiveCorrect: 0
  };
  const multipliers: Record<ReviewRating, number> = {
    again: 0,
    difficult: 1.2,
    good: 2.2,
    easy: 3.5
  };
  const interval =
    rating === "again"
      ? 0
      : Math.max(1, Math.round(Math.max(1, base.intervalDays) * multipliers[rating]));
  const next = new Date(now);
  if (rating === "again") next.setMinutes(next.getMinutes() + 10);
  else next.setDate(next.getDate() + interval);
  const correct = rating !== "again";
  return {
    ...base,
    timesSeen: base.timesSeen + 1,
    correct: base.correct + (correct ? 1 : 0),
    incorrect: base.incorrect + (correct ? 0 : 1),
    confidence: Math.max(
      0,
      Math.min(1, base.confidence + (rating === "again" ? -0.18 : rating === "easy" ? 0.22 : 0.12))
    ),
    lastReviewed: now.toISOString(),
    nextReview: next.toISOString(),
    intervalDays: interval,
    consecutiveCorrect: correct ? base.consecutiveCorrect + 1 : 0
  };
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function calculateStreak(
  dates: string[],
  now = new Date()
): { current: number; longest: number } {
  const unique = [...new Set(dates.map((date) => date.slice(0, 10)))].sort();
  let longest = 0;
  let run = 0;
  let previous: Date | undefined;
  for (const key of unique) {
    const date = new Date(`${key}T12:00:00`);
    const days = previous ? Math.round((date.getTime() - previous.getTime()) / 86_400_000) : 1;
    run = days === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const today = todayKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const last = unique.at(-1);
  const current = last === today || last === todayKey(yesterday) ? run : 0;
  return { current, longest };
}
