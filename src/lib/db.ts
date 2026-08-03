import Dexie, { type EntityTable } from "dexie";
import type { ProgressRecord, ReviewRecord, UserProfile, VocabularyState } from "../types";
import type { Backup } from "../schemas";
import { backupSchema, profileSchema } from "../schemas";

export const defaultProfile: UserProfile = {
  name: "",
  onboarded: false,
  level: "Complete beginner",
  goals: [],
  settings: {
    direction: "english-to-sinhala",
    interfaceLanguage: "en",
    transliteration: "always",
    theme: "system",
    textSize: "normal",
    highContrast: false,
    reducedMotion: false,
    soundEffects: false,
    dailyTarget: 10,
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
    englishVoice: "",
    sinhalaVoice: ""
  }
};

class LingoDatabase extends Dexie {
  profile!: EntityTable<UserProfile & { id: string }, "id">;
  progress!: EntityTable<ProgressRecord, "id">;
  vocabularyStates!: EntityTable<VocabularyState, "id">;
  reviews!: EntityTable<ReviewRecord, "id">;

  constructor() {
    super("lingolanka");
    this.version(1).stores({
      profile: "id",
      progress: "id, completedAt",
      vocabularyStates: "id, learned, favourite, difficult",
      reviews: "id, nextReview"
    });
    this.version(2).stores({
      profile: "id",
      progress: "id, completedAt",
      vocabularyStates: "id, learned, favourite, difficult",
      reviews: "id, nextReview, confidence"
    });
  }
}

export const db = new LingoDatabase();

export async function loadProfile(): Promise<UserProfile> {
  try {
    const stored = await db.profile.get("current");
    const parsed = profileSchema.safeParse(stored);
    return parsed.success ? parsed.data : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const parsed = profileSchema.parse(profile);
  await db.profile.put({ ...parsed, id: "current" });
}

export async function exportBackup(profile: UserProfile): Promise<Backup> {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    progress: await db.progress.toArray(),
    vocabularyStates: await db.vocabularyStates.toArray(),
    reviews: await db.reviews.toArray()
  };
}

export async function importBackup(value: unknown): Promise<UserProfile> {
  const backup = backupSchema.parse(value);
  await db.transaction("rw", db.profile, db.progress, db.vocabularyStates, db.reviews, async () => {
    await Promise.all([
      db.profile.clear(),
      db.progress.clear(),
      db.vocabularyStates.clear(),
      db.reviews.clear()
    ]);
    await db.profile.put({ ...backup.profile, id: "current" });
    await db.progress.bulkPut(backup.progress);
    await db.vocabularyStates.bulkPut(backup.vocabularyStates);
    await db.reviews.bulkPut(backup.reviews);
  });
  return backup.profile;
}

export async function resetDatabase(): Promise<void> {
  await db.transaction("rw", db.profile, db.progress, db.vocabularyStates, db.reviews, async () => {
    await Promise.all([
      db.profile.clear(),
      db.progress.clear(),
      db.vocabularyStates.clear(),
      db.reviews.clear()
    ]);
  });
}
