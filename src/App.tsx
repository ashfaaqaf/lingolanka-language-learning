import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { AppShell } from "./components/AppShell";
import { useApp } from "./context/AppContext";
import { speech } from "./lib/speech";
import { springUI } from "./lib/motion";
import { InstallPage } from "./pages/InstallPage";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PronunciationPage } from "./pages/PronunciationPage";
import {
  AboutPage,
  AchievementsPage,
  AlphabetPage,
  ConversationsPage,
  DashboardPage,
  GrammarPage,
  LearnPage,
  LessonPage,
  ListeningPage,
  NotFoundPage,
  PracticePage,
  PrivacyPage,
  ProgressPage,
  ReviewPage,
  SettingsPage,
  SpeakingPage,
  VocabularyPage,
  WritingPage
} from "./pages/AppPages";

function RouteSpeechStopper() {
  const location = useLocation();
  useEffect(() => {
    speech.stop();
    // html has scroll-behavior: smooth, so a plain scrollTo(0,0) animates the
    // old page upward while the new route is already entering. Jump instead.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

function ShellRoute({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const { profile } = useApp();

  return (
    <MotionConfig
      reducedMotion={profile.settings.reducedMotion ? "always" : "user"}
      transition={springUI}
    >
      <RouteSpeechStopper />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/dashboard"
          element={
            <ShellRoute>
              <DashboardPage />
            </ShellRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ShellRoute>
              <LearnPage />
            </ShellRoute>
          }
        />
        <Route
          path="/pronunciation"
          element={
            <ShellRoute>
              <PronunciationPage />
            </ShellRoute>
          }
        />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route
          path="/alphabet"
          element={
            <ShellRoute>
              <AlphabetPage />
            </ShellRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <ShellRoute>
              <WritingPage />
            </ShellRoute>
          }
        />
        <Route
          path="/listening"
          element={
            <ShellRoute>
              <ListeningPage />
            </ShellRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <ShellRoute>
              <SpeakingPage />
            </ShellRoute>
          }
        />
        <Route
          path="/vocabulary"
          element={
            <ShellRoute>
              <VocabularyPage />
            </ShellRoute>
          }
        />
        <Route
          path="/grammar"
          element={
            <ShellRoute>
              <GrammarPage />
            </ShellRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ShellRoute>
              <ConversationsPage />
            </ShellRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ShellRoute>
              <PracticePage />
            </ShellRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ShellRoute>
              <ReviewPage />
            </ShellRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ShellRoute>
              <ProgressPage />
            </ShellRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ShellRoute>
              <AchievementsPage />
            </ShellRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ShellRoute>
              <SettingsPage />
            </ShellRoute>
          }
        />
        <Route
          path="/install"
          element={
            <ShellRoute>
              <InstallPage />
            </ShellRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ShellRoute>
              <AboutPage />
            </ShellRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <ShellRoute>
              <PrivacyPage />
            </ShellRoute>
          }
        />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="*"
          element={
            <ShellRoute>
              <NotFoundPage />
            </ShellRoute>
          }
        />
      </Routes>
    </MotionConfig>
  );
}
