import { Check, CheckCircle2, Ear, MessageCircle, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AudioButton } from "../components/AudioButton";
import { useApp } from "../context/AppContext";
import { courses } from "../data/content";
import { englishPronunciation, sinhalaPronunciation } from "../data/pronunciation";

export function PronunciationPage() {
  const { profile } = useApp();
  const learningSinhala = profile.settings.direction === "english-to-sinhala";
  const items = learningSinhala ? sinhalaPronunciation : englishPronunciation;
  const storageKey = `lingolanka-pronunciation-${profile.settings.direction}`;
  const [practised, setPractised] = useState<Set<string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
      return new Set(saved);
    } catch {
      return new Set();
    }
  });
  const course = courses.find((item) => item.id === profile.settings.direction) ?? courses[0]!;
  const firstLesson = course.levels.flatMap((level) => level.modules)[0]?.lessons[0];
  const progress = Math.round((practised.size / items.length) * 100);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...practised]));
  }, [practised, storageKey]);

  const copy = learningSinhala
    ? {
        eyebrow: "Start here · Before Lesson 1",
        title: "Hear Sinhala before you study it",
        intro:
          "Listen first, read the simple sound cue, then repeat. You do not need to memorise the whole alphabet today.",
        listen: "1. Listen",
        look: "2. Look",
        repeat: "3. Repeat",
        sayLike: "Say it like",
        normal: "Normal speed",
        slow: "Slow version",
        mark: "I practised this",
        marked: "Practised",
        ready: "Ready for your first lesson?",
        next: "Start Lesson 1"
      }
    : {
        eyebrow: "මෙතැනින් අරඹන්න · පළමු පාඩමට පෙර",
        title: "පාඩම් කිරීමට පෙර ඉංග්‍රීසි හඬ අසන්න",
        intro:
          "පළමුව අසන්න, සරල උච්චාරණ ඉඟිය බලන්න, පසුව නැවත කියන්න. අදම සියල්ල මතක තබා ගැනීමට අවශ්‍ය නැහැ.",
        listen: "1. අසන්න",
        look: "2. බලන්න",
        repeat: "3. නැවත කියන්න",
        sayLike: "මෙලෙස කියන්න",
        normal: "සාමාන්‍ය වේගය",
        slow: "මන්දගාමීව",
        mark: "මම මෙය පුහුණු කළා",
        marked: "පුහුණු කළා",
        ready: "පළමු පාඩමට සූදානම්ද?",
        next: "පළමු පාඩම අරඹන්න"
      };

  const toggle = (id: string) => {
    setPractised((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page pronunciation-page">
      <header className="pronunciation-hero">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="pronunciation-progress" aria-label={`${progress}% complete`}>
          <strong>{progress}%</strong>
          <span>{practised.size} / {items.length}</span>
        </div>
      </header>

      <ol className="pronunciation-method" aria-label="Pronunciation method">
        <li><Ear aria-hidden="true" /><strong>{copy.listen}</strong></li>
        <li><MessageCircle aria-hidden="true" /><strong>{copy.look}</strong></li>
        <li><MoveRight aria-hidden="true" /><strong>{copy.repeat}</strong></li>
      </ol>

      <section className="pronunciation-grid" aria-label="Pronunciation practice">
        {items.map((item, index) => {
          const done = practised.has(item.id);
          return (
            <article className={`pronunciation-card ${done ? "complete" : ""}`} key={item.id}>
              <div className="pronunciation-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {done && <CheckCircle2 aria-label={copy.marked} />}
              </div>
              <strong className="pronunciation-text" lang={item.language}>{item.text}</strong>
              <p>{learningSinhala ? item.meaningEn : item.meaningSi}</p>
              <div className="say-like">
                <span>{copy.sayLike}</span>
                <strong>{item.sayLike}</strong>
                <small>{learningSinhala ? item.tipEn : item.tipSi}</small>
              </div>
              <div className="pronunciation-audio-row">
                <div>
                  <small>{copy.normal}</small>
                  <AudioButton text={item.text} language={item.language} />
                </div>
                <div>
                  <small>{copy.slow}</small>
                  <AudioButton text={item.text} language={item.language} slow />
                </div>
              </div>
              <button
                type="button"
                className={`button ${done ? "secondary" : "primary"}`}
                aria-pressed={done}
                onClick={() => toggle(item.id)}
              >
                <Check aria-hidden="true" /> {done ? copy.marked : copy.mark}
              </button>
            </article>
          );
        })}
      </section>

      {firstLesson && (
        <section className="pronunciation-finish">
          <CheckCircle2 aria-hidden="true" />
          <div>
            <h2>{copy.ready}</h2>
            <p>{learningSinhala ? "You can replay these sounds at any time." : "මෙම හඬ ඕනෑම වේලාවක නැවත අසන්න පුළුවන්."}</p>
          </div>
          <Link className="button primary large" to={`/lesson/${firstLesson.id}`}>
            {copy.next} <MoveRight aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}
