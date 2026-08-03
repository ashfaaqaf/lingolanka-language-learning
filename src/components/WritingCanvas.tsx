import { Check, Eye, EyeOff, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { writingToolCopy, type WritingInterfaceLanguage } from "../data/writingTutorial";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [redo, setRedo] = useState<Point[][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [guide, setGuide] = useState(true);
  const [width, setWidth] = useState(8);
  const [message, setMessage] = useState(copy.initialMessage);

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
      context.fillStyle = theme.getPropertyValue("--draw-guide").trim() || "rgb(83 103 213 / 0.14)";
      context.font = `${Math.min(rect.width, rect.height) * 0.72}px "Noto Sans Sinhala", sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(character, rect.width / 2, rect.height / 2);
    }
    context.strokeStyle = theme.getPropertyValue("--draw-ink").trim() || "#4b60cf";
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

  useEffect(draw, [strokes, guide, width, character]);
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
    const points = strokes.reduce((sum, stroke) => sum + stroke.length, 0);
    const coverage = Math.min(100, Math.round(points / 2.2));
    setMessage(coverage > 55 ? copy.goodCoverage(coverage) : copy.lowCoverage(coverage));
    if (coverage > 55) onComplete?.();
  };
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
        <button className="button primary" onClick={check}>
          <Check /> {copy.selfCheck}
        </button>
      </div>
    </section>
  );
}
