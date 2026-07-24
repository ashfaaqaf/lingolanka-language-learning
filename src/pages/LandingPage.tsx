import {
  ArrowRight,
  BookOpen,
  Check,
  Headphones,
  Languages,
  Mic2,
  PenTool,
  ShieldCheck,
  WifiOff
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="app-brand" to="/">
          <span className="brand-mark">
            <Languages />
          </span>
          <span>
            LingoLanka<small>සිංහල · English</small>
          </span>
        </Link>
        <nav aria-label="Public navigation">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link className="button small" to="/onboarding">
            Start learning
          </Link>
        </nav>
      </header>
      <section className="hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="eyebrow">Free forever · No account · Works offline</span>
          <h1>
            Learn Sinhala. Learn English. <em>Connect without limits.</em>
          </h1>
          <p lang="si" className="hero-si">
            සිංහල ඉගෙන ගන්න. ඉංග්‍රීසි ඉගෙන ගන්න. සීමාවකින් තොරව සම්බන්ධ වන්න.
          </p>
          <p className="lede">
            A calm, practical path from your first sound to confident everyday conversation—built
            for learners in both directions.
          </p>
          <div className="button-row">
            <Link className="button primary large" to="/onboarding">
              Start learning <ArrowRight />
            </Link>
            <Link className="button secondary large" to="/learn">
              Explore the course
            </Link>
          </div>
          <ul className="trust-list">
            <li>
              <Check /> Private on your device
            </li>
            <li>
              <Check /> Real bilingual content
            </li>
            <li>
              <Check /> No subscription
            </li>
          </ul>
        </motion.div>
        <motion.div
          className="product-preview"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
        >
          <div className="preview-top">
            <span>Today’s lesson</span>
            <strong>6 min</strong>
          </div>
          <div className="preview-progress">
            <span style={{ width: "68%" }} />
          </div>
          <span className="eyebrow">Listen & repeat</span>
          <div className="preview-word" lang="si">
            ආයුබෝවන්
          </div>
          <div className="transliteration">āyubōvan</div>
          <p>Hello · May you live long</p>
          <div className="wave" aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <i key={index} style={{ height: `${14 + ((index * 11) % 36)}px` }} />
            ))}
          </div>
          <button className="button primary">
            <Mic2 /> Hold to practise
          </button>
        </motion.div>
      </section>
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
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}
