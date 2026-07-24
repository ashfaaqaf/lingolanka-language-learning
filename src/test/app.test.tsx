import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";
import { AppProvider } from "../context/AppContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { WritingCanvas } from "../components/WritingCanvas";
import { db, defaultProfile, resetDatabase, saveProfile } from "../lib/db";

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
      expect(navigation).toHaveTextContent("වචන මාලාව");
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
    expect(screen.getByRole("link", { name: /Vocabulary/ })).toHaveAttribute(
      "href",
      "#/vocabulary"
    );
  });

  it("shows complete Android and iPhone home-screen installation instructions", () => {
    renderApp("/install");
    expect(screen.getByRole("heading", { name: /Install with Chrome/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Install with Safari/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Add to Home Screen/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Copy link/i })).toBeEnabled();
  });

  it("uses phone-first primary destinations in mobile navigation", () => {
    renderApp("/dashboard");
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(mobileNavigation).toHaveTextContent("Home");
    expect(mobileNavigation).toHaveTextContent("Practice");
    expect(mobileNavigation).toHaveTextContent("Review");
    expect(mobileNavigation).toHaveTextContent("Settings");
    expect(mobileNavigation).not.toHaveTextContent("Writing");
  });

  it("keeps unsupported voice paths usable", () => {
    renderApp("/speaking");
    expect(screen.getByText(/local recording comparison is available/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record locally/ })).toBeEnabled();
  });

  it("exposes writing undo, redo, clear and self-check controls", () => {
    render(<WritingCanvas />);
    expect(screen.getByRole("button", { name: "Undo stroke" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo stroke" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear drawing" })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Self-check/ })).toBeEnabled();
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
