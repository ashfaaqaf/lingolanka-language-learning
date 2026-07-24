import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "@fontsource-variable/manrope";
import "@fontsource/noto-sans-sinhala/400.css";
import "@fontsource/noto-sans-sinhala/500.css";
import "@fontsource/noto-sans-sinhala/600.css";
import "@fontsource/noto-sans-sinhala/700.css";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

const updateServiceWorker = registerSW({
  onNeedRefresh() {
    if (window.confirm("A new LingoLanka version is ready. Update now?")) {
      void updateServiceWorker(true);
    }
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("lingolanka-offline-ready"));
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>
);
