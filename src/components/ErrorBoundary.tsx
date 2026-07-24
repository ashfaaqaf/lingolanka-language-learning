import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("LingoLanka recovered from an error", error, info);
  }
  render() {
    if (this.state.failed) {
      return (
        <main className="center-page">
          <section className="card empty-state" role="alert">
            <span className="eyebrow">Recovery mode</span>
            <h1>Something did not load correctly</h1>
            <p>Your saved learning progress has not been removed. Reload the app to try again.</p>
            <button className="button primary" onClick={() => window.location.reload()}>
              Reload LingoLanka
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
