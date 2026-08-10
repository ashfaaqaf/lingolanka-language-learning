import { describe, expect, it } from "vitest";
import { dilate, scoreGlyphTrace, type GlyphMask } from "../lib/glyphTrace";

const SIZE = 40;

/** Builds a mask from a predicate over pixel coordinates. */
const mask = (fn: (x: number, y: number) => boolean): GlyphMask => {
  const data = new Uint8Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) data[y * SIZE + x] = fn(x, y) ? 1 : 0;
  return { data, width: SIZE, height: SIZE };
};

// A vertical bar standing in for a letter.
const letter = mask((x) => x >= 18 && x <= 22);

describe("glyph trace scoring", () => {
  it("grows a mask by the dilation radius", () => {
    const dot = mask((x, y) => x === 20 && y === 20);
    const grown = dilate(dot, 2);
    expect(grown.data[20 * SIZE + 20]).toBe(1);
    expect(grown.data[20 * SIZE + 22]).toBe(1); // within radius
    expect(grown.data[20 * SIZE + 23]).toBe(0); // beyond it
  });

  it("scores a faithful trace highly", () => {
    const result = scoreGlyphTrace(letter, letter, 2);
    expect(result.coverage).toBe(100);
    expect(result.control).toBe(100);
    expect(result.level).toBe("excellent");
  });

  it("returns zero when nothing was drawn", () => {
    const empty = mask(() => false);
    expect(scoreGlyphTrace(empty, letter).score).toBe(0);
  });

  it("does not reward covering the whole pad in ink", () => {
    // The reason control exists: scribbling over everything trivially touches
    // the entire letter, so coverage alone would call it a perfect trace.
    const scribble = mask(() => true);
    const result = scoreGlyphTrace(scribble, letter, 2);
    expect(result.coverage).toBe(100);
    expect(result.control).toBeLessThan(35);
    // Harmonic mean: one strong side cannot carry a weak one, so a scribble
    // lands well below the 70 that counts the letter as written.
    expect(result.score).toBeLessThan(55);
    expect(result.level).toBe("retry");
    expect(result.weakest).toBe("control");
  });

  it("marks a half-finished letter down on coverage", () => {
    const half = mask((x, y) => x >= 18 && x <= 22 && y < SIZE / 2);
    const result = scoreGlyphTrace(half, letter, 2);
    expect(result.coverage).toBeLessThan(60);
    expect(result.control).toBe(100); // what was drawn was in the right place
    expect(result.weakest).toBe("coverage");
  });

  it("accepts a slightly wobbly trace within tolerance", () => {
    const wobbly = mask((x, y) => {
      const offset = y % 6 < 3 ? 1 : -1;
      return x >= 18 + offset && x <= 22 + offset;
    });
    expect(scoreGlyphTrace(wobbly, letter, 3).level).toBe("excellent");
  });
});
