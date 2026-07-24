import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, CheckCircle2, HelpCircle, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Exercise } from "../types";
import { isCorrectAnswer, shuffleUnique } from "../lib/utils";
import { AudioButton } from "./AudioButton";
import {
  moveLiquidGlass,
  pressLiquidGlass,
  releaseLiquidGlass,
  resetLiquidGlass
} from "../lib/liquidGlass";

export function ExerciseCard({
  exercise,
  onAnswered
}: {
  exercise: Exercise;
  onAnswered?: (correct: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
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
  const isCorrectOption = (option: string) =>
    isCorrectAnswer(option, exercise.correctAnswer, exercise.acceptedAlternatives);
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
    <motion.section
      className={`exercise-card ${
        submitted === null ? "" : submitted ? "submitted-correct" : "submitted-incorrect"
      } liquid-glass`}
      aria-labelledby={`prompt-${exercise.id}`}
      onPointerMove={moveLiquidGlass}
      onPointerDown={pressLiquidGlass}
      onPointerUp={releaseLiquidGlass}
      onPointerCancel={resetLiquidGlass}
      onPointerLeave={resetLiquidGlass}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
    >
      <span className="eyebrow">{exercise.type.replaceAll("-", " ")}</span>
      <h2 id={`prompt-${exercise.id}`}>{exercise.prompt}</h2>
      <p>{exercise.instructions}</p>
      {exercise.audioText && (
        <AudioButton text={exercise.audioText} language={exercise.targetLanguage} />
      )}
      {choiceMode ? (
        <div className="choice-grid">
          {options.map((option) => {
            const optionText = String(option);
            const correctOption = isCorrectOption(optionText);
            const selectedOption = answer === optionText;
            const resultClass =
              submitted === null
                ? selectedOption
                  ? "selected"
                  : ""
                : correctOption
                  ? "answer-correct"
                  : selectedOption
                    ? "answer-incorrect"
                    : "answer-muted";

            return (
              <motion.button
                type="button"
                key={optionText}
                className={`choice liquid-choice ${resultClass}`}
                disabled={submitted !== null}
                onClick={() => setAnswer(optionText)}
                whileTap={submitted === null && !reduceMotion ? { scale: 0.975 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              >
                <span>{optionText}</span>
                {submitted !== null && correctOption && (
                  <span className="answer-state">
                    <CheckCircle2 aria-hidden="true" />
                    <span className="sr-only">Correct answer</span>
                  </span>
                )}
                {submitted === false && selectedOption && !correctOption && (
                  <span className="answer-state">
                    <XCircle aria-hidden="true" />
                    <span className="sr-only">Your answer was incorrect</span>
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <label
          className={`field answer-field ${
            submitted === null ? "" : submitted ? "answer-correct" : "answer-incorrect"
          }`}
        >
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
        <button type="button" className="button ghost" onClick={() => setHint((shown) => !shown)}>
          <Lightbulb /> Hint
        </button>
        {submitted === null ? (
          <button type="button" className="button primary" disabled={!answer} onClick={submit}>
            <Check /> Check answer
          </button>
        ) : (
          <button
            type="button"
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
      <AnimatePresence initial={false}>
        {hint && (
          <motion.p
            className="hint"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          >
            <HelpCircle /> {exercise.hint || "Look at the meaning and sound together."}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {submitted !== null && (
          <motion.div
            className={`feedback ${submitted ? "success" : "error"}`}
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={
              reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 28 }
            }
          >
            <strong>
              {submitted ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
              {submitted ? "Correct — well done!" : "Not yet — try once more."}
            </strong>
            <span>{exercise.explanation}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
