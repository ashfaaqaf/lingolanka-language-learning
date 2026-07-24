import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";
import { AppProvider } from "../context/AppContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { WritingCanvas } from "../components/WritingCanvas";

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

  it("navigates into onboarding and switches known language", async () => {
    const user = userEvent.setup();
    renderApp("/onboarding");
    await user.click(screen.getByRole("button", { name: /සිංහල/ }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByText("සිංහල → English")).toBeInTheDocument();
  });

  it("renders every primary navigation destination", () => {
    renderApp("/dashboard");
    expect(screen.getByRole("complementary", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Vocabulary/ })).toHaveAttribute(
      "href",
      "#/vocabulary"
    );
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
