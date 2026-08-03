import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppProvider } from "../context/AppContext";
import { AudioButton } from "../components/AudioButton";
import { ExerciseCard } from "../components/ExerciseCard";
import { courses } from "../data/content";
import { db, defaultProfile, saveProfile } from "../lib/db";
import { speech } from "../lib/speech";
import type { Exercise } from "../types";

function renderWithApp(element: React.ReactNode) {
  return render(<AppProvider>{element}</AppProvider>);
}

const choiceExercise: Exercise = {
  id: "interaction-feedback",
  type: "multiple-choice",
  prompt: "Choose the correct greeting.",
  instructions: "Select an answer, then check it.",
  correctAnswer: "Hello",
  acceptedAlternatives: [],
  distractors: ["Goodbye"],
  hint: "Think about meeting someone.",
  explanation: "Hello is used when greeting someone.",
  difficulty: "foundation",
  xp: 10,
  sourceLanguage: "en",
  targetLanguage: "en"
};

describe("lesson interactions", () => {
  beforeEach(async () => {
    speech.stop(false);
    vi.clearAllMocks();
    await db.profile.clear();
  });

  it("teaches a new word before asking a complete beginner to answer", () => {
    const firstExercise = courses[0]!.levels[0]!.modules[0]!.lessons[0]!.exercises[0]!;
    renderWithApp(<ExerciseCard exercise={firstExercise} guided />);

    expect(
      screen.getByRole("region", { name: "Meet the word before you answer" })
    ).toBeInTheDocument();
    expect(screen.getByText("Word you already know")).toBeInTheDocument();
    expect(screen.getByText("Word you are learning")).toBeInTheDocument();
    expect(screen.getByText("Say “āyubōvan” out loud.")).toBeInTheDocument();
    expect(screen.getByText("What to do now")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ආයුබෝවන්, āyubōvan" })
    ).toBeInTheDocument();
  });

  it("uses Sinhala guidance and controls when Sinhala is the interface language", async () => {
    await saveProfile({
      ...defaultProfile,
      onboarded: true,
      settings: {
        ...defaultProfile.settings,
        direction: "sinhala-to-english",
        interfaceLanguage: "si"
      }
    });
    const firstExercise = courses[1]!.levels[0]!.modules[0]!.lessons[0]!.exercises[0]!;
    renderWithApp(<ExerciseCard exercise={firstExercise} guided />);

    expect(await screen.findByText("පළමුව මෙය ඉගෙන ගන්න")).toBeInTheDocument();
    expect(screen.getByText("දැන් කළ යුතු දේ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "පිළිතුර පරීක්ෂා කරන්න" })).toBeDisabled();
  });

  it("plays packaged pronunciation audio with working controls", async () => {
    const user = userEvent.setup();
    renderWithApp(<AudioButton text="Hello" language="en" />);

    const play = screen.getByRole("button", { name: "Play: Hello" });
    const pause = screen.getByRole("button", { name: "Pause speech" });
    const stop = screen.getByRole("button", { name: "Stop speech" });

    expect(pause).toBeDisabled();
    expect(stop).toBeDisabled();

    await user.click(play);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    expect(screen.getByText("Playing pronunciation")).toBeInTheDocument();
    expect(pause).toBeEnabled();
    expect(stop).toBeEnabled();

    await user.click(pause);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
    expect(screen.getByText("Playback paused")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Resume speech" }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Playback resumed")).toBeInTheDocument();

    await user.click(stop);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Playback stopped")).toBeInTheDocument();
    expect(stop).toBeDisabled();
  });

  it("falls back to the device voice for text outside the audio pack", async () => {
    const user = userEvent.setup();
    renderWithApp(<AudioButton text="A phrase outside the pronunciation pack" language="en" />);

    await user.click(
      screen.getByRole("button", { name: "Play: A phrase outside the pronunciation pack" })
    );

    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce();
  });

  it("marks the correct option green and a selected wrong option red", async () => {
    const user = userEvent.setup();
    renderWithApp(<ExerciseCard exercise={choiceExercise} />);

    const wrong = screen.getByText("Goodbye").closest("button");
    const correct = screen.getByText("Hello").closest("button");
    expect(wrong).not.toBeNull();
    expect(correct).not.toBeNull();

    await user.click(wrong!);
    await user.click(screen.getByRole("button", { name: /Check answer/i }));

    expect(wrong).toHaveClass("answer-incorrect");
    expect(wrong).toHaveTextContent("Your answer was incorrect");
    expect(correct).toHaveClass("answer-correct");
    expect(correct).toHaveTextContent("Correct answer");
    expect(screen.getByRole("status")).toHaveTextContent("Not yet");

    await user.click(screen.getByRole("button", { name: /Try again/i }));
    await user.click(correct!);
    await user.click(screen.getByRole("button", { name: /Check answer/i }));

    expect(correct).toHaveClass("answer-correct");
    expect(screen.getByRole("status")).toHaveTextContent("Correct — well done!");
  });
});
