import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  XCircle
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Exercise } from "../types";
import { useApp } from "../context/AppContext";
import { isCorrectAnswer, shuffleUnique } from "../lib/utils";
import { AudioButton } from "./AudioButton";
import {
  moveLiquidGlass,
  pressLiquidGlass,
  releaseLiquidGlass,
  resetLiquidGlass
} from "../lib/liquidGlass";

const typeLabels: Record<"en" | "si", Record<Exercise["type"], string>> = {
  en: {
    "multiple-choice": "Multiple choice",
    "audio-choice": "Listen and choose",
    matching: "Matching",
    "translation-input": "Translation",
    "word-order": "Word order",
    dictation: "Listen and write",
    "listen-repeat": "Listen and repeat",
    speaking: "Speaking practice",
    "letter-tracing": "Writing practice",
    "fill-blank": "Fill in the blank",
    spelling: "Spelling",
    "true-false": "Choose the answer",
    "reading-comprehension": "Reading practice",
    flashcard: "Memory card"
  },
  si: {
    "multiple-choice": "බහුවරණ",
    "audio-choice": "සවන් දී තෝරන්න",
    matching: "ගැළපීම",
    "translation-input": "පරිවර්තනය",
    "word-order": "වචන අනුපිළිවෙළ",
    dictation: "අසා ලියන්න",
    "listen-repeat": "සවන් දී නැවත කියන්න",
    speaking: "කථන පුහුණුව",
    "letter-tracing": "අකුරු ලිවීමේ පුහුණුව",
    "fill-blank": "හිස්තැන පුරවන්න",
    spelling: "අක්ෂර වින්‍යාසය",
    "true-false": "පිළිතුර තෝරන්න",
    "reading-comprehension": "කියවීමේ පුහුණුව",
    flashcard: "මතක පත"
  }
};

