import { BookOpenCheck, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { AdvancedLesson } from "../data/advanced";
import { citationLabel, type Citation } from "../data/sources";
import { transliterate } from "../lib/transliterate";
import { AudioButton } from "./AudioButton";
import { MixedText } from "./UsageNote";

function Cite({ cite }: { cite: Citation }) {
  return (
    <Link className="cite" to={`/sources#${cite.source}`}>
      {citationLabel(cite)}
    </Link>
  );
}

/**
 * The explanation an Intermediate or Expert lesson gives before its questions:
 * the rule in plain words, then the sourced sentences it comes from.
 */
export function LessonTeaching({
  lesson,
  onStart
}: {
  lesson: AdvancedLesson;
  onStart: () => void;
}) {
  const { profile } = useApp();
  const showTransliteration = profile.settings.transliteration !== "never";
  return (
    <article className="lesson-teaching">
      <header>
        <span className="eyebrow">{lesson.level === 6 ? "Intermediate" : "Expert"}</span>
        <h1>{lesson.title}</h1>
        <p lang="si" className="lesson-teaching-form">
          {lesson.titleSi}
        </p>
        <p>{lesson.summary}</p>
      </header>

      <section aria-labelledby="teaching-rules">
        <h2 id="teaching-rules">
          <BookOpenCheck aria-hidden="true" /> How it works
        </h2>
        <ol className="teaching-points">
          {lesson.points.map((point) => (
            <li key={point.text}>
              <p>
                <MixedText text={point.text} />
              </p>
              {point.cite && <Cite cite={point.cite} />}
            </li>
          ))}
        </ol>
      </section>

      {lesson.examples.length > 0 && (
        <section aria-labelledby="teaching-examples">
          <h2 id="teaching-examples">
            <Quote aria-hidden="true" /> Sentences from the course
          </h2>
          <ul className="teaching-examples">
            {lesson.examples.map((example) => (
              <li key={example.si}>
                <p className="teaching-si" lang="si">
                  {example.si}
                </p>
                {showTransliteration && (
                  <p className="teaching-translit">{transliterate(example.si)}</p>
                )}
                <p className="teaching-en">{example.en}</p>
                <div className="teaching-example-foot">
                  <AudioButton
                    text={example.si}
                    language="si"
                    label={`Hear the Sinhala: ${example.si}`}
                  />
                  <Cite cite={example.cite} />
                </div>
              </li>
            ))}
          </ul>
          <p className="teaching-note">
            Audio is your device's Sinhala voice, so it can sound flat or be missing; read the
            transliteration aloud too. Spellings follow today's standard where the 1979 print
            differs.
          </p>
        </section>
      )}

      <button type="button" className="button primary large" onClick={onStart}>
        Practise <ChevronRight aria-hidden="true" />
      </button>
    </article>
  );
}
