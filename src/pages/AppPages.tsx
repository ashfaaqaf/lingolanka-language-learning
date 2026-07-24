import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Download,
  Flame,
  Grid2X2,
  Heart,
  Headphones,
  Languages,
  List,
  Mic2,
  PenTool,
  Play,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Upload,
  WifiOff,
  X
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  conversations,
  courses,
  englishAlphabet,
  grammarTopics,
  sinhalaAlphabet,
  vocabulary
} from "../data/content";
import { db, exportBackup, importBackup, loadProfile, resetDatabase } from "../lib/db";
import { calculateStreak, scheduleReview, todayKey, type ReviewRating } from "../lib/utils";
import type { AlphabetEntry, VocabularyState } from "../types";
import { AudioButton } from "../components/AudioButton";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressRing } from "../components/ProgressRing";
import { SpeakingPractice } from "../components/SpeakingPractice";
import { WritingCanvas } from "../components/WritingCanvas";

function Header({
  eyebrow,
  title,
  copy,
  action
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </header>
  );
}

export function DashboardPage() {
  const { profile, progress, vocabularyStates } = useApp();
  const totalXp = progress.reduce((sum, record) => sum + record.xp, 0);
  const minutes = progress.reduce((sum, record) => sum + record.minutes, 0);
  const streak = calculateStreak(progress.map((record) => record.completedAt));
  const todayMinutes = progress
    .filter((record) => record.completedAt.startsWith(todayKey()))
    .reduce((sum, item) => sum + item.minutes, 0);
  const course = courses.find((item) => item.id === profile.settings.direction) ?? courses[0]!;
  const lessons = course.levels.flatMap((level) =>
    level.modules.flatMap((module) => module.lessons)
  );
  const next =
    lessons.find((lesson) => !progress.some((item) => item.id === lesson.id)) ?? lessons[0]!;
  const skills = progress.reduce(
    (result, record) => ({
      reading: result.reading + record.skills.reading,
      writing: result.writing + record.skills.writing,
      listening: result.listening + record.skills.listening,
      speaking: result.speaking + record.skills.speaking
    }),
    { reading: 0, writing: 0, listening: 0, speaking: 0 }
  );
  return (
    <div className="page dashboard-page">
      <Header
        eyebrow="Your learning space"
        title={`${greeting()}, ${profile.name || "learner"}`}
        copy={
          profile.settings.direction === "english-to-sinhala"
            ? "You’re building Sinhala, one useful connection at a time."
            : "ඔබ ප්‍රයෝජනවත් සම්බන්ධතා හරහා ඉංග්‍රීසි ගොඩනඟයි."
        }
        action={
          <Link className="button secondary" to="/settings">
            <Settings2 /> Personalise
          </Link>
        }
      />
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Continue learning · Foundations</span>
          <h2>{next.title}</h2>
          <p>{next.description}</p>
          <div className="button-row">
            <Link className="button light" to={`/lesson/${next.id}`}>
              <Play /> Continue lesson
            </Link>
            <span>
              <Clock /> {next.minutes} min
            </span>
          </div>
        </div>
        <ProgressRing
          value={Math.round(Math.min(100, (todayMinutes / profile.settings.dailyTarget) * 100))}
          label="daily goal"
        />
      </section>
      <section className="stat-grid">
        <article>
          <Flame />
          <span>Current streak</span>
          <strong>{streak.current} days</strong>
          <small>Best: {streak.longest}</small>
        </article>
        <article>
          <Sparkles />
          <span>Total XP</span>
          <strong>{totalXp}</strong>
          <small>Level {Math.floor(totalXp / 300) + 1}</small>
        </article>
        <article>
          <BookOpen />
          <span>Lessons</span>
          <strong>{progress.length}</strong>
          <small>of {lessons.length} completed</small>
        </article>
        <article>
          <Languages />
          <span>Words learned</span>
          <strong>{vocabularyStates.filter((item) => item.learned).length}</strong>
          <small>{vocabularyStates.filter((item) => item.difficult).length} marked difficult</small>
        </article>
      </section>
      <div className="dashboard-grid">
        <section className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">This week</span>
              <h2>Learning activity</h2>
            </div>
            <strong>{minutes} min total</strong>
          </div>
          <WeeklyChart progress={progress} />
          <p className="accessible-summary">
            Text summary:{" "}
            {progress.length
              ? `${progress.length} lessons completed for ${minutes} total minutes.`
              : "No study sessions recorded yet."}
          </p>
        </section>
        <section className="card">
          <span className="eyebrow">Skill balance</span>
          <h2>Growing together</h2>
          {Object.entries(skills).map(([skill, value]) => (
            <div className="skill-row" key={skill}>
              <span>{skill}</span>
              <div>
                <i style={{ width: `${Math.min(100, value)}%` }} />
              </div>
              <strong>{Math.min(100, value)}%</strong>
            </div>
          ))}
        </section>
      </div>
      <section className="quick-grid">
        {(
          [
            ["5-minute review", "/review"],
            ["Sound practice", "/listening"],
            ["Trace a letter", "/writing"],
            ["Role-play", "/conversations"]
          ] as const
        ).map(([label, to]) => (
          <Link className="quick-card" to={to} key={label}>
            <Sparkles />
            <span>{label}</span>
            <ChevronRight />
          </Link>
        ))}
      </section>
      <CoursePreview course={course} progressIds={new Set(progress.map((item) => item.id))} />
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function WeeklyChart({ progress }: { progress: { completedAt: string; minutes: number }[] }) {
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const key = todayKey(date);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      value: progress
        .filter((item) => item.completedAt.startsWith(key))
        .reduce((sum, item) => sum + item.minutes, 0)
    };
  });
  const max = Math.max(20, ...days.map((day) => day.value));
  return (
    <div className="weekly-chart" role="img" aria-label="Minutes studied over the last seven days">
      {days.map((day, index) => (
        <div key={index}>
          <i style={{ height: `${Math.max(5, (day.value / max) * 100)}%` }} />
          <span>{day.label}</span>
        </div>
      ))}
    </div>
  );
}

