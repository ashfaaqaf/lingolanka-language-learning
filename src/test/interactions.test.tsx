import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppProvider } from "../context/AppContext";
import { AudioButton } from "../components/AudioButton";
import { ExerciseCard } from "../components/ExerciseCard";
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
  beforeEach(() => {
    speech.stop(false);
    vi.clearAllMocks();
  });

  it("makes pronunciation playback controls visibly functional", async () => {
    const user = userEvent.setup();
    renderWithApp(<AudioButton text="Hello" language="en" />);

    const play = screen.getByRole("button", { name: "Play: Hello" });
    const pause = screen.getByRole("button", { name: "Pause speech" });
    const stop = screen.getByRole("button", { name: "Stop speech" });

    expect(pause).toBeDisabled();
    expect(stop).toBeDisabled();

    await user.click(play);
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce();
    expect(screen.getByText("Playing pronunciation")).toBeInTheDocument();
    expect(pause).toBeEnabled();
    expect(stop).toBeEnabled();

    await user.click(pause);
    expect(window.speechSynthesis.pause).toHaveBeenCalledOnce();
    expect(screen.getByText("Playback paused")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Resume speech" }));
    expect(window.speechSynthesis.resume).toHaveBeenCalledOnce();
    expect(screen.getByText("Playback resumed")).toBeInTheDocument();

    await user.click(stop);
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(screen.getByText("Playback stopped")).toBeInTheDocument();
    expect(stop).toBeDisabled();
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

    await user.click(screen.getByRole("button", { name: /Retry/i }));
    await user.click(correct!);
    await user.click(screen.getByRole("button", { name: /Check answer/i }));

    expect(correct).toHaveClass("answer-correct");
    expect(screen.getByRole("status")).toHaveTextContent("Correct — well done!");
  });
});
