import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import audioManifest from "../data/audioManifest.json";
import { courses, vocabulary } from "../data/content";
import { courseProgress } from "../lib/course";

/*
 * The landing hero. Two identical grids of words sit on top of each other:
 * the back one is Sinhala, the front one is the English for each word, and
 * only a soft lens of the front grid shows. Under the lens the Sinhala gives
 * way to its meaning. Moving the pointer reads the page; left alone (or on a
 * phone) the lens drifts by itself.
 *
 * Every word comes from the curriculum and sits in its own fixed cell, so the
 * English that appears is always the translation of the word beneath it.
 */

const COLS = 14;
const ROWS = 20;

/* Deterministic, so the field is the same on every visit and in tests. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildField() {
  // Only words short enough for a cell in both languages: a decorative field
  // is no excuse for clipping Sinhala glyphs.
  const words = vocabulary.filter(
    (word) =>
      [...word.sinhala].length <= 9 && word.english.length <= 13 && !word.english.includes("?")
  );
  const rand = rng(11);
  const order = words.map((word) => ({ word, key: rand() })).sort((a, b) => a.key - b.key);
  return Array.from({ length: ROWS * COLS }, (_, index) => {
    // Offset each row so the same words never stack into columns.
    const row = Math.floor(index / COLS);
    return order[(index + row * 5) % order.length]!.word;
  });
}

const FIELD = buildField();
const LESSONS = courses.reduce(
  (sum, course) =>
    sum +
    course.levels.reduce(
      (n, level) => n + level.modules.reduce((m, mod) => m + mod.lessons.length, 0),
      0
    ),
  0
);
const CLIPS = Object.keys(audioManifest).length;

/* ---------- stat arcs ---------- */

const CX = -110;
const CY = 300;
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number) => ({
  x: CX + r * Math.cos(rad(deg)),
  y: CY + r * Math.sin(rad(deg))
});

type Stat = { value: string; label: string };

