import { Check, Eye, EyeOff, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export function WritingCanvas({
  character = "අ",
  onComplete
}: {
  character?: string;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [redo, setRedo] = useState<Point[][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [guide, setGuide] = useState(true);
  const [width, setWidth] = useState(8);
  const [message, setMessage] = useState("Trace the character, then use self-check.");

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
    if (guide) {
      context.fillStyle = "rgba(20,92,74,.12)";
      context.font = `${Math.min(rect.width, rect.height) * 0.72}px "Noto Sans Sinhala", sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(character, rect.width / 2, rect.height / 2);
    }
    context.strokeStyle = "#167c68";
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
    setMessage(
      coverage > 55
        ? `Good tracing coverage: about ${coverage}%. This is guidance, not handwriting recognition.`
        : `Coverage is about ${coverage}%. Try a slower, fuller trace.`
    );
    if (coverage > 55) onComplete?.();
  };
  return (
    <section className="writing-tool" aria-label={`Writing practice for ${character}`}>
      <div className="writing-toolbar">
        <button
          className="icon-button"
          aria-label="Undo stroke"
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
          aria-label="Redo stroke"
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
          aria-label="Clear drawing"
          onClick={() => {
            setStrokes([]);
            setRedo([]);
          }}
        >
          <RotateCcw />
        </button>
        <button
          className="icon-button"
          aria-label={guide ? "Hide guide" : "Show guide"}
          onClick={() => setGuide((shown) => !shown)}
        >
          {guide ? <EyeOff /> : <Eye />}
        </button>
        <label>
          Stroke{" "}
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
        aria-label="Drawing canvas"
      />
      <div className="writing-footer">
        <p aria-live="polite">{message}</p>
        <button className="button primary" onClick={check}>
          <Check /> Self-check
        </button>
      </div>
    </section>
  );
}
