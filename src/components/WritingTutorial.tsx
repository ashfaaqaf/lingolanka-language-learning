import { Eye, Hand, Pause, PenLine, Play, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { writingTutorialCopy, type WritingInterfaceLanguage } from "../data/writingTutorial";

export function WritingTutorial({
  character,
  characterLanguage,
  interfaceLanguage = "en"
}: {
  character: string;
  characterLanguage: "en" | "si";
  interfaceLanguage?: WritingInterfaceLanguage;
}) {
  const copy = writingTutorialCopy[interfaceLanguage];
  const headingId = useId();
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);

  const replay = () => {
    setRun((value) => value + 1);
    setPlaying(true);
  };

  return (
    <section className="writing-tutorial" aria-labelledby={headingId}>
      <div className="tutorial-heading">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3 id={headingId}>{copy.title}</h3>
          <p>{copy.introduction}</p>
        </div>
        <div className="tutorial-controls">
          <button className="button secondary compact" type="button" onClick={replay}>
            <RotateCcw /> {copy.replay}
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label={playing ? copy.pause : copy.resume}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </div>
      </div>

      <div className="tutorial-layout">
        <div
          className={`letter-shape-preview${playing ? "" : " paused"}`}
          aria-label={`${copy.previewLabel}: ${character}. ${copy.previewDescription}`}
        >
          <span className="tutorial-letter ghost" lang={characterLanguage} aria-hidden="true">
            {character}
          </span>
          <span
            className="tutorial-letter reveal"
            lang={characterLanguage}
            aria-hidden="true"
            key={`letter-${run}`}
            onAnimationEnd={() => setPlaying(false)}
          >
            {character}
          </span>
          <span className="tutorial-pen" aria-hidden="true" key={`pen-${run}`}>
            <PenLine />
          </span>
          <div className="tutorial-progress" aria-hidden="true">
            <span key={`progress-${run}`} />
          </div>
        </div>

        <div>
          <strong className="tutorial-steps-label">{copy.stepsLabel}</strong>
          <ol className="tutorial-steps">
            {copy.steps.map((step, index) => {
              const Icon = index === 0 ? Eye : index === 1 ? Hand : PenLine;
              return (
                <li key={step}>
                  <span className="tutorial-step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <Icon aria-hidden="true" />
                  <span>{step}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p className="tutorial-shape-note">{copy.shapeNote}</p>
      <div className="tutorial-ready">
        <PenLine aria-hidden="true" />
        <strong>{copy.ready}</strong>
      </div>
    </section>
  );
}