function Arcs({ stats }: { stats: Stat[] }) {
  const arcs = [
    { r: 330, from: -92, to: 16, dot: -46 },
    { r: 395, from: -56, to: 60, dot: 2 },
    { r: 460, from: -14, to: 72, dot: 44 }
  ];
  return (
    <svg
      className="cineArcs"
      viewBox="0 0 380 700"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <defs>
        {arcs.map((arc, i) => {
          const a = polar(arc.r, arc.from);
          const b = polar(arc.r, arc.to);
          return (
            <linearGradient
              key={i}
              id={`cineArc${i}`}
              gradientUnits="userSpaceOnUse"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="22%" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="85%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          );
        })}
      </defs>
      {arcs.map((arc, i) => {
        const stat = stats[i]!;
        const a = polar(arc.r, arc.from);
        const b = polar(arc.r, arc.to);
        const dot = polar(arc.r, arc.dot);
        const line = 0.5 + i * 0.22;
        const mark = line + 0.9;
        return (
          <g key={stat.label}>
            <path
              className="arcLine"
              d={`M ${a.x} ${a.y} A ${arc.r} ${arc.r} 0 0 1 ${b.x} ${b.y}`}
              stroke={`url(#cineArc${i})`}
              style={
                { "--len": arc.r * rad(arc.to - arc.from), "--d": `${line}s` } as CSSProperties
              }
            />
            <circle
              className="arcRing"
              cx={dot.x}
              cy={dot.y}
              r="7"
              style={{ "--d": `${mark + 0.3}s` } as CSSProperties}
            />
            <circle
              className="arcDot"
              cx={dot.x}
              cy={dot.y}
              r="3.4"
              style={{ "--d": `${mark}s` } as CSSProperties}
            />
            <text
              className="arcNum"
              x={dot.x + 16}
              y={dot.y + 4}
              style={{ "--d": `${mark + 0.15}s` } as CSSProperties}
            >
              {stat.value}
            </text>
            <text
              className="arcLabel"
              x={dot.x + 18}
              y={dot.y + 22}
              style={{ "--d": `${mark + 0.3}s` } as CSSProperties}
            >
              {stat.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- hero ---------- */

export function Hero() {
  const { profile, progress } = useApp();
  const heroRef = useRef<HTMLElement | null>(null);
  const patternRef = useRef<SVGPatternElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const next = courseProgress(profile.settings.direction, progress).next;

  useEffect(() => {
    const hero = heroRef.current;
    const pattern = patternRef.current;
    const field = fieldRef.current;
    if (!hero || !pattern || !field) return;

    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => root.classList.contains("reduced-motion") || motionQuery.matches;

    const pointer = { x: 0, y: 0, at: -Infinity };
    const lens = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    let primed = false;

    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.at = performance.now();
    };

    const frame = (now: number) => {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      /* Follow the pointer while it is active; otherwise drift on a slow
         figure-eight across the right half, away from the headline. */
      const idle = now - pointer.at > 2600;
      const t = now / 1000;
      const tx = idle ? w * (0.68 + 0.18 * Math.sin(t * 0.37)) : pointer.x;
      const ty = idle ? h * (0.38 + 0.22 * Math.sin(t * 0.53 + 1)) : pointer.y;
      if (!primed) {
        lens.x = tx;
        lens.y = ty;
        primed = true;
      }
      const k = idle ? 0.035 : 0.12;
      lens.x += (tx - lens.x) * k;
      lens.y += (ty - lens.y) * k;

      const nx = idle ? 0 : pointer.x / w - 0.5;
      const ny = idle ? 0 : pointer.y / h - 0.5;
      tilt.x += (nx * 16 - tilt.x) * 0.06;
      tilt.y += (ny * 16 - tilt.y) * 0.06;

      pattern.setAttribute("x", tilt.x.toFixed(2));
      pattern.setAttribute("y", tilt.y.toFixed(2));
      /* The words lean the other way, so the two planes separate. The lens
         position is corrected for that lean so it stays under the pointer. */
      const fx = -tilt.x * 0.8;
      const fy = -tilt.y * 0.8;
      field.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0)`;
      field.style.setProperty("--mx", `${(lens.x - fx + 24).toFixed(1)}px`);
      field.style.setProperty("--my", `${(lens.y - fy + 24).toFixed(1)}px`);

      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (!raf && visible && !still()) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /* No work at all while the hero is scrolled away. */
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = !!entry?.isIntersecting;
            if (visible) start();
            else stop();
          });
    io?.observe(hero);

    const onMotion = () => (still() ? stop() : start());
    motionQuery.addEventListener("change", onMotion);
    const mo = new MutationObserver(onMotion);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerdown", onMove, { passive: true });
    start();

    return () => {
      stop();
      io?.disconnect();
      mo.disconnect();
      motionQuery.removeEventListener("change", onMotion);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onMove);
    };
  }, []);

  const stats: Stat[] = [
    { value: String(LESSONS), label: "LESSONS" },
    { value: String(vocabulary.length), label: "WORDS" },
    { value: String(CLIPS), label: "AUDIO CLIPS" }
  ];
  const emphasis = "Connect without limits.".split(" ");

  return (
    <section className="cine" ref={heroRef} aria-labelledby="cine-title">
      <svg className="cineGrid" aria-hidden="true">
        <defs>
          <pattern
            ref={patternRef}
            id="cineGrid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cineGrid)" />
      </svg>

      <div className="cineZoom" aria-hidden="true">
        <div className="cineField" ref={fieldRef}>
          <div className="fieldSi" lang="si">
            {FIELD.map((word, index) => (
              <span key={index}>{word.sinhala}</span>
            ))}
          </div>
          <div className="fieldEn" lang="en">
            {FIELD.map((word, index) => (
              <span key={index}>{word.english}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="cineShade" aria-hidden="true" />

      <Arcs stats={stats} />

      <div className="cineInner">
        <div className="cineCopy">
          <p className="cineEyebrow rise" style={{ "--d": ".15s" } as CSSProperties}>
            <i aria-hidden="true" /> Free forever · No account · Works offline
          </p>
          <h1 id="cine-title">
            <span className="rise" style={{ "--d": ".3s" } as CSSProperties}>
              Learn Sinhala. Learn English.
            </span>{" "}
            <em>
              {emphasis.map((word, index) => (
                // The space sits outside the span: trailing whitespace inside an
                // inline-block is trimmed at its edge, which ran the words together.
                <Fragment key={word}>
                  <span
                    className="rise"
                    style={{ "--d": `${0.6 + index * 0.12}s` } as CSSProperties}
                  >
                    {word}
                  </span>{" "}
                </Fragment>
              ))}
            </em>
          </h1>
          <p lang="si" className="cineSi rise" style={{ "--d": ".95s" } as CSSProperties}>
            සිංහල ඉගෙන ගන්න. ඉංග්‍රීසි ඉගෙන ගන්න. සීමාවකින් තොරව සම්බන්ධ වන්න.
          </p>
          <p className="cineLede rise" style={{ "--d": "1.05s" } as CSSProperties}>
            A calm, practical path from your first sound to confident everyday conversation—built
            for learners in both directions.
          </p>

          <ul
            className="cineStats rise"
            style={{ "--d": "1.15s" } as CSSProperties}
            aria-label="Course size"
          >
            {stats.map((stat) => (
              <li key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className="cineActions rise" style={{ "--d": "1.2s" } as CSSProperties}>
            <Link className="cineCta" to="/onboarding">
              <span>Start learning</span>
              <span aria-hidden="true">→</span>
              <i className="cineShine" aria-hidden="true" />
            </Link>
            <Link className="cineGhost" to="/learn">
              Explore the course
            </Link>
          </div>

          {next && (
            <p className="cineNext rise" style={{ "--d": "1.35s" } as CSSProperties}>
              Next lesson <span aria-hidden="true">→</span> <b>{next.title}</b> · {next.minutes} min
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