function CoursePreview({
  course,
  progressIds
}: {
  course: (typeof courses)[number];
  progressIds: Set<string>;
}) {
  return (
    <section className="course-preview">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Your path</span>
          <h2>{course.title}</h2>
        </div>
        <Link to="/learn">
          View all <ChevronRight />
        </Link>
      </div>
      <div className="path-line">
        {course.levels.map((level) => {
          const lessonIds = level.modules.flatMap((module) =>
            module.lessons.map((lesson) => lesson.id)
          );
          const done = lessonIds.filter((id) => progressIds.has(id)).length;
          return (
            <article key={level.id}>
              <div className={done === lessonIds.length && done ? "complete" : ""}>
                {done === lessonIds.length && done ? <Check /> : level.id}
              </div>
              <strong>{level.name}</strong>
              <span>
                {done}/{lessonIds.length} lessons
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LearnPage() {
  const { profile, progress } = useApp();
  const course = courses.find((item) => item.id === profile.settings.direction) ?? courses[0]!;
  return (
    <div className="page">
      <Header
        eyebrow="Curriculum"
        title={course.title}
        copy="Five progressive levels. Explore freely, repeat any lesson, and learn without lockouts."
      />
      {course.levels.map((level) => (
        <section className="level-section" key={level.id}>
          <div className="level-marker">{level.id}</div>
          <div>
            <span className="eyebrow">Level {level.id}</span>
            <h2>{level.name}</h2>
            <div className="module-grid">
              {level.modules.map((module) => (
                <article className="card module-card" key={module.id}>
                  <span>
                    {module.lessons.length} lessons · +{module.rewardXp} XP
                  </span>
                  <h3>{module.title}</h3>
                  <p lang="si">{module.titleSi}</p>
                  <p>{module.overview}</p>
                  <div className="module-lessons">
                    {module.lessons.map((lesson) => (
                      <Link to={`/lesson/${lesson.id}`} key={lesson.id}>
                        {progress.some((item) => item.id === lesson.id) ? <Check /> : <Play />}
                        <span>
                          <strong>{lesson.title}</strong>
                          <small>{lesson.minutes} min</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link className="button secondary" to={`/lesson/${module.lessons[0]?.id}`}>
                    Start module
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function LessonPage() {
  const { lessonId } = useParams();
  const { completeLesson } = useApp();
  const navigate = useNavigate();
  const lesson = courses
    .flatMap((course) => course.levels)
    .flatMap((level) => level.modules)
    .flatMap((module) => module.lessons)
    .find((item) => item.id === lessonId);
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [exit, setExit] = useState(false);
  if (!lesson)
    return (
      <Missing
        title="Lesson unavailable"
        copy="This lesson record could not be found. Return to the course and choose another lesson."
      />
    );
  const exercise = lesson.exercises[step];
  const finished = step >= lesson.exercises.length;
  const complete = async () => {
    const score = Math.round((correct / lesson.exercises.length) * 100);
    await completeLesson({
      id: lesson.id,
      completedAt: new Date().toISOString(),
      score,
      xp: correct * 10 + 20,
      minutes: lesson.minutes,
      skills: { reading: 8, writing: 5, listening: 7, speaking: 5 }
    });
    navigate("/dashboard");
  };
  return (
    <div className="lesson-page">
      <header className="lesson-header">
        <button className="icon-button" onClick={() => setExit(true)} aria-label="Exit lesson">
          <X />
        </button>
        <div className="lesson-progress">
          <i style={{ width: `${Math.min(100, (step / lesson.exercises.length) * 100)}%` }} />
        </div>
        <span>
          {Math.min(step + 1, lesson.exercises.length)} / {lesson.exercises.length}
        </span>
      </header>
      <main className="lesson-content">
        {!finished && exercise ? (
          <>
            <div className="lesson-title">
              <span className="eyebrow">{lesson.title}</span>
              <h1>{lesson.titleSi}</h1>
            </div>
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onAnswered={(isCorrect) => {
                setAnswered(true);
                if (isCorrect) setCorrect((value) => value + 1);
              }}
            />
            <div className="lesson-next">
              <button
                className="button primary large"
                disabled={!answered}
                onClick={() => {
                  setStep((value) => value + 1);
                  setAnswered(false);
                }}
              >
                Continue <ChevronRight />
              </button>
            </div>
          </>
        ) : (
          <section className="completion-card">
            <Award />
            <span className="eyebrow">Lesson complete</span>
            <h1>Beautiful progress</h1>
            <p>
              You answered {correct} of {lesson.exercises.length} activities correctly. Mistakes
              stay available for review; they never lock you out.
            </p>
            <div className="completion-stats">
              <strong>+{correct * 10 + 20} XP</strong>
              <strong>{Math.round((correct / lesson.exercises.length) * 100)}% score</strong>
            </div>
            <button className="button primary large" onClick={complete}>
              Save & continue
            </button>
            <button
              className="button ghost"
              onClick={() => {
                setStep(0);
                setCorrect(0);
              }}
            >
              Repeat lesson
            </button>
          </section>
        )}
      </main>
      {exit && (
        <div className="dialog-backdrop" role="presentation">
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title">
            <h2 id="exit-title">Leave this lesson?</h2>
            <p>Your current answers will not be saved, but you can restart whenever you like.</p>
            <div className="button-row">
              <button className="button danger" onClick={() => navigate("/learn")}>
                Leave lesson
              </button>
              <button className="button secondary" onClick={() => setExit(false)}>
                Keep learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AlphabetPage() {
  const { profile } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<AlphabetEntry | null>(null);
  const entries =
    profile.settings.direction === "english-to-sinhala" ? sinhalaAlphabet : englishAlphabet;
  const categories = ["All", ...new Set(entries.map((entry) => entry.category))];
  const filtered = entries.filter(
    (entry) =>
      (category === "All" || entry.category === category) &&
      `${entry.character}${entry.name}${entry.example}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="page">
      <Header
        eyebrow="Letters & sounds"
        title={
          profile.settings.direction === "english-to-sinhala"
            ? "Sinhala alphabet"
            : "English alphabet & phonics"
        }
        copy="Recognise, hear and trace one character at a time."
        action={
          <Link className="button primary" to="/writing">
            <PenTool /> Writing practice
          </Link>
        }
      />
      <div className="filter-bar">
        <label className="search">
          <Search />
          <span className="sr-only">Search letters</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search letters or examples"
          />
        </label>
        <select
          aria-label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="alphabet-grid">
        {filtered.map((entry) => (
          <button className="letter-card" key={entry.id} onClick={() => setSelected(entry)}>
            <strong lang={entry.language}>
              {entry.character}
              <small>{entry.secondary}</small>
            </strong>
            <span>{entry.transliteration}</span>
            <p>
              {entry.example} · {entry.meaning}
            </p>
            <div>
              <AudioButton text={entry.character} language={entry.language} />
              <Heart />
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
            aria-label={`${selected.character} details`}
          >
            <button className="icon-button close" onClick={() => setSelected(null)}>
              <X />
            </button>
            <span className="giant-letter" lang={selected.language}>
              {selected.character}
            </span>
            <span className="eyebrow">{selected.category}</span>
            <h2>
              {selected.name} · {selected.sound}
            </h2>
            <p>{selected.explanation}</p>
            <div className="example-box">
              <strong>{selected.example}</strong>
              <span>{selected.meaning}</span>
            </div>
            <AudioButton text={selected.character} language={selected.language} />
            <AudioButton text={selected.character} language={selected.language} slow />
            <WritingCanvas character={selected.character} />
          </aside>
        </div>
      )}
    </div>
  );
}

export function WritingPage() {
  const { profile } = useApp();
  const entries =
    profile.settings.direction === "english-to-sinhala" ? sinhalaAlphabet : englishAlphabet;
  const [index, setIndex] = useState(0);
  const entry = entries[index]!;
  return (
    <div className="page narrow-page">
      <Header
        eyebrow="Guided writing"
        title="Trace with confidence"
        copy="Use mouse, touch or stylus. Coverage feedback is guidance, not handwriting recognition."
      />
      <div className="character-picker">
        {entries.slice(0, 16).map((item, itemIndex) => (
          <button
            className={itemIndex === index ? "selected" : ""}
            onClick={() => setIndex(itemIndex)}
            key={item.id}
          >
            {item.character}
          </button>
        ))}
      </div>
      <section className="card writing-lesson">
        <div className="writing-reference">
          <span className="giant-letter">{entry.character}</span>
          <div>
            <span className="eyebrow">{entry.category}</span>
            <h2>{entry.name}</h2>
            <p>
              {entry.example} · {entry.meaning}
            </p>
            <AudioButton text={entry.character} language={entry.language} />
          </div>
        </div>
        <WritingCanvas character={entry.character} onComplete={() => undefined} />
        <div className="button-row end">
          <button
            className="button secondary"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
          >
            Previous
          </button>
          <button
            className="button primary"
            onClick={() => setIndex((value) => (value + 1) % entries.length)}
          >
            Save & next
          </button>
        </div>
      </section>
    </div>
  );
}

export function ListeningPage() {
  const { profile } = useApp();
  const words = vocabulary.slice(0, 12);
  const [index, setIndex] = useState(0);
  const word = words[index]!;
  const target = profile.settings.direction === "english-to-sinhala" ? word.sinhala : word.english;
  const language = profile.settings.direction === "english-to-sinhala" ? "si" : "en";
  return (
    <div className="page narrow-page">
      <Header
        eyebrow="Listening practice"
        title="Hear the useful details"
        copy="Device-supported voices vary by browser. The written phrase is always available."
      />
      <section className="card listening-card">
        <Headphones />
        <span>
          Phrase {index + 1} of {words.length}
        </span>
        <h2 lang={language}>{target}</h2>
        {profile.settings.transliteration !== "never" && (
          <p className="transliteration">{word.transliteration}</p>
        )}
        <p>{language === "si" ? word.english : word.sinhala}</p>
        <div className="button-row center">
          <AudioButton text={target} language={language} />
          <AudioButton text={target} language={language} slow />
        </div>
        <div className="feedback neutral">
          Listen once at normal speed, then slowly. Repeat aloud before revealing the meaning.
        </div>
        <button
          className="button primary large"
          onClick={() => setIndex((value) => (value + 1) % words.length)}
        >
          Next phrase <ChevronRight />
        </button>
      </section>
    </div>
  );
}

export function SpeakingPage() {
  const { profile } = useApp();
  const phrase =
    profile.settings.direction === "english-to-sinhala" ? "ඔබට කොහොමද?" : "How are you?";
  return (
    <div className="page narrow-page">
      <Header
        eyebrow="Speaking practice"
        title="Your voice, kept private"
        copy="Use approximate recognition where supported, or record and compare locally."
      />
      <SpeakingPractice
        phrase={phrase}
        language={profile.settings.direction === "english-to-sinhala" ? "si" : "en"}
      />
    </div>
  );
}

export function VocabularyPage() {
  const { vocabularyStates, updateVocabularyState } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [mode, setMode] = useState<"cards" | "list" | "flashcard">("cards");
  const [flashIndex, setFlashIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const stateMap = useMemo(
    () => new Map(vocabularyStates.map((state) => [state.id, state])),
    [vocabularyStates]
  );
  const filtered = vocabulary.filter((word) => {
    const state = stateMap.get(word.id);
    const matchesState =
      stateFilter === "All" ||
      (stateFilter === "Learned" && state?.learned) ||
      (stateFilter === "Favourites" && state?.favourite) ||
      (stateFilter === "Difficult" && state?.difficult);
    return (
      (category === "All" || word.category === category) &&
      (difficulty === "All" || word.difficulty === difficulty) &&
      matchesState &&
      `${word.english} ${word.sinhala} ${word.transliteration}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  });
  const toggle = async (id: string, key: keyof Omit<VocabularyState, "id">) => {
    const current = stateMap.get(id) ?? { id, learned: false, favourite: false, difficult: false };
    await updateVocabularyState({ ...current, [key]: !current[key] });
  };
  const flash = filtered[flashIndex % Math.max(1, filtered.length)];
  return (
    <div className="page">
      <Header
        eyebrow={`${vocabulary.length} useful words & phrases`}
        title="Vocabulary library"
        copy="Search, listen, save and review practical language for everyday life."
        action={
          <button
            className="button primary"
            onClick={() => {
              setMode("flashcard");
              setFlashIndex(Math.floor(Math.random() * Math.max(1, filtered.length)));
            }}
          >
            <Sparkles /> Random practice
          </button>
        }
      />
      <div className="filter-bar wrap">
        <label className="search">
          <Search />
          <input
            aria-label="Search vocabulary"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="English, Sinhala or transliteration"
          />
        </label>
        <select
          aria-label="Category filter"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>All</option>
          {[...new Set(vocabulary.map((word) => word.category))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Difficulty filter"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          {["All", "foundation", "beginner", "elementary", "intermediate"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Learning state filter"
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value)}
        >
          {["All", "Learned", "Favourites", "Difficult"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <div className="segmented">
          <button
            aria-label="Card view"
            className={mode === "cards" ? "active" : ""}
            onClick={() => setMode("cards")}
          >
            <Grid2X2 />
          </button>
          <button
            aria-label="List view"
            className={mode === "list" ? "active" : ""}
            onClick={() => setMode("list")}
          >
            <List />
          </button>
          <button
            aria-label="Flashcard view"
            className={mode === "flashcard" ? "active" : ""}
            onClick={() => setMode("flashcard")}
          >
            <BookOpen />
          </button>
        </div>
      </div>
      <p className="result-count">{filtered.length} results</p>
      {mode === "flashcard" ? (
        flash ? (
          <section
            className={`flashcard ${revealed ? "revealed" : ""}`}
            onClick={() => setRevealed((value) => !value)}
          >
            <span className="eyebrow">{flash.category}</span>
            <h2>{flash.sinhala}</h2>
            <p className="transliteration">{flash.transliteration}</p>
            {revealed ? (
              <>
                <h3>{flash.english}</h3>
                <AudioButton text={flash.sinhala} language="si" />
              </>
            ) : (
              <p>Tap to reveal</p>
            )}
            <div className="button-row">
              <button
                className="button secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  setFlashIndex((value) => value + 1);
                  setRevealed(false);
                }}
              >
                Next card
              </button>
            </div>
          </section>
        ) : (
          <Missing title="No matching words" copy="Change the filters to continue." />
        )
      ) : (
        <div className={mode === "cards" ? "vocab-grid" : "vocab-list"}>
          {filtered.map((word) => {
            const state = stateMap.get(word.id);
            return (
              <article className="vocab-card" key={word.id}>
                <div className="vocab-top">
                  <span>{word.category}</span>
                  <button
                    className={state?.favourite ? "marked" : ""}
                    aria-label={`Favourite ${word.english}`}
                    onClick={() => toggle(word.id, "favourite")}
                  >
                    <Heart />
                  </button>
                </div>
                <h2 lang="si">{word.sinhala}</h2>
                <p className="transliteration">{word.transliteration}</p>
                <h3>{word.english}</h3>
                <p>{word.examples[0]?.english}</p>
                <div className="vocab-actions">
                  <AudioButton text={word.sinhala} language="si" />
                  <button
                    className={state?.learned ? "marked" : ""}
                    onClick={() => toggle(word.id, "learned")}
                  >
                    <Check /> Learned
                  </button>
                  <button
                    className={state?.difficult ? "marked danger-text" : ""}
                    onClick={() => toggle(word.id, "difficult")}
                  >
                    <Star /> Difficult
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GrammarPage() {
  const [selected, setSelected] = useState(grammarTopics[0]!);
  return (
    <div className="page">
      <Header
        eyebrow={`${grammarTopics.length} bilingual guides`}
        title="Grammar, made practical"
        copy="Learn patterns through useful sentences—not unexplained jargon."
      />
      <div className="split-layout">
        <nav className="topic-list" aria-label="Grammar topics">
          {grammarTopics.map((topic, index) => (
            <button
              className={selected.id === topic.id ? "active" : ""}
              onClick={() => setSelected(topic)}
              key={topic.id}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{topic.title}</strong>
                <small>{topic.titleSi}</small>
              </div>
              <ChevronRight />
            </button>
          ))}
        </nav>
        <article className="card grammar-detail">
          <span className="eyebrow">Grammar pattern</span>
          <h1>{selected.title}</h1>
          <h2 lang="si">{selected.titleSi}</h2>
          <p>{selected.explanationEn}</p>
          <p lang="si">{selected.explanationSi}</p>
          <h3>See the pattern</h3>
          {selected.examples.map((example) => (
            <div className="grammar-example" key={example.english}>
              <div>
                <strong>{example.english}</strong>
                <AudioButton text={example.english} language="en" />
              </div>
              <div lang="si">
                <strong>{example.sinhala}</strong>
                <AudioButton text={example.sinhala} language="si" />
              </div>
              <small>{example.breakdown}</small>
            </div>
          ))}
          <div className="mini-quiz">
            <span className="eyebrow">Mini quiz</span>
            <p>Choose the sentence that means “I read a book.”</p>
            <button onClick={(event) => event.currentTarget.classList.add("correct")}>
              මම පොතක් කියවනවා.
            </button>
            <button onClick={(event) => event.currentTarget.classList.add("incorrect")}>
              මම වතුර බොනවා.
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export function ConversationsPage() {
  const [selected, setSelected] = useState(conversations[0]!);
  const [translation, setTranslation] = useState(true);
  const [role, setRole] = useState("A");
  const [slow, setSlow] = useState(false);
  const playAll = async () => {
    for (const line of selected.lines) {
      const text = line.sinhala;
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "si-LK";
        utterance.rate = slow ? 0.72 : 1;
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }
  };
  return (
    <div className="page">
      <Header
        eyebrow={`${conversations.length} real-life scenarios`}
        title="Conversation practice"
        copy="Listen line by line, choose a role and build confidence in context."
      />
      <div className="scenario-tabs">
        {conversations.map((item, index) => (
          <button
            className={item.id === selected.id ? "active" : ""}
            onClick={() => setSelected(item)}
            key={item.id}
          >
            <span>{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <section className="card conversation-player">
        <div className="card-heading">
          <div>
            <span className="eyebrow">{selected.context}</span>
            <h2>{selected.title}</h2>
            <p lang="si">{selected.titleSi}</p>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={() => setTranslation((shown) => !shown)}>
              {translation ? "Hide" : "Show"} translation
            </button>
            <button
              className={`button secondary ${slow ? "active" : ""}`}
              onClick={() => setSlow((value) => !value)}
            >
              Slow
            </button>
            <button className="button primary" onClick={playAll}>
              <Play /> Play dialogue
            </button>
          </div>
        </div>
        <p>
          <strong>Objective:</strong> {selected.objective}
        </p>
        <div className="role-select">
          <span>Practise as</span>
          {["A", "B"].map((item) => (
            <button
              className={role === item ? "selected" : ""}
              onClick={() => setRole(item)}
              key={item}
            >
              Speaker {item}
            </button>
          ))}
        </div>
        <div className="dialogue">
          {selected.lines.map((line, index) => (
            <article className={`${line.speaker === role ? "my-role" : ""}`} key={index}>
              <div className="avatar">{line.speaker}</div>
              <div>
                <span className="role-label">
                  {line.speaker === role ? "Your line" : `Speaker ${line.speaker}`}
                </span>
                <strong lang="si">{line.sinhala}</strong>
                <span className="transliteration">{line.transliteration}</span>
                {translation && <p>{line.english}</p>}
                <AudioButton text={line.sinhala} language="si" slow={slow} />
                {line.speaker === role && <SpeakingPractice phrase={line.sinhala} language="si" />}
              </div>
            </article>
          ))}
        </div>
        <div className="comprehension">
          <h3>Comprehension check</h3>
          <p>{selected.question}</p>
          <details>
            <summary>Reveal answer</summary>
            <p>{selected.answer}</p>
          </details>
        </div>
      </section>
    </div>
  );
}

const practiceModes = [
  ["Daily challenge", "A balanced five-minute mix", Target, "mixed"],
  ["Quick review", "Revisit recent vocabulary", RotateCcw, "review"],
  ["Flashcards", "Recall before revealing", BookOpen, "flashcards"],
  ["Listening practice", "Hear and identify phrases", Headphones, "listening"],
  ["Speaking practice", "Repeat and compare privately", Mic2, "speaking"],
  ["Writing practice", "Trace useful characters", PenTool, "writing"],
  ["Sentence builder", "Put words in order", Languages, "sentences"],
  ["Vocabulary matching", "Connect both languages", Grid2X2, "matching"],
  ["Difficult words", "Focus on marked words", Star, "difficult"],
  ["Bookmarked words", "Practise favourites", Heart, "bookmarked"],
  ["Random mixed practice", "A surprise learning set", Sparkles, "random"],
  ["Alphabet review", "Recognise scripts and sounds", Languages, "alphabet"],
  ["Grammar review", "Strengthen useful patterns", BookOpen, "grammar"]
] as const;

export function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("mode");
  const sample = courses[0]!.levels[0]!.modules[0]!.lessons[0]!.exercises[0]!;
  if (active === "speaking")
    return (
      <div className="page narrow-page">
        <button className="button ghost" onClick={() => setSearchParams({})}>
          ← Practice hub
        </button>
        <SpeakingPractice />
      </div>
    );
  if (active === "writing")
    return (
      <div className="page narrow-page">
        <button className="button ghost" onClick={() => setSearchParams({})}>
          ← Practice hub
        </button>
        <WritingCanvas />
      </div>
    );
  if (active)
    return (
      <div className="page narrow-page">
        <button className="button ghost" onClick={() => setSearchParams({})}>
          ← Practice hub
        </button>
        <Header
          eyebrow="Active practice"
          title={practiceModes.find((mode) => mode[3] === active)?.[0] ?? "Mixed practice"}
          copy="Complete the activity, retry freely, then choose another mode."
        />
        <ExerciseCard exercise={{ ...sample, id: `${sample.id}-${active}` }} />
      </div>
    );
  return (
    <div className="page">
      <Header
        eyebrow="Choose your focus"
        title="Practice hub"
        copy="Every mode opens a working, repeatable activity."
      />
      <div className="practice-grid">
        {practiceModes.map(([title, copy, Icon, mode]) => (
          <button className="practice-card" onClick={() => setSearchParams({ mode })} key={mode}>
            <Icon />
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewPage() {
  const { vocabularyStates } = useApp();
  const dueWords = vocabularyStates
    .filter((item) => item.learned || item.difficult)
    .map((state) => vocabulary.find((word) => word.id === state.id))
    .filter(Boolean);
  const queue = dueWords.length ? dueWords : vocabulary.slice(0, 10);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = queue[index % queue.length]!;
  const rate = async (rating: ReviewRating) => {
    const previous = await db.reviews.get(word.id);
    await db.reviews.put({ ...scheduleReview(previous, rating), id: word.id });
    setRevealed(false);
    setIndex((value) => value + 1);
  };
  return (
    <div className="page narrow-page">
      <Header
        eyebrow={`${queue.length} items ready`}
        title="Spaced review"
        copy="Overdue, difficult and low-confidence items come first. Ratings schedule the next review locally."
      />
      <section className="review-card">
        <span className="eyebrow">
          Card {(index % queue.length) + 1} of {queue.length}
        </span>
        <h2 lang="si">{word.sinhala}</h2>
        <p className="transliteration">{word.transliteration}</p>
        <AudioButton text={word.sinhala} language="si" />
        {revealed ? (
          <>
            <h3>{word.english}</h3>
            <p>{word.examples[0]?.english}</p>
            <div className="rating-row">
              {(["again", "difficult", "good", "easy"] as const).map((rating) => (
                <button onClick={() => rate(rating)} key={rating}>
                  <strong>{rating}</strong>
                  <span>
                    {rating === "again"
                      ? "10 min"
                      : rating === "difficult"
                        ? "1 day"
                        : rating === "good"
                          ? "2 days"
                          : "4 days"}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <button className="button primary large" onClick={() => setRevealed(true)}>
            Reveal meaning
          </button>
        )}
      </section>
    </div>
  );
}

export function ProgressPage() {
  const { progress, vocabularyStates } = useApp();
  const xp = progress.reduce((sum, item) => sum + item.xp, 0);
  const minutes = progress.reduce((sum, item) => sum + item.minutes, 0);
  const accuracy = progress.length
    ? Math.round(progress.reduce((sum, item) => sum + item.score, 0) / progress.length)
    : 0;
  const streak = calculateStreak(progress.map((item) => item.completedAt));
  return (
    <div className="page">
      <Header
        eyebrow="Your evidence of progress"
        title="Learning progress"
        copy="Every number comes from activity saved on this device."
      />
      <section className="progress-overview">
        <ProgressRing value={Math.round((progress.length / 40) * 100)} label="course" />
        <div>
          <span className="eyebrow">Overall course completion</span>
          <h2>{progress.length} of 40 lessons</h2>
          <p>
            {minutes} minutes studied · {xp} XP earned
          </p>
        </div>
      </section>
      <section className="stat-grid">
        <article>
          <Target />
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
          <small>across completed lessons</small>
        </article>
        <article>
          <Flame />
          <span>Streak</span>
          <strong>{streak.current} days</strong>
          <small>longest {streak.longest}</small>
        </article>
        <article>
          <Languages />
          <span>Mastered words</span>
          <strong>{vocabularyStates.filter((item) => item.learned).length}</strong>
          <small>{vocabularyStates.filter((item) => item.difficult).length} need focus</small>
        </article>
        <article>
          <Clock />
          <span>Study time</span>
          <strong>{minutes} min</strong>
          <small>stored locally</small>
        </article>
      </section>
      <section className="card">
        <h2>Weekly activity</h2>
        <WeeklyChart progress={progress} />
        <p className="accessible-summary">
          {progress.length
            ? `${progress.length} completed lesson records, averaging ${accuracy}% accuracy.`
            : "Complete a lesson to begin your activity history."}
        </p>
      </section>
      <CoursePreview course={courses[0]!} progressIds={new Set(progress.map((item) => item.id))} />
    </div>
  );
}

export function AchievementsPage() {
  const { progress, vocabularyStates } = useApp();
  const earned = [
    progress.length >= 1,
    progress.some((item) => item.score === 100),
    calculateStreak(progress.map((item) => item.completedAt)).longest >= 7,
    false,
    false,
    vocabularyStates.filter((item) => item.learned).length >= 50
  ];
  const badges = [
    ["First lesson", "Begin your learning journey"],
    ["Perfect lesson", "Complete a lesson with 100%"],
    ["Seven-day rhythm", "Learn for seven days"],
    ["First conversation", "Complete a role-play"],
    ["Writing explorer", "Finish a tracing activity"],
    ["Fifty words", "Learn 50 useful words"],
    ["Alphabet explorer", "Review 20 letters"],
    ["Review champion", "Complete 25 reviews"]
  ];
  return (
    <div className="page">
      <Header
        eyebrow={`${earned.filter(Boolean).length} earned`}
        title="Achievements"
        copy="Meaningful milestones celebrate consistency, without punishing missed days."
      />
      <div className="badge-grid">
        {badges.map(([title, copy], index) => (
          <article className={`badge-card ${earned[index] ? "earned" : ""}`} key={title}>
            <div>
              <Award />
            </div>
            <span>{earned[index] ? "Earned" : "In progress"}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { profile, updateProfile, refresh } = useApp();
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const settingsQueue = useRef(Promise.resolve());
  const settings = profile.settings;
  const patch = (value: Partial<typeof settings>) => {
    settingsQueue.current = settingsQueue.current.then(async () => {
      const current = await loadProfile();
      await updateProfile({ ...current, settings: { ...current.settings, ...value } });
    });
    return settingsQueue.current;
  };
  const download = async () => {
    const backup = await exportBackup(profile);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `lingolanka-backup-${todayKey()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Progress export downloaded.");
  };
  const upload = async (file: File) => {
    try {
      await importBackup(JSON.parse(await file.text()) as unknown);
      await refresh();
      setMessage("Validated progress imported successfully.");
    } catch {
      setMessage("This file is not a valid LingoLanka backup. Nothing was changed.");
    }
  };
  return (
    <div className="page settings-page">
      <Header
        eyebrow="Personalise your experience"
        title="Settings"
        copy="Preferences and progress are stored only in this browser."
      />
      <section className="settings-section">
        <h2>Install on this device</h2>
        <div className="settings-card install-settings-card">
          <div>
            <Download />
            <span>
              <strong>Use LingoLanka like a phone app</strong>
              <small>Add it to your Android or iPhone home screen for full-screen access.</small>
            </span>
          </div>
          <Link className="button primary" to="/install">
            View install guide
          </Link>
        </div>
      </section>
      <section className="settings-section">
        <h2>Course & learning</h2>
        <div className="settings-card">
          <label>
            <span>
              <strong>Learning direction</strong>
              <small>Switch without deleting previous progress.</small>
            </span>
            <select
              value={settings.direction}
              onChange={(event) =>
                patch({
                  direction: event.target.value as typeof settings.direction,
                  interfaceLanguage: event.target.value === "english-to-sinhala" ? "en" : "si"
                })
              }
            >
              <option value="english-to-sinhala">English → Sinhala</option>
              <option value="sinhala-to-english">Sinhala → English</option>
            </select>
          </label>
          <label>
            <span>
              <strong>Transliteration</strong>
              <small>Latin support for Sinhala script.</small>
            </span>
            <select
              value={settings.transliteration}
              onChange={(event) =>
                patch({ transliteration: event.target.value as typeof settings.transliteration })
              }
            >
              <option value="always">Always show</option>
              <option value="request">Show on request</option>
              <option value="never">Never show</option>
            </select>
          </label>
          <label>
            <span>
              <strong>Daily target</strong>
              <small>A gentle, adjustable goal.</small>
            </span>
            <select
              value={settings.dailyTarget}
              onChange={(event) => patch({ dailyTarget: Number(event.target.value) })}
            >
              {[5, 10, 15, 20].map((value) => (
                <option value={value} key={value}>
                  {value} minutes
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className="settings-section">
        <h2>Appearance & accessibility</h2>
        <div className="settings-card">
          <label>
            <span>
              <strong>Theme</strong>
              <small>Light, dark or match your device.</small>
            </span>
            <select
              value={settings.theme}
              onChange={(event) => patch({ theme: event.target.value as typeof settings.theme })}
            >
              {["system", "light", "dark"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>
              <strong>Text size</strong>
              <small>Increase text throughout lessons.</small>
            </span>
            <select
              value={settings.textSize}
              onChange={(event) =>
                patch({ textSize: event.target.value as typeof settings.textSize })
              }
            >
              {["normal", "large", "extra"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <Toggle
            label="High contrast"
            copy="Strengthen borders and colours."
            checked={settings.highContrast}
            onChange={(value) => patch({ highContrast: value })}
          />
          <Toggle
            label="Reduced motion"
            copy="Limit interface animation."
            checked={settings.reducedMotion}
            onChange={(value) => patch({ reducedMotion: value })}
          />
        </div>
      </section>
      <section className="settings-section">
        <h2>Device speech</h2>
        <div className="settings-card">
          <label>
            <span>
              <strong>Speech speed</strong>
              <small>{settings.speechRate.toFixed(1)}×</small>
            </span>
            <input
              type="range"
              min=".5"
              max="1.5"
              step=".1"
              value={settings.speechRate}
              onChange={(event) => patch({ speechRate: Number(event.target.value) })}
            />
          </label>
          <label>
            <span>
              <strong>Speech pitch</strong>
              <small>{settings.speechPitch.toFixed(1)}</small>
            </span>
            <input
              type="range"
              min=".5"
              max="1.5"
              step=".1"
              value={settings.speechPitch}
              onChange={(event) => patch({ speechPitch: Number(event.target.value) })}
            />
          </label>
          <label>
            <span>
              <strong>Speech volume</strong>
              <small>{Math.round(settings.speechVolume * 100)}%</small>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step=".1"
              value={settings.speechVolume}
              onChange={(event) => patch({ speechVolume: Number(event.target.value) })}
            />
          </label>
          <p className="notice">
            Available voices depend on your browser and operating system. A Sinhala voice may not be
            installed.
          </p>
        </div>
      </section>
      <section className="settings-section">
        <h2>Your data</h2>
        <div className="settings-card data-actions">
          <p>
            <ShieldCheck /> Progress lives on this device unless you export it. Voice recordings are
            never stored here.
          </p>
          <div className="button-row">
            <button className="button secondary" onClick={download}>
              <Download /> Export progress
            </button>
            <button className="button secondary" onClick={() => fileRef.current?.click()}>
              <Upload /> Import progress
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button className="button danger" onClick={() => setConfirmReset(true)}>
              <RotateCcw /> Reset all progress
            </button>
          </div>
          {message && (
            <p role="status" className="feedback neutral">
              {message}
            </p>
          )}
        </div>
      </section>
      {confirmReset && (
        <div className="dialog-backdrop">
          <div className="dialog" role="alertdialog" aria-modal="true">
            <h2>Reset all progress?</h2>
            <p>
              This removes course progress, reviews and preferences from this device. Export first
              if you may want it later.
            </p>
            <div className="button-row">
              <button
                className="button danger"
                onClick={async () => {
                  await resetDatabase();
                  await refresh();
                  setConfirmReset(false);
                  setMessage("Local progress was reset.");
                }}
              >
                Reset permanently
              </button>
              <button className="button secondary" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  copy,
  checked,
  onChange
}: {
  label: string;
  copy: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label>
      <span>
        <strong>{label}</strong>
        <small>{copy}</small>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <i />
      </button>
    </label>
  );
}

export function AboutPage() {
  return (
    <div className="page info-page">
      <Header
        eyebrow="Why LingoLanka exists"
        title="A respectful bridge between languages"
        copy="LingoLanka helps complete beginners move toward confident everyday Sinhala or English."
      />
      <section className="info-hero">
        <Languages />
        <div>
          <h2>Two directions. One shared goal.</h2>
          <p>
            Reading, writing, listening, speaking, vocabulary, grammar and practical conversation
            work together. The course is deliberately free of accounts, subscriptions and paid APIs.
          </p>
        </div>
      </section>
      <div className="info-grid">
        <article className="card">
          <BookOpen />
          <h2>Practical by design</h2>
          <p>
            Forty lessons across five levels use useful topics: family, food, travel, school, work,
            health and everyday help.
          </p>
        </article>
        <article className="card">
          <ShieldCheck />
          <h2>Private by default</h2>
          <p>
            Learning records stay in IndexedDB on your device. You choose when to export, import or
            clear them.
          </p>
        </article>
        <article className="card">
          <WifiOff />
          <h2>Offline-friendly</h2>
          <p>
            The installable app shell and core curriculum are cached after the first successful
            visit.
          </p>
        </article>
      </div>
      <section className="card">
        <h2>Language respect and corrections</h2>
        <p>
          Sinhala is stored as Unicode with consistent transliteration. Language is nuanced;
          community corrections are welcome through the public source repository.
        </p>
      </section>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="page info-page">
      <Header
        eyebrow="Simple, student-friendly privacy"
        title="Your progress belongs to you"
        copy="LingoLanka works without an account and collects no personal profile."
      />
      <section className="privacy-list">
        {[
          [
            ShieldCheck,
            "Stored on this device",
            "Lesson progress, settings and reviews stay in your browser."
          ],
          [
            Mic2,
            "Microphone only when you ask",
            "Permission is requested only after you start speaking practice. Audio is never uploaded and temporary recordings are deleted when you leave."
          ],
          [
            Download,
            "Portable when you choose",
            "Export a JSON backup, validate it on import, or clear everything from Settings."
          ],
          [
            WifiOff,
            "No ads or trackers",
            "There are no behavioural profiles, advertising cookies, analytics services or location tracking."
          ]
        ].map(([Icon, title, copy]) => {
          const Component = Icon as typeof ShieldCheck;
          return (
            <article key={title as string}>
              <Component />
              <div>
                <h2>{title as string}</h2>
                <p>{copy as string}</p>
              </div>
            </article>
          );
        })}
      </section>
      <div className="notice">
        <strong>Voice note:</strong> Speech synthesis and recognition are browser features. Your
        browser or operating system may process speech according to its own privacy settings. The
        local recording fallback does not upload audio.
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="page center-page">
      <Missing
        title="This path wandered away"
        copy="The page does not exist, but your learning progress is safe."
      />
      <Link className="button primary" to="/dashboard">
        Return to dashboard
      </Link>
    </div>
  );
}

function Missing({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="card empty-state">
      <Languages />
      <h2>{title}</h2>
      <p>{copy}</p>
    </section>
  );
}
