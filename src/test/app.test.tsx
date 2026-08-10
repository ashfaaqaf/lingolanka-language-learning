import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { AppProvider } from "../context/AppContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { WritingCanvas } from "../components/WritingCanvas";
import { db, defaultProfile, loadProfile, resetDatabase, saveProfile } from "../lib/db";

function renderApp(path = "/") {
  window.location.hash = `#${path}`;
  return render(
    <AppProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppProvider>
  );
}

describe("critical application journeys", () => {
  it("starts on a bilingual public landing page", () => {
    renderApp();
    expect(
      screen.getByRole("heading", { name: /Learn Sinhala. Learn English/i })
    ).toBeInTheDocument();
    expect(screen.getByText("ආයුබෝවන්")).toBeInTheDocument();
  });

  it("switches every onboarding decision and app navigation into Sinhala", async () => {
    const user = userEvent.setup();
    renderApp("/onboarding");
    try {
      await user.click(screen.getByRole("button", { name: /සිංහල/ }));

      expect(
        screen.getByRole("heading", { name: "ඔබට හොඳින් තේරෙන භාෂාව කුමක්ද?" })
      ).toBeInTheDocument();
      expect(screen.getByText("පියවර 6 න් 1")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /ආපසු/ })).toBeDisabled();

      await user.click(screen.getByRole("button", { name: /ඉදිරියට/ }));
      expect(screen.getByText("සිංහල → ඉංග්‍රීසි")).toBeInTheDocument();
      expect(screen.getByText(/ප්‍රගතිය අහිමි නොකර/)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /ඉදිරියට/ }));
      expect(
        screen.getByRole("heading", { name: "ඔබේ වත්මන් ඉංග්‍රීසි දැනුම කෙබඳුද?" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /සම්පූර්ණ ආරම්භකයෙක්/ })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Complete beginner" })).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /මධ්‍යම මට්ටම/ }));

      await user.click(screen.getByRole("button", { name: /ඉදිරියට/ }));
      expect(screen.getByRole("button", { name: "දෛනික සංවාද" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "කියවීම" }));

      await user.click(screen.getByRole("button", { name: /ඉදිරියට/ }));
      expect(screen.getAllByText("මිනිත්තු")).toHaveLength(4);
      await user.click(screen.getByRole("button", { name: /15\s*මිනිත්තු/ }));

      await user.click(screen.getByRole("button", { name: /ඉදිරියට/ }));
      expect(
        screen.getByRole("heading", { name: "ඔබ ඉගෙනීම ආරම්භ කිරීමට සූදානම්" })
      ).toBeInTheDocument();
      expect(screen.getByText("මධ්‍යම මට්ටම")).toBeInTheDocument();
      expect(screen.getByText("දිනකට මිනිත්තු 15 · ඉගෙනුම් ඉලක්ක 1")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /දැන් ඉගෙනීම අරඹන්න/ }));
      const navigation = await screen.findByRole("complementary", { name: "ප්‍රධාන මෙනුව" });
      expect(navigation).toHaveTextContent("වචන පොත");
      expect(navigation).not.toHaveTextContent("Vocabulary");
    } finally {
      await resetDatabase();
    }
  });

  it("restores saved phone progress instead of restarting onboarding", async () => {
    await resetDatabase();
    await saveProfile({
      ...defaultProfile,
      onboarded: true,
      level: "Complete beginner",
      goals: ["Daily conversation"],
      settings: {
        ...defaultProfile.settings,
        direction: "sinhala-to-english",
        interfaceLanguage: "si"
      }
    });
    await db.progress.put({
      id: "saved-phone-lesson",
      completedAt: new Date().toISOString(),
      score: 90,
      xp: 60,
      minutes: 6,
      skills: { reading: 20, writing: 10, listening: 20, speaking: 10 }
    });

    try {
      renderApp("/");
      await screen.findByRole("complementary", { name: "ප්‍රධාන මෙනුව" });
      expect(window.location.hash).toBe("#/dashboard");
      expect(
        await screen.findByText(/1 lessons completed for 6 total minutes/)
      ).toBeInTheDocument();
    } finally {
      await resetDatabase();
    }
  });

  it("renders every primary navigation destination", () => {
    renderApp("/dashboard");
    expect(screen.getByRole("complementary", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Learning path" })[0]).toHaveAttribute(
      "href",
      "#/learn"
    );
    expect(screen.getAllByRole("link", { name: "Wordbook" })[0]).toHaveAttribute(
      "href",
      "#/vocabulary"
    );
    expect(screen.getByRole("heading", { name: "Three small steps" })).toBeInTheDocument();
  });

  it("offers a genuine first lesson when the current course has no progress", async () => {
    await resetDatabase();
    try {
      renderApp("/dashboard");
      expect(await screen.findByText("Start learning · Foundations")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Start first lesson/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /Continue lesson/i })).not.toBeInTheDocument();
    } finally {
      await resetDatabase();
    }
  });

  it("only says continue after a lesson in the current course has been completed", async () => {
    await resetDatabase();
    await saveProfile({ ...defaultProfile, onboarded: true });
    await db.progress.put({
      id: "english-to-sinhala-lesson-1",
      completedAt: new Date().toISOString(),
      score: 90,
      xp: 20,
      minutes: 8,
      skills: { reading: 5, writing: 5, listening: 5, speaking: 5 }
    });
    try {
      renderApp("/dashboard");
      expect(await screen.findByText("Continue learning · Foundations")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Continue lesson/i })).toBeInTheDocument();
    } finally {
      await resetDatabase();
    }
  });

  it("places pronunciation practice before the regular lessons", async () => {
    const user = userEvent.setup();
    renderApp("/learn");

    await user.click(screen.getByRole("link", { name: /Start with sounds/i }));

    expect(
      await screen.findByRole("heading", { name: /Hear Sinhala before you study it/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Say it like/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Start Lesson 1/i })).toBeEnabled();
  });

  it("opens genuinely different practice categories", async () => {
    const user = userEvent.setup();
    renderApp("/practice");

    await user.click(screen.getByRole("button", { name: /Daily challenge/i }));
    expect(await screen.findByText(/Listen and choose the Sinhala word/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Practice hub/i }));
    await user.click(screen.getByRole("button", { name: /Vocabulary matching/i }));
    expect(await screen.findByText(/Match the meaning/i)).toBeInTheDocument();
    expect(screen.queryByText(/Listen and choose the Sinhala word/i)).not.toBeInTheDocument();
  });

  it("shows complete Android and iPhone home-screen installation instructions", () => {
    renderApp("/install");
    expect(screen.getByRole("heading", { name: /Install with Chrome/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Install with Safari/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Add to Home Screen/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Copy link/i })).toBeEnabled();
  });

  it("downloads a real progress backup from settings", async () => {
    const user = userEvent.setup();
    let downloadedName = "";
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      downloadedName = this.download;
    });

    try {
      renderApp("/settings");
      await user.click(screen.getByRole("button", { name: /Export progress/i }));

      expect(await screen.findByText(/Progress exported/i)).toBeInTheDocument();
      expect(downloadedName).toMatch(/^lingolanka-backup-\d{4}-\d{2}-\d{2}\.json$/);
      expect(URL.createObjectURL).toHaveBeenCalledOnce();
    } finally {
      click.mockRestore();
    }
  });

  it("imports a validated progress backup from the native file picker", async () => {
    const user = userEvent.setup();
    await resetDatabase();
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: { ...defaultProfile, name: "Imported learner", onboarded: true },
      progress: [],
      vocabularyStates: [],
      reviews: []
    };

    try {
      renderApp("/settings");
      const file = new File([JSON.stringify(backup)], "lingolanka-backup.json", {
        type: "application/json"
      });
      await user.upload(screen.getByLabelText("Choose LingoLanka backup file"), file);

      expect(await screen.findByText("Progress imported successfully.")).toBeInTheDocument();
      expect((await loadProfile()).name).toBe("Imported learner");
    } finally {
      await resetDatabase();
    }
  });

  it("resets progress after explicit confirmation", async () => {
    const user = userEvent.setup();
    await resetDatabase();
    await saveProfile({ ...defaultProfile, name: "Reset learner", onboarded: true });
    await db.progress.put({
      id: "reset-me",
      completedAt: new Date().toISOString(),
      score: 80,
      xp: 20,
      minutes: 5,
      skills: { reading: 5, writing: 5, listening: 5, speaking: 5 }
    });

    try {
      renderApp("/settings");
      await user.click(screen.getByRole("button", { name: /Reset all progress/i }));
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Reset permanently" }));

      expect(
        await screen.findByRole("heading", { name: "Which language do you understand best?" })
      ).toBeInTheDocument();
      expect(window.location.hash).toBe("#/onboarding");
      expect(await db.progress.count()).toBe(0);
      expect((await loadProfile()).name).toBe("");
    } finally {
      await resetDatabase();
    }
  });

  it("uses phone-first primary destinations in mobile navigation", () => {
    renderApp("/dashboard");
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(mobileNavigation).toHaveTextContent("Today");
    expect(mobileNavigation).toHaveTextContent("Learning path");
    expect(mobileNavigation).toHaveTextContent("Practice");
    expect(mobileNavigation).toHaveTextContent("Wordbook");
    expect(mobileNavigation).toHaveTextContent("Progress");
    expect(mobileNavigation).not.toHaveTextContent("Settings");
    expect(mobileNavigation).not.toHaveTextContent("Writing");
  });

  it("keeps unsupported voice paths usable", () => {
    renderApp("/speaking");
    expect(screen.getByText(/local recording comparison is available/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record locally/ })).toBeEnabled();
  });

  it("exposes writing undo, redo, clear and self-check controls", () => {
    render(<WritingCanvas />);
    expect(screen.getByRole("heading", { name: "How to write this letter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Replay tutorial/ })).toBeEnabled();
    expect(screen.getByText("Three beginner steps")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo stroke" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo stroke" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear drawing" })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Compare with letter/ })).toBeDisabled();
  });

  it("shows the full writing tutorial and controls in Sinhala when selected", () => {
    render(<WritingCanvas character="A" characterLanguage="en" interfaceLanguage="si" />);
    expect(screen.getByRole("heading", { name: "මෙම අකුර ලියන ආකාරය" })).toBeInTheDocument();
    expect(screen.getByText("ආරම්භක පියවර තුන")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "නැවත පෙන්වන්න" })).toBeEnabled();
    expect(screen.getByLabelText("අකුර ලියන ප්‍රදේශය")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /පරීක්ෂා කරන්න/ })).toBeDisabled();
  });

  it("records a pointer stroke without crashing", () => {
    render(<WritingCanvas />);
    const canvas = screen.getByLabelText("Drawing canvas");
    Object.defineProperty(canvas, "setPointerCapture", { value: () => undefined });
    fireEvent.pointerDown(canvas, { pointerId: 1, clientX: 40, clientY: 40 });
    fireEvent.pointerUp(canvas, { pointerId: 1, clientX: 40, clientY: 40 });
    expect(screen.getByRole("button", { name: "Undo stroke" })).toBeEnabled();
  });

  it("recovers from a rendering error", () => {
    const Broken = () => {
      throw new Error("test");
    };
    const original = console.error;
    console.error = () => undefined;
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Something did not load correctly");
    console.error = original;
  });
});
