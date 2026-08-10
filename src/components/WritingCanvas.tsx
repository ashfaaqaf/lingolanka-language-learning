import { Check, Eye, EyeOff, Redo2, RotateCcw, ShieldCheck, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getWritingStrokeGuide } from "../data/writingStrokes";
import { writingToolCopy, type WritingInterfaceLanguage } from "../data/writingTutorial";
import { scoreTraceAccuracy, type TraceAccuracyResult } from "../lib/traceAccuracy";
import {
  rasteriseGlyph,
  rasteriseStrokes,
  scoreGlyphTrace,
  type GlyphTraceResult
} from "../lib/glyphTrace";
import { WritingTutorial } from "./WritingTutorial";

interface Point {
  x: number;
  y: number;
}

export function WritingCanvas({
  character = "අ",
  characterLanguage = "si",
  interfaceLanguage = "en",
  onComplete
}: {
  character?: string;
  characterLanguage?: "en" | "si";
  interfaceLanguage?: WritingInterfaceLanguage;
  onComplete?: () => void;
}) {
  const copy = writingToolCopy[interfaceLanguage];
  const strokeGuide = getWritingStrokeGuide(character);
  const usesVerifiedStrokes = strokeGuide.reviewed && strokeGuide.strokes.length > 0;
  const initialMessage = usesVerifiedStrokes
    ? copy.initialMessage
    : interfaceLanguage === "si"
      ? "මඳ පැහැති නිවැරදි අකුරු හැඩය මත ලියන්න. අවසානයේ ඔබේ හැඩය එය සමඟ සසඳන්න."
      : "Trace over the pale font-rendered letter. Then compare your shape with it.";
  const compareLabel = interfaceLanguage === "si" ? "අකුරු හැඩය සසඳන්න" : "Compare with letter";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [redo, setRedo] = useState<Point[][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [guide, setGuide] = useState(true);
  const [width, setWidth] = useState(8);
  const [message, setMessage] = useState(initialMessage);
  const [accuracy, setAccuracy] = useState<TraceAccuracyResult | null>(null);
  // Shape-only score, used when no educator-verified stroke guide exists.
  const [shape, setShape] = useState<GlyphTraceResult | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width * ratio)) {
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);
    const theme = getComputedStyle(document.documentElement);
    if (guide) {
      if (
        usesVerifiedStrokes &&
        typeof Path2D !== "undefined" &&
        typeof context.save === "function" &&
        typeof context.scale === "function"
      ) {
        context.save();
        context.scale(rect.width / 320, rect.height / 320);
        context.strokeStyle =
          theme.getPropertyValue("--draw-guide").trim() || "rgb(47 130 144 / 0.2)";
        context.lineWidth = 18;
        context.lineCap = "round";
        context.lineJoin = "round";
        strokeGuide.strokes.forEach((item, index) => {
          context.stroke(new Path2D(item.d));
          context.fillStyle = theme.getPropertyValue("--accent-fill").trim() || "#b86a16";
          context.beginPath();
          context.arc(item.start[0], item.start[1], 11, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = theme.getPropertyValue("--surface").trim() || "#fffefa";
          context.font = "700 11px Manrope, sans-serif";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(String(index + 1), item.start[0], item.start[1] + 0.5);
        });
        context.restore();
      } else {
        context.fillStyle =
          theme.getPropertyValue("--draw-guide").trim() || "rgb(47 130 144 / 0.14)";
        context.font = `${Math.min(rect.width, rect.height) * 0.72}px "Noto Sans Sinhala", sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(character, rect.width / 2, rect.height / 2);
      }
    }
    context.strokeStyle = theme.getPropertyValue("--draw-ink").trim() || "#226e78";
    context.lineWidth = width;
    context.lineCap = "round";
    context.lineJoin = "round";
    strokes.forEach((stroke) => {
      context.beginPath();
      stroke.forEach((point, index) =>
        index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)
      );
      context.stroke();
    });
  };

  useEffect(draw, [strokes, guide, width, character, strokeGuide, usesVerifiedStrokes]);
  useEffect(() => {
    const resize = () => draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  });

  const point = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const startPoint = point(event);
    setDrawing(true);
    setAccuracy(null);
    setShape(null);
    setMessage(initialMessage);
    setRedo([]);
    setStrokes((current) => [...current, [startPoint]]);
  };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const next = point(event);
    setStrokes((current) =>
      current.map((stroke, index) => (index === current.length - 1 ? [...stroke, next] : stroke))
    );
  };
  const check = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!usesVerifiedStrokes) {
      const pointCount = strokes.reduce((total, item) => total + item.length, 0);
      if (pointCount < 8) {
        setMessage(
          interfaceLanguage === "si"
            ? "අකුරේ වැඩි කොටසක් ලියා නැවත සසඳන්න."
            : "Draw more of the letter before comparing it."
        );
        return;
      }
      setAccuracy(null);
      setShape(null);
      // No verified stroke guide, but the letter's own glyph is authoritative,
      // so shape can still be scored honestly - just not stroke order.
      const box = canvas.getBoundingClientRect();
      const glyphFont = `${Math.min(box.width, box.height) * 0.72}px "Noto Sans Sinhala", sans-serif`;
      const glyphMask = rasteriseGlyph(character, box.width, box.height, glyphFont);
      const inkMask = rasteriseStrokes(strokes, box.width, box.height, width);
      if (!glyphMask || !inkMask) {
        setShape(null);
        setMessage(
          interfaceLanguage === "si"
            ? "ඔබේ ලිවීම මඳ පැහැති අකුරු හැඩය සමඟ සසඳන්න."
            : "Compare your drawing with the pale letter shape."
        );
        onComplete?.();
        return;
      }
      const shapeResult = scoreGlyphTrace(inkMask, glyphMask, Math.max(8, width));
      setShape(shapeResult);
      setMessage(`${copy.levels[shapeResult.level]}. ${copy.tips[shapeResult.weakest]}`);
      if (shapeResult.score >= 70) onComplete?.();
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const result = scoreTraceAccuracy(strokes, strokeGuide.strokes, rect.width, rect.height);
    setShape(null);
    setAccuracy(result);
    setMessage(`${copy.levels[result.level]}. ${copy.tips[result.weakest]}`);
    if (result.score >= 70) onComplete?.();
  };
  // One shape for both scorers: the verified path adds a stroke-order metric,
  // the shape-only path honestly omits it rather than showing a fabricated bar.
  const report = accuracy
    ? {
        level: accuracy.level,
        score: accuracy.score,
        metrics: [
          [copy.coverage, accuracy.coverage],
          [copy.control, accuracy.control],
          [copy.strokeOrderFeedback, accuracy.strokeOrder]
        ] as [string, number][]
      }
    : shape
      ? {
          level: shape.level,
          score: shape.score,
          metrics: [
            [copy.coverage, shape.coverage],
            [copy.control, shape.control]
          ] as [string, number][]
        }
      : null;

  return (
    <section
      className="writing-tool"
      aria-label={`${copy.practiceLabel} ${character}`}
      lang={interfaceLanguage}
    >
      <WritingTutorial
        key={`${character}-${interfaceLanguage}`}
        character={character}
        characterLanguage={characterLanguage}
        interfaceLanguage={interfaceLanguage}
      />
      <div className="writing-toolbar">
        <button
          className="icon-button"
          aria-label={copy.undo}
          disabled={!strokes.length}
          onClick={() => {
            const last = strokes.at(-1);
            if (last) setRedo((items) => [...items, last]);
            setStrokes((items) => items.slice(0, -1));
            setAccuracy(null);
            setShape(null);
            setMessage(initialMessage);
          }}
        >
          <Undo2 />
        </button>
        <button
          className="icon-button"
          aria-label={copy.redo}
          disabled={!redo.length}
          onClick={() => {
            const last = redo.at(-1);
            if (last) setStrokes((items) => [...items, last]);
            setRedo((items) => items.slice(0, -1));
            setAccuracy(null);
            setShape(null);
            setMessage(initialMessage);
          }}
        >
          <Redo2 />
        </button>
        <button
          className="icon-button"
          aria-label={copy.clear}
          onClick={() => {
            setStrokes([]);
            setRedo([]);
            setAccuracy(null);
            setShape(null);
            setMessage(initialMessage);
          }}
        >
          <RotateCcw />
        </button>
        <button
          className="icon-button"
          aria-label={guide ? copy.hideGuide : copy.showGuide}
          onClick={() => setGuide((shown) => !shown)}
        >
          {guide ? <EyeOff /> : <Eye />}
        </button>
        <label>
          {copy.stroke}{" "}
          <input
            type="range"
            min="3"
            max="18"
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        className="trace-canvas"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => setDrawing(false)}
        onPointerCancel={() => setDrawing(false)}
        aria-label={copy.canvas}
      />
      <div className="writing-footer">
        <p aria-live="polite">{message}</p>
        <button className="button primary" onClick={check} disabled={!strokes.length}>
          <Check /> {usesVerifiedStrokes ? copy.selfCheck : compareLabel}
        </button>
      </div>
      {report && (
        <section
          className={`trace-accuracy trace-accuracy-${report.level}`}
          aria-labelledby="trace-accuracy-title"
        >
          <header>
            <span className="trace-score" aria-hidden="true">
              {report.score}%
            </span>
            <div>
              <span className="eyebrow">{copy.levels[report.level]}</span>
              <h3 id="trace-accuracy-title">{copy.scoreHeading(report.score)}</h3>
            </div>
          </header>
          <div className="trace-accuracy-grid">
            {report.metrics.map(([label, value]) => (
              <div className="trace-accuracy-metric" key={label}>
                <span>
                  <strong>{label}</strong>
                  <b>{value}%</b>
                </span>
                <progress max="100" value={value} aria-label={`${label}: ${value}%`} />
              </div>
            ))}
          </div>
          {!accuracy && (
            <p className="trace-shape-only">
              {interfaceLanguage === "si"
                ? "මෙය අකුරේ හැඩය පමණක් සසඳයි. රේඛා පිළිවෙළ, දිශාව සහ පෑන ඉවත් කිරීම ගුරුවරයෙකු තහවුරු කරන තුරු ලකුණු නොදේ."
                : "This compares the letter’s shape only. Stroke order, direction and pen lifts are not scored until an educator verifies the guide."}
            </p>
          )}
          <p className="trace-privacy-note">
            <ShieldCheck aria-hidden="true" /> {copy.privacyNote}
          </p>
        </section>
      )}
    </section>
  );
}
