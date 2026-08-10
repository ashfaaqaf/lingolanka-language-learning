/**
 * Scores a traced letter against the font-rendered glyph.
 *
 * The authored stroke centrelines in `writingStrokes.ts` are unverified and
 * gated out of learner code, which left the trace tool unable to say anything
 * about a learner's attempt. But judging *shape* never needed those: the glyph
 * shipped in the font is the authoritative letter form, so it can be rasterised
 * and compared directly.
 *
 * This deliberately reports only what a shape comparison can honestly support:
 *
 *   coverage — how much of the letter the learner actually drew over
 *   control  — how much of what they drew landed on the letter, which is what
 *              separates writing it from scribbling across it
 *
 * It says nothing about stroke order, direction or pen lifts. Those need the
 * educator review, and no amount of pixel comparison substitutes for it.
 */

export interface GlyphMask {
  /** 1 where the glyph (or ink) is present, 0 elsewhere. */
  data: Uint8Array;
  width: number;
  height: number;
}

export interface GlyphTraceResult {
  score: number;
  coverage: number;
  control: number;
  level: "excellent" | "close" | "developing" | "retry";
  weakest: "coverage" | "control";
}

/**
 * Separable max filter — grows a mask by `radius` pixels so "did the ink pass
 * near this part of the letter" becomes a plain intersection test. Two 1-D
 * passes rather than a circular kernel: the difference is a slightly square
 * halo, which is invisible at the tolerances we use and much cheaper.
 */
export function dilate({ data, width, height }: GlyphMask, radius: number): GlyphMask {
  if (radius <= 0) return { data, width, height };
  const horizontal = new Uint8Array(data.length);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let hit = 0;
      const from = Math.max(0, x - radius);
      const to = Math.min(width - 1, x + radius);
      for (let i = from; i <= to && !hit; i++) hit = data[row + i]!;
      horizontal[row + x] = hit;
    }
  }
  const out = new Uint8Array(data.length);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let hit = 0;
      const from = Math.max(0, y - radius);
      const to = Math.min(height - 1, y + radius);
      for (let i = from; i <= to && !hit; i++) hit = horizontal[i * width + x]!;
      out[y * width + x] = hit;
    }
  }
  return { data: out, width, height };
}

const count = (mask: GlyphMask) => {
  let n = 0;
  for (let i = 0; i < mask.data.length; i++) if (mask.data[i]) n++;
  return n;
};

const overlap = (a: GlyphMask, b: GlyphMask) => {
  let n = 0;
  for (let i = 0; i < a.data.length; i++) if (a.data[i] && b.data[i]) n++;
  return n;
};

const pct = (value: number) => Math.max(0, Math.min(100, Math.round(value * 100)));

/**
 * @param tolerance how far from the letter a mark still counts as on it, in
 *   pixels. Tracing by hand on a touchscreen is imprecise; this is the
 *   allowance, and it should scale with the pen width the learner is using.
 */
export function scoreGlyphTrace(
  ink: GlyphMask,
  glyph: GlyphMask,
  tolerance = 12
): GlyphTraceResult {
  const inkPixels = count(ink);
  const glyphPixels = count(glyph);
  if (!inkPixels || !glyphPixels)
    return { score: 0, coverage: 0, control: 0, level: "retry", weakest: "coverage" };

  // How much of the letter was drawn over.
  const coverage = overlap(glyph, dilate(ink, tolerance)) / glyphPixels;
  // How much of the drawing was on the letter. Without this, covering the whole
  // pad in ink would score a perfect trace.
  const control = overlap(ink, dilate(glyph, tolerance)) / inkPixels;

  // Harmonic mean, not a weighted sum. Coverage and control are recall and
  // precision, and a weighted sum lets one carry the other: inking the whole
  // pad scores coverage 1.0 and used to total 69 - one point under the mark
  // that counts the letter as written. The harmonic mean drops that to the
  // high 30s, because it is pulled down by whichever side is worse.
  const score = pct((2 * coverage * control) / (coverage + control));
  const level =
    score >= 85 ? "excellent" : score >= 70 ? "close" : score >= 45 ? "developing" : "retry";

  return {
    score,
    coverage: pct(coverage),
    control: pct(control),
    level,
    weakest: coverage <= control ? "coverage" : "control"
  };
}

/** Rasterises a character to a mask using the same font stack the page renders. */
export function rasteriseGlyph(
  character: string,
  width: number,
  height: number,
  /** Pass the exact font string the on-screen ghost glyph uses, so the mask
   *  cannot drift out of alignment with what the learner traced. */
  font: string
): GlyphMask | null {
  if (typeof document === "undefined" || width <= 0 || height <= 0) return null;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  // Fill the box the way the on-screen ghost glyph does, so the mask lines up
  // with what the learner was tracing rather than with an idealised em box.
  context.fillStyle = "#000";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = font;
  context.fillText(character, canvas.width / 2, canvas.height / 2);

  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  } catch {
    return null; // canvas unavailable (jsdom, tainted context)
  }
  const data = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < data.length; i++) data[i] = pixels[i * 4 + 3]! > 32 ? 1 : 0;
  return { data, width: canvas.width, height: canvas.height };
}

/** Rasterises the learner's strokes with the pen width they actually drew at. */
export function rasteriseStrokes(
  strokes: readonly (readonly { x: number; y: number }[])[],
  width: number,
  height: number,
  penWidth: number
): GlyphMask | null {
  if (typeof document === "undefined" || width <= 0 || height <= 0) return null;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.strokeStyle = "#000";
  context.lineWidth = penWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  for (const stroke of strokes) {
    if (!stroke.length) continue;
    context.beginPath();
    context.moveTo(stroke[0]!.x, stroke[0]!.y);
    for (const point of stroke.slice(1)) context.lineTo(point.x, point.y);
    // A single tap still leaves a dot, which should count as ink.
    if (stroke.length === 1) context.lineTo(stroke[0]!.x + 0.01, stroke[0]!.y);
    context.stroke();
  }

  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  } catch {
    return null;
  }
  const data = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < data.length; i++) data[i] = pixels[i * 4 + 3]! > 32 ? 1 : 0;
  return { data, width: canvas.width, height: canvas.height };
}