export function ExerciseCard({
  exercise,
  guided = false,
  onAnswered
}: {
  exercise: Exercise;
  guided?: boolean;
  onAnswered?: (correct: boolean) => void;
}) {
  const { profile } = useApp();
  const reduceMotion = useReducedMotion() || profile.settings.reducedMotion;
  const interfaceLanguage = profile.settings.interfaceLanguage;
  const isSinhalaUi = interfaceLanguage === "si";
  const copy = isSinhalaUi
    ? {
        learnFirst: "පළමුව මෙය ඉගෙන ගන්න",
        meetWord: "අනුමාන නොකර වචනය හඳුනා ගනිමු",
        teachingIntro: "පිළිතුර තේරීමට පෙර වචනය බලන්න, හඬ අසන්න, එක් වරක් කියන්න.",
        knownWord: "ඔබ දන්නා වචනය",
        learningWord: "ඔබ ඉගෙන ගන්නා වචනය",
        sayItLike: "මෙලෙස උච්චාරණය කරන්න",
        followSteps: "මේ පියවර අනුගමනය කරන්න",
        listenStep: "හඬ බොත්තම ඔබා හොඳින් සවන් දෙන්න.",
        nowTry: "දැන් ඔබ උත්සාහ කරන්න",
        whatNow: "දැන් කළ යුතු දේ",
        chooseInstruction: "පහත පිළිතුරු වලින් එකක් තෝරා “පිළිතුර පරීක්ෂා කරන්න” ඔබන්න.",
        typeInstruction: "ඔබේ පිළිතුර ලියා “පිළිතුර පරීක්ෂා කරන්න” ඔබන්න.",
        pronunciationHelp: "උච්චාරණ උදව් · මෙලෙස කියවන්න",
        pronunciationTip: "හඬ අසා, පිළිතුර දීමට පෙර එක් වරක් හඬ නඟා කියන්න.",
        yourAnswer: "ඔබේ පිළිතුර",
        checkAnswer: "පිළිතුර පරීක්ෂා කරන්න",
        retry: "නැවත උත්සාහ කරන්න",
        correctAnswer: "නිවැරදි පිළිතුර",
        incorrectAnswer: "ඔබේ පිළිතුර වැරදියි",
        correct: "නිවැරදියි — ඉතා හොඳයි!",
        incorrect: "තවම නැහැ — නැවත උත්සාහ කරමු."
      }
    : {
        learnFirst: "Learn this first",
        meetWord: "Meet the word before you answer",
        teachingIntro: "No guessing needed. Look at the word, listen to it, and say it once.",
        knownWord: "Word you already know",
        learningWord: "Word you are learning",
        sayItLike: "Say it like",
        followSteps: "Follow these steps",
        listenStep: "Tap play and listen carefully.",
        nowTry: "Now try it",
        whatNow: "What to do now",
        chooseInstruction: "Tap one answer below, then tap “Check answer”.",
        typeInstruction: "Type your answer, then tap “Check answer”.",
        pronunciationHelp: "Pronunciation help · Say it like",
        pronunciationTip: "Listen once, then say it aloud before answering.",
        yourAnswer: "Your answer",
        checkAnswer: "Check answer",
        retry: "Try again",
        correctAnswer: "Correct answer",
        incorrectAnswer: "Your answer was incorrect",
        correct: "Correct — well done!",
        incorrect: "Not yet — let’s try once more."
      };
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
  const support = exercise.learningSupport;
  const showLearningSupport = guided && Boolean(support);
  const showTransliteration = profile.settings.transliteration !== "never";
  const sourceText = exercise.sourceLanguage === "si" ? support?.sinhala : support?.english;
  const targetText = exercise.targetLanguage === "si" ? support?.sinhala : support?.english;
  const spokenForm =
    exercise.targetLanguage === "si" && support?.transliteration
      ? support.transliteration
      : targetText;
  const targetLanguageName =
    exercise.targetLanguage === "si"
      ? isSinhalaUi
        ? "සිංහල"
        : "Sinhala"
      : isSinhalaUi
        ? "ඉංග්‍රීසි"
        : "English";
  const repeatStep = isSinhalaUi
    ? `“${spokenForm}” යැයි හඬ නඟා කියන්න.`
    : `Say “${spokenForm}” out loud.`;
  const chooseStep = isSinhalaUi
    ? `පහළින් ගැළපෙන ${targetLanguageName} වචනය තෝරන්න.`
    : `Find the matching ${targetLanguageName} word below.`;
  const typeStep = isSinhalaUi
    ? `පහත පිළිතුරු කොටුවේ ${targetLanguageName} වචනය ලියන්න.`
    : `Type the ${targetLanguageName} word in the answer box below.`;
  const typeLabel =
    typeLabels[interfaceLanguage][exercise.type] ?? exercise.type.replaceAll("-", " ");

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
      <span className="eyebrow">{typeLabel}</span>

      {showLearningSupport && support && sourceText && targetText && (
        <section className="learning-first" aria-labelledby={`learn-${exercise.id}`}>
          <header className="learning-first-header">
            <Sparkles aria-hidden="true" />
            <div>
              <span>{copy.learnFirst}</span>
              <h2 id={`learn-${exercise.id}`}>{copy.meetWord}</h2>
            </div>
          </header>
          <p>{copy.teachingIntro}</p>
          <div className="learning-pair">
            <div className="learning-word">
              <small>{copy.knownWord}</small>
              <strong lang={exercise.sourceLanguage}>{sourceText}</strong>
              {exercise.sourceLanguage === "si" &&
                support.transliteration &&
                showTransliteration && <span>{support.transliteration}</span>}
            </div>
            <ArrowRight aria-hidden="true" />
            <div className="learning-word target">
              <small>{copy.learningWord}</small>
              <strong lang={exercise.targetLanguage}>{targetText}</strong>
              {exercise.targetLanguage === "si" &&
                support.transliteration &&
                showTransliteration && (
                  <span>
                    {copy.sayItLike}: {support.transliteration}
                  </span>
                )}
            </div>
          </div>
          {exercise.audioText && (
            <AudioButton text={exercise.audioText} language={exercise.targetLanguage} />
          )}
          <div className="learning-steps">
            <strong>{copy.followSteps}</strong>
            <ol>
              <li>{copy.listenStep}</li>
              <li>{repeatStep}</li>
              <li>{choiceMode ? chooseStep : typeStep}</li>
            </ol>
          </div>
        </section>
      )}

      <div className="practice-prompt">
        {showLearningSupport && <span className="eyebrow">{copy.nowTry}</span>}
        <h2 id={`prompt-${exercise.id}`}>{exercise.prompt}</h2>
        <p>{exercise.instructions}</p>
      </div>

      {!showLearningSupport && exercise.audioText && (
        <AudioButton text={exercise.audioText} language={exercise.targetLanguage} />
      )}
      {!showLearningSupport && exercise.hint && (
        <div className="pronunciation-support">
          <HelpCircle aria-hidden="true" />
          <div>
            <span>{copy.pronunciationHelp}</span>
            <strong>{exercise.hint}</strong>
            <small>{copy.pronunciationTip}</small>
          </div>
        </div>
      )}

      <div className="answer-now" role="note">
        <MousePointerClick aria-hidden="true" />
        <div>
          <span>{copy.whatNow}</span>
          <strong>{choiceMode ? copy.chooseInstruction : copy.typeInstruction}</strong>
        </div>
      </div>

      {choiceMode ? (
        <div className="choice-grid">
          {options.map((option) => {
            const optionText = String(option);
            const correctOption = isCorrectOption(optionText);
            const selectedOption = answer === optionText;
            const pronunciation = showTransliteration
              ? exercise.optionPronunciations?.[optionText]
              : undefined;
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
                aria-label={pronunciation ? `${optionText}, ${pronunciation}` : optionText}
                disabled={submitted !== null}
                onClick={() => setAnswer(optionText)}
                whileTap={submitted === null && !reduceMotion ? { scale: 0.975 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              >
                <span className="choice-copy">
                  <span lang={exercise.targetLanguage}>{optionText}</span>
                  {pronunciation && <small>{pronunciation}</small>}
                </span>
                {submitted !== null && correctOption && (
                  <span className="answer-state">
                    <CheckCircle2 aria-hidden="true" />
                    <span className="sr-only">{copy.correctAnswer}</span>
                  </span>
                )}
                {submitted === false && selectedOption && !correctOption && (
                  <span className="answer-state">
                    <XCircle aria-hidden="true" />
                    <span className="sr-only">{copy.incorrectAnswer}</span>
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
          {copy.yourAnswer}
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
        {submitted === null ? (
          <button type="button" className="button primary" disabled={!answer} onClick={submit}>
            <Check /> {copy.checkAnswer}
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
            <RotateCcw /> {copy.retry}
          </button>
        )}
      </div>
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
              {submitted ? copy.correct : copy.incorrect}
            </strong>
            <span>{exercise.explanation}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
