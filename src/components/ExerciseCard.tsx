import { Check, HelpCircle, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { Exercise } from "../types";
import { isCorrectAnswer, shuffleUnique } from "../lib/utils";
import { AudioButton } from "./AudioButton";

export function ExerciseCard({
  exercise,
  onAnswered
}: {
  exercise: Exercise;
  onAnswered?: (correct: boolean) => void;
}) {
  const options = useMemo(
    () =>
      shuffleUnique([
        ...(Array.isArray(exercise.correctAnswer)
          ? exercise.correctAnswer
          : [exercise.correctAnswer]),
        ...exercise.distractors
      ]),
    [exercise]
  );
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const submit = () => {
    const correct = isCorrectAnswer(answer, exercise.correctAnswer, exercise.acceptedAlternatives);
    setSubmitted(correct);
    onAnswered?.(correct);
  };
  const choiceMode = [
    "multiple-choice",
    "audio-choice",
    "true-false",
    "reading-comprehension"
  ].includes(exercise.type);
  return (
    <section className="exercise-card" aria-labelledby={`prompt-${exercise.id}`}>
      <span className="eyebrow">{exercise.type.replaceAll("-", " ")}</span>
      <h2 id={`prompt-${exercise.id}`}>{exercise.prompt}</h2>
      <p>{exercise.instructions}</p>
      {exercise.audioText && (
        <AudioButton text={exercise.audioText} language={exercise.targetLanguage} />
      )}
      {choiceMode ? (
        <div className="choice-grid">
          {options.map((option) => (
            <button
              key={String(option)}
              className={`choice ${answer === option ? "selected" : ""}`}
              disabled={submitted !== null}
              onClick={() => setAnswer(String(option))}
            >
              {String(option)}
            </button>
          ))}
        </div>
      ) : (
        <label className="field">
          Your answer
          <input
            lang={exercise.targetLanguage}
            value={answer}
            disabled={submitted !== null}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && answer) submit();
            }}
          />
        </label>
      )}
      <div className="exercise-actions">
        <button className="button ghost" onClick={() => setHint((shown) => !shown)}>
          <Lightbulb /> Hint
        </button>
        {submitted === null ? (
          <button className="button primary" disabled={!answer} onClick={submit}>
            <Check /> Check answer
          </button>
        ) : (
          <button
            className="button secondary"
            onClick={() => {
              setAnswer("");
              setSubmitted(null);
            }}
          >
            <RotateCcw /> Retry
          </button>
        )}
      </div>
      {hint && (
        <p className="hint">
          <HelpCircle /> {exercise.hint || "Look at the meaning and sound together."}
        </p>
      )}
      {submitted !== null && (
        <div className={`feedback ${submitted ? "success" : "error"}`} role="status">
          <strong>{submitted ? "Correct — well done!" : "Not yet — try once more."}</strong>
          <span>{exercise.explanation}</span>
        </div>
      )}
    </section>
  );
}
