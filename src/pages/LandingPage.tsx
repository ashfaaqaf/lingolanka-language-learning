import {
  ArrowRight,
  BookOpen,
  Download,
  Headphones,
  Languages,
  Mic2,
  PenTool,
  ShieldCheck,
  WifiOff
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { GlobalNav } from "../components/GlobalNav";
import { Hero } from "../components/Hero";
import { useApp } from "../context/AppContext";

export function LandingPage() {
  const { profile, ready } = useApp();

  if (ready && profile.onboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <GlobalNav />
      <main className="landing" id="main-content">
        <Hero />
        <section className="direction-section">
          <div>
            <span className="eyebrow">Choose your direction</span>
            <h2>One bridge, two learning paths</h2>
          </div>
          <div className="direction-grid">
            <Link to="/onboarding" className="direction-card">
              <span>English → සිංහල</span>
              <h3>Master Sinhala</h3>
              <p>
                Learn script, natural sounds and practical conversation with clear English guidance.
              </p>
              <ArrowRight />
            </Link>
            <Link to="/onboarding" className="direction-card si-card">
              <span>සිංහල → English</span>
              <h3 lang="si">ඉංග්‍රීසි විශ්වාසයෙන් ඉගෙන ගන්න</h3>
              <p lang="si">සිංහල පැහැදිලි කිරීම් සමඟ කියවීම, ලිවීම සහ කතා කිරීම පුහුණු වන්න.</p>
              <ArrowRight />
            </Link>
          </div>
        </section>
        <section className="feature-section">
          <div className="section-heading">
            <span className="eyebrow">Whole-language learning</span>
            <h2>Practise every skill, not just vocabulary</h2>
          </div>
          <div className="feature-grid">
            {[
              [BookOpen, "Read", "Guided script, phonics and short passages."],
              [PenTool, "Write", "Touch-friendly tracing with honest coverage feedback."],
              [Headphones, "Listen", "Device-supported pronunciation at normal and slow speed."],
              [Mic2, "Speak", "Approximate word matching or private local recording."]
            ].map(([Icon, title, copy]) => {
              const IconComponent = Icon as typeof BookOpen;
              return (
                <article className="feature-card" key={title as string}>
                  <IconComponent />
                  <h3>{title as string}</h3>
                  <p>{copy as string}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className="promise-section">
          <article>
            <ShieldCheck />
            <h2>Your learning stays yours</h2>
            <p>
              No account, ads, trackers or uploaded voice recordings. Progress stays in this browser
              unless you export it.
            </p>
          </article>
          <article>
            <WifiOff />
            <h2>Learning that travels</h2>
            <p>
              Install LingoLanka and keep reading, vocabulary, grammar and writing available after
              your first visit.
            </p>
            <Link className="button secondary small" to="/install">
              <Download /> Install on your phone
            </Link>
          </article>
        </section>
        <footer>
          <div className="app-brand">
            <span className="brand-mark">
              <Languages />
            </span>
            <span>LingoLanka</span>
          </div>
          <p>Free, open and made with respect for every learner.</p>
          <div>
            <Link to="/install">Install</Link>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
