import { ExternalLink, Library } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { advancedLessons } from "../data/advanced";
import { sources } from "../data/sources";

const reuseLabel = {
  "text and examples": "Sentences and wording reused",
  "facts only": "Facts only, in our own words",
  "files under licence": "Files used under licence"
} as const;

export function SourcesPage() {
  const { hash } = useLocation();
  // Citations link here as /sources#<id>; HashRouter leaves that to us. The
  // timeout lets the app's scroll-to-top on route change run first.
  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      target?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="page info-page sources-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Sources &amp; credits</span>
          <h1>Where everything comes from</h1>
          <p>
            Every Intermediate and Expert sentence is quoted from a source whose licence allows it,
            with its page. The explanations are our own words, and each names the page its fact
            comes from. Where no source covers a topic, LingoLanka leaves it out rather than guess.
          </p>
        </div>
      </header>

      <section className="sources-list" aria-label="Sources">
        {Object.values(sources).map((source) => (
          <article className="card source-card" id={source.id} key={source.id} tabIndex={-1}>
            <Library aria-hidden="true" />
            <div>
              <h2>{source.title}</h2>
              <p className="source-meta">
                {source.author} · {source.publisher} · {source.year}
              </p>
              <dl>
                <dt>Licence</dt>
                <dd>{source.licence}</dd>
                <dt>Used for</dt>
                <dd>{source.use}</dd>
                <dt>Reuse</dt>
                <dd>{reuseLabel[source.reuse]}</dd>
              </dl>
              {source.note && <p>{source.note}</p>}
              <a href={source.url} target="_blank" rel="noreferrer">
                Open the source <ExternalLink aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="card sources-ledger" aria-labelledby="ledger-title">
        <h2 id="ledger-title">Lesson ledger</h2>
        <p>Which pages each grammar lesson quotes.</p>
        <table>
          <thead>
            <tr>
              <th scope="col">Lesson</th>
              <th scope="col">Sentences</th>
              <th scope="col">Pages and sections cited</th>
            </tr>
          </thead>
          <tbody>
            {advancedLessons.map((lesson) => {
              const cited = new Set(
                [...lesson.points, ...lesson.examples]
                  .map((item) => item.cite)
                  .filter((cite) => cite !== undefined)
                  .map((cite) => `${sources[cite.source].short}, ${cite.at}`)
              );
              return (
                <tr key={lesson.id}>
                  <th scope="row">{lesson.title}</th>
                  <td>{lesson.examples.length}</td>
                  <td>{[...cited].join("; ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
