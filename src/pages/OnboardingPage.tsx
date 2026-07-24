import { ArrowLeft, ArrowRight, Check, Languages, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const levels = ["Complete beginner", "I know a few words", "Basic", "Intermediate"];
const goals = [
  "Everyday conversation",
  "Reading",
  "Writing",
  "Pronunciation",
  "School",
  "Work",
  "Travel",
  "Friends and family",
  "Complete mastery"
];

export function OnboardingPage() {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [known, setKnown] = useState<"en" | "si">(profile.settings.interfaceLanguage);
  const [level, setLevel] = useState(profile.level);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile.goals);
  const [dailyTarget, setDailyTarget] = useState(profile.settings.dailyTarget);
  const complete = async () => {
    await updateProfile({
      ...profile,
      onboarded: true,
      level,
      goals: selectedGoals,
      settings: {
        ...profile.settings,
        interfaceLanguage: known,
        direction: known === "en" ? "english-to-sinhala" : "sinhala-to-english",
        dailyTarget
      }
    });
    navigate("/dashboard");
  };
  return (
    <main className="onboarding">
      <div className="onboarding-brand">
        <Languages /> LingoLanka
      </div>
      <section className="onboarding-card">
        <div className="step-meta">
          <span>Step {step} of 6</span>
          <div className="steps" aria-label={`Step ${step} of 6`}>
            {Array.from({ length: 6 }, (_, index) => (
              <i className={index < step ? "done" : ""} key={index} />
            ))}
          </div>
        </div>
        {step === 1 && (
          <div className="step-content">
            <span className="eyebrow">Let’s begin</span>
            <h1>Which language do you understand?</h1>
            <p>This becomes the language of your instructions and feedback.</p>
            <div className="big-options">
              <button className={known === "en" ? "selected" : ""} onClick={() => setKnown("en")}>
                <strong>English</strong>
                <span>I want to learn Sinhala</span>
              </button>
              <button className={known === "si" ? "selected" : ""} onClick={() => setKnown("si")}>
                <strong lang="si">සිංහල</strong>
                <span lang="si">මට ඉංග්‍රීසි ඉගෙන ගන්න ඕනෑ</span>
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="step-content">
            <span className="eyebrow">Your course</span>
            <h1>{known === "en" ? "You’ll learn Sinhala" : "ඔබ ඉංග්‍රීසි ඉගෙන ගනී"}</h1>
            <div className="course-confirm">
              <Languages />
              <div>
                <strong>{known === "en" ? "English → සිංහල" : "සිංහල → English"}</strong>
                <p>
                  {known === "en"
                    ? "English guidance with Sinhala practice."
                    : "සිංහල පැහැදිලි කිරීම් සමඟ ඉංග්‍රීසි පුහුණුව."}
                </p>
              </div>
              <Check />
            </div>
            <p>You can change direction later without losing progress.</p>
          </div>
        )}
        {step === 3 && (
          <div className="step-content">
            <span className="eyebrow">Starting point</span>
            <h1>{known === "en" ? "What is your current level?" : "ඔබේ වර්තමාන මට්ටම කුමක්ද?"}</h1>
            <div className="option-list">
              {levels.map((item) => (
                <button
                  className={level === item ? "selected" : ""}
                  onClick={() => setLevel(item)}
                  key={item}
                >
                  {item}
                  {level === item && <Check />}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="step-content">
            <span className="eyebrow">Make it yours</span>
            <h1>
              {known === "en" ? "What would you like to achieve?" : "ඔබේ ඉගෙනුම් ඉලක්ක මොනවාද?"}
            </h1>
            <p>Select as many as you like.</p>
            <div className="chip-options">
              {goals.map((goal) => (
                <button
                  className={selectedGoals.includes(goal) ? "selected" : ""}
                  onClick={() =>
                    setSelectedGoals((current) =>
                      current.includes(goal)
                        ? current.filter((item) => item !== goal)
                        : [...current, goal]
                    )
                  }
                  key={goal}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="step-content">
            <span className="eyebrow">A gentle rhythm</span>
            <h1>Choose your daily target</h1>
            <div className="big-options four">
              {[5, 10, 15, 20].map((minutes) => (
                <button
                  className={dailyTarget === minutes ? "selected" : ""}
                  onClick={() => setDailyTarget(minutes)}
                  key={minutes}
                >
                  <strong>{minutes}</strong>
                  <span>minutes</span>
                </button>
              ))}
            </div>
            <p>No harsh penalties if you miss a day. Small steps still count.</p>
          </div>
        )}
        {step === 6 && (
          <div className="step-content celebration">
            <Sparkles />
            <span className="eyebrow">Optional placement</span>
            <h1>You’re ready to learn</h1>
            <p>
              Start from Foundations now. You can explore advanced modules at any time, so there is
              no need to prove what you know.
            </p>
            <div className="course-confirm">
              <Check />
              <div>
                <strong>{level}</strong>
                <p>
                  {dailyTarget} minutes a day · {selectedGoals.length || 1} learning goal
                  {selectedGoals.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="onboarding-actions">
          <button
            className="button ghost"
            disabled={step === 1}
            onClick={() => setStep((value) => value - 1)}
          >
            <ArrowLeft /> Back
          </button>
          {step < 6 ? (
            <button className="button primary" onClick={() => setStep((value) => value + 1)}>
              Continue <ArrowRight />
            </button>
          ) : (
            <button className="button primary" onClick={complete}>
              Skip placement & start <ArrowRight />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
