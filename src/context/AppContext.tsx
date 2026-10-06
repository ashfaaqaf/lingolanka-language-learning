import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db, defaultProfile, loadProfile, saveProfile } from "../lib/db";
import type { ProgressRecord, UserProfile, VocabularyState } from "../types";

interface AppContextValue {
  profile: UserProfile;
  progress: ProgressRecord[];
  vocabularyStates: VocabularyState[];
  ready: boolean;
  updateProfile: (profile: UserProfile) => Promise<void>;
  completeLesson: (record: ProgressRecord) => Promise<void>;
  updateVocabularyState: (state: VocabularyState) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [vocabularyStates, setVocabularyStates] = useState<VocabularyState[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    const [nextProfile, nextProgress, nextStates] = await Promise.all([
      loadProfile(),
      db.progress.toArray().catch(() => []),
      db.vocabularyStates.toArray().catch(() => [])
    ]);
    setProfile(nextProfile);
    setProgress(nextProgress);
    setVocabularyStates(nextStates);
    setReady(true);
  };

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = profile.settings.theme;
    root.dataset.textSize = profile.settings.textSize;
    root.classList.toggle("high-contrast", profile.settings.highContrast);
    root.classList.toggle("reduced-motion", profile.settings.reducedMotion);
  }, [profile.settings]);

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      progress,
      vocabularyStates,
      ready,
      refresh,
      updateProfile: async (next) => {
        await saveProfile(next);
        setProfile(next);
      },
      completeLesson: async (record) => {
        await db.progress.put(record);
        setProgress((current) => [...current.filter((item) => item.id !== record.id), record]);
      },
      updateVocabularyState: async (state) => {
        await db.vocabularyStates.put(state);
        setVocabularyStates((current) => [
          ...current.filter((item) => item.id !== state.id),
          state
        ]);
      }
    }),
    [profile, progress, vocabularyStates, ready]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
