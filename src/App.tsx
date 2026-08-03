import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "./components/AppShell";
import { speech } from "./lib/speech";
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
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function ShellRoute({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <>
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
    </>
  );
}
