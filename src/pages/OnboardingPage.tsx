import { ArrowLeft, ArrowRight, Check, Languages, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  onboardingCopy,
  onboardingGoals,
  onboardingLevels,
  type InterfaceLanguage
} from "../data/onboarding";

export function OnboardingPage() {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [known, setKnown] = useState<InterfaceLanguage>(profile.settings.interfaceLanguage);
  const [level, setLevel] = useState(profile.level);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile.goals);
  const [dailyTarget, setDailyTarget] = useState(profile.settings.dailyTarget);
  const copy = onboardingCopy[known];
  const selectedLevelLabel =
    onboardingLevels.find((item) => item.value === level)?.label[known] ?? level;

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
    <main className="onboarding" lang={known}>
      <div className="onboarding-brand">
        <Languages /> LingoLanka
      </div>
      <section className="onboarding-card">
        <div className="step-meta">
          <span>{copy.stepOf(step)}</span>
          <div className="steps" aria-label={copy.stepOf(step)}>
            {Array.from({ length: 6 }, (_, index) => (
              <i className={index < step ? "done" : ""} key={index} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <span className="eyebrow">{copy.beginEyebrow}</span>
            <h1>{copy.languageQuestion}</h1>
            <p>{copy.languageHelp}</p>
            <div className="big-options">
              <button
                type="button"
                className={known === "en" ? "selected" : ""}
                aria-pressed={known === "en"}
                onClick={() => setKnown("en")}
              >
                <strong>{copy.english}</strong>
                <span>{copy.englishChoice}</span>
              </button>
              <button
                type="button"
                className={known === "si" ? "selected" : ""}
                aria-pressed={known === "si"}
                onClick={() => setKnown("si")}
              >
                <strong>{copy.sinhala}</strong>
                <span>{copy.sinhalaChoice}</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <span className="eyebrow">{copy.courseEyebrow}</span>
            <h1>{copy.courseTitle}</h1>
            <div className="course-confirm">
              <Languages />
              <div>
                <strong>{copy.courseDirection}</strong>
                <p>{copy.courseHelp}</p>
              </div>
              <Check />
            </div>
            <p>{copy.directionNote}</p>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <span className="eyebrow">{copy.levelEyebrow}</span>
            <h1>{copy.levelQuestion}</h1>
            <div className="option-list">
              {onboardingLevels.map((item) => (
                <button
                  type="button"
                  className={level === item.value ? "selected" : ""}
                  aria-pressed={level === item.value}
                  onClick={() => setLevel(item.value)}
                  key={item.value}
                >
                  {item.label[known]}
                  {level === item.value && <Check />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <span className="eyebrow">{copy.goalsEyebrow}</span>
            <h1>{copy.goalsQuestion}</h1>
            <p>{copy.goalsHelp}</p>
            <div className="chip-options">
              {onboardingGoals.map((goal) => (
                <button
                  type="button"
                  className={selectedGoals.includes(goal.value) ? "selected" : ""}
                  aria-pressed={selectedGoals.includes(goal.value)}
                  onClick={() =>
                    setSelectedGoals((current) =>
                      current.includes(goal.value)
                        ? current.filter((item) => item !== goal.value)
                        : [...current, goal.value]
                    )
                  }
                  key={goal.value}
                >
                  {goal.label[known]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-content">
            <span className="eyebrow">{copy.targetEyebrow}</span>
            <h1>{copy.targetQuestion}</h1>
            <div className="big-options four">
              {[5, 10, 15, 20].map((minutes) => (
                <button
                  type="button"
                  className={dailyTarget === minutes ? "selected" : ""}
                  aria-pressed={dailyTarget === minutes}
                  onClick={() => setDailyTarget(minutes)}
                  key={minutes}
                >
                  <strong>{minutes}</strong>
                  <span>{copy.minutes}</span>
                </button>
              ))}
            </div>
            <p>{copy.targetHelp}</p>
          </div>
        )}

        {step === 6 && (
          <div className="step-content celebration">
            <Sparkles />
            <span className="eyebrow">{copy.readyEyebrow}</span>
            <h1>{copy.readyTitle}</h1>
            <p>{copy.readyHelp}</p>
            <div className="course-confirm">
              <Check />
              <div>
                <strong>{selectedLevelLabel}</strong>
                <p>{copy.summary(dailyTarget, selectedGoals.length)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          <button
            type="button"
            className="button ghost"
            disabled={step === 1}
            onClick={() => setStep((value) => value - 1)}
          >
            <ArrowLeft /> {copy.back}
          </button>
          {step < 6 ? (
            <button
              type="button"
              className="button primary"
              onClick={() => setStep((value) => value + 1)}
            >
              {copy.continue} <ArrowRight />
            </button>
          ) : (
            <button type="button" className="button primary" onClick={complete}>
              {copy.start} <ArrowRight />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
