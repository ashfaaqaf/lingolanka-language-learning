import type { WritingStroke } from "../data/writingStrokes";

export interface TracePoint {
  x: number;
  y: number;
}

export interface TraceAccuracyResult {
  score: number;
  coverage: number;
  control: number;
  strokeOrder: number;
  level: "excellent" | "close" | "developing" | "retry";
  weakest: "coverage" | "control" | "strokeOrder";
}

const VIEWBOX_SIZE = 320;

const distance = (a: TracePoint, b: TracePoint) => Math.hypot(a.x - b.x, a.y - b.y);

const sampleLine = (from: TracePoint, to: TracePoint, count = 12) =>
  Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / count;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  });

const sampleCubic = (
  from: TracePoint,
  first: TracePoint,
  second: TracePoint,
  to: TracePoint,
  count = 28
) =>
  Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / count;
    const inverse = 1 - t;
    return {
      x:
        inverse ** 3 * from.x +
        3 * inverse ** 2 * t * first.x +
        3 * inverse * t ** 2 * second.x +
        t ** 3 * to.x,
      y:
        inverse ** 3 * from.y +
        3 * inverse ** 2 * t * first.y +
        3 * inverse * t ** 2 * second.y +
        t ** 3 * to.y
    };
  });

export function sampleWritingPath(path: string): TracePoint[] {
  const tokens = path.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  const points: TracePoint[] = [];
  let index = 0;
  let current = { x: 0, y: 0 };
  let origin = current;
  let command = "";

  const number = () => Number(tokens[index++]);

  while (index < tokens.length) {
    if (/^[MLCZ]$/.test(tokens[index]!)) command = tokens[index++]!;
    if (command === "M") {
      current = { x: number(), y: number() };
      origin = current;
      points.push(current);
      command = "L";
    } else if (command === "L") {
      const next = { x: number(), y: number() };
      points.push(...sampleLine(current, next));
      current = next;
    } else if (command === "C") {
      const first = { x: number(), y: number() };
      const second = { x: number(), y: number() };
      const next = { x: number(), y: number() };
      points.push(...sampleCubic(current, first, second, next));
      current = next;
    } else if (command === "Z") {
      points.push(...sampleLine(current, origin));
      current = origin;
      command = "";
    } else {
      break;
    }
  }
  return points;
}

function resampleTrace(stroke: readonly TracePoint[], scaleX: number, scaleY: number) {
  if (!stroke.length) return [];
  const normalized = stroke.map((point) => ({ x: point.x * scaleX, y: point.y * scaleY }));
  const sampled = [normalized[0]!];
  normalized.slice(1).forEach((point, index) => {
    const previous = normalized[index]!;
    const segments = Math.max(1, Math.ceil(distance(previous, point) / 6));
    sampled.push(...sampleLine(previous, point, segments));
  });
  return sampled;
}

const proximityScore = (
  source: readonly TracePoint[],
  target: readonly TracePoint[],
  tolerance: number
) => {
  if (!source.length || !target.length) return 0;
  const matches = source.filter((point) =>
    target.some((candidate) => distance(point, candidate) <= tolerance)
  ).length;
  return Math.round((matches / source.length) * 100);
};

export function scoreTraceAccuracy(
  drawnStrokes: readonly (readonly TracePoint[])[],
  guideStrokes: readonly WritingStroke[],
  canvasWidth: number,
  canvasHeight: number
): TraceAccuracyResult {
  const scaleX = VIEWBOX_SIZE / Math.max(1, canvasWidth);
  const scaleY = VIEWBOX_SIZE / Math.max(1, canvasHeight);
  const drawnByStroke = drawnStrokes.map((stroke) => resampleTrace(stroke, scaleX, scaleY));
  const drawn = drawnByStroke.flat();
  const guideByStroke = guideStrokes.map((stroke) => sampleWritingPath(stroke.d));
  const guide = guideByStroke.flat();

  const coverage = proximityScore(guide, drawn, 22);
  const control = proximityScore(drawn, guide, 25);
  const comparedStarts = Math.min(drawnByStroke.length, guideStrokes.length);
  const startScore = comparedStarts
    ? Array.from({ length: comparedStarts }, (_, index) => {
        const start = drawnByStroke[index]?.[0];
        if (!start) return 0;
        return Math.max(
          0,
          100 -
            distance(start, {
              x: guideStrokes[index]!.start[0],
              y: guideStrokes[index]!.start[1]
            }) *
              2.2
        );
      }).reduce((total, value) => total + value, 0) / guideStrokes.length
    : 0;
  const countScore = Math.max(
    0,
    100 - Math.abs(drawnStrokes.length - guideStrokes.length) * (100 / guideStrokes.length)
  );
  const strokeOrder = Math.round(startScore * 0.75 + countScore * 0.25);
  const score = Math.round(coverage * 0.5 + control * 0.3 + strokeOrder * 0.2);
  const dimensions = { coverage, control, strokeOrder };
  const weakest = (Object.keys(dimensions) as Array<keyof typeof dimensions>).reduce(
    (lowest, key) => (dimensions[key] < dimensions[lowest] ? key : lowest)
  );

  return {
    score,
    coverage,
    control,
    strokeOrder,
    weakest,
    level: score >= 85 ? "excellent" : score >= 70 ? "close" : score >= 45 ? "developing" : "retry"
  };
}
