import { BookOpenText, HandHeart, MessageCircle, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { citationLabel } from "../data/sources";
import { usageLabels, usageNoteFor } from "../data/usageNotes";
import { realExampleFor } from "../lib/examples";

const SINHALA_RUN = /([඀-෿‍]+(?:\s+[඀-෿‍]+)*)/;

/** Wraps each run of Sinhala inside an English note in its own lang="si". */
export function MixedText({ text }: { text: string }) {
  return (
    <>
      {text.split(SINHALA_RUN).map((part, index) =>
        index % 2 ? (
          <span lang="si" key={index}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

const ICONS = { meaning: BookOpenText, respect: HandHeart, register: MessageCircle };

/**
 * The context a one-word translation leaves out: what the word really covers,
 * where it would give offence, and what people actually say. Renders nothing
 * for a word that needs no note.
 */
export function UsageNote({ sinhala }: { sinhala: string }) {
  const note = usageNoteFor(sinhala);
  if (!note) return null;
  const Icon = ICONS[note.kind];
  return (
    <aside className={`usage-note usage-${note.kind}`} lang="en">
      <strong>
        <Icon aria-hidden="true" />
        {usageLabels[note.kind]}
      </strong>
      <p>
        <MixedText text={note.note} />
      </p>
      {note.cite && (
        <Link className="cite" to={`/sources#${note.cite.source}`}>
          {citationLabel(note.cite)}
        </Link>
      )}
    </aside>
  );
}

/** A real sentence from the app that uses the word, or nothing. */
export function RealExample({ sinhala }: { sinhala: string }) {
  const example = realExampleFor(sinhala);
  if (!example) return null;
  return (
    <figure className="real-example">
      <Quote aria-hidden="true" />
      <blockquote>
        <p lang="si">{example.sinhala}</p>
        <p lang="en">{example.english}</p>
      </blockquote>
      <figcaption>{example.source}</figcaption>
    </figure>
  );
}
