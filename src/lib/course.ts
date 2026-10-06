import { courses } from "../data/content";
import type { LearningDirection, ProgressRecord } from "../types";

/**
 * Where the learner is in their current course. The dashboard computes the same
 * figures inline; this exists so the global nav can show them without
 * depending on a page component.
 */
export function courseProgress(direction: LearningDirection, progress: ProgressRecord[]) {
  const course = courses.find((item) => item.id === direction) ?? courses[0]!;
  const lessons = course.levels.flatMap((level) =>
    level.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, level })))
  );
  const done = new Set(progress.map((record) => record.id));
  const remaining = lessons.filter((lesson) => !done.has(lesson.id));
  const completed = lessons.length - remaining.length;
  return {
    course,
    lessons,
    completed,
    total: lessons.length,
    percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    /** Undefined once every lesson is complete. */
    next: remaining[0],
    upcoming: remaining.slice(0, 4)
  };
}
