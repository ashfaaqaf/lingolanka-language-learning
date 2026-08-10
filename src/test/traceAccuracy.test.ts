import { describe, expect, it } from "vitest";
import { getWritingStrokeGuide } from "../data/writingStrokes";
import { sampleWritingPath, scoreTraceAccuracy } from "../lib/traceAccuracy";

describe("local tracing accuracy", () => {
  const guide = getWritingStrokeGuide("A");

  it("recognises a trace that follows every authored path", () => {
    expect(guide.authored).toBe(true);
    const trace = guide.strokes.map((stroke) => sampleWritingPath(stroke.d));
    const result = scoreTraceAccuracy(trace, guide.strokes, 320, 320);
    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.coverage).toBe(100);
    expect(result.strokeOrder).toBe(100);
  });

  it("does not reward a short mark as accurate writing", () => {
    const result = scoreTraceAccuracy(
      [
        [
          { x: 10, y: 10 },
          { x: 14, y: 14 }
        ]
      ],
      guide.strokes,
      320,
      320
    );
    expect(result.score).toBeLessThan(35);
    expect(result.level).toBe("retry");
  });

  it("never exposes unreviewed Sinhala draft paths to learners", () => {
    const sinhalaGuide = getWritingStrokeGuide("අ");

    expect(sinhalaGuide.authored).toBe(true);
    expect(sinhalaGuide.reviewed).toBe(false);
    expect(sinhalaGuide.strokes).toEqual([]);
  });
});
