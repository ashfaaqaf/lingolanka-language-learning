import { z } from "zod";

export const settingsSchema = z.object({
  direction: z.enum(["english-to-sinhala", "sinhala-to-english"]),
  interfaceLanguage: z.enum(["en", "si"]),
  transliteration: z.enum(["always", "request", "never"]),
  theme: z.enum(["light", "dark", "system"]),
  textSize: z.enum(["normal", "large", "extra"]),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  soundEffects: z.boolean(),
  dailyTarget: z.number().min(5).max(60),
  speechRate: z.number().min(0.5).max(1.5),
  speechPitch: z.number().min(0.5).max(1.5),
  speechVolume: z.number().min(0).max(1),
  englishVoice: z.string(),
  sinhalaVoice: z.string()
});

export const profileSchema = z.object({
  name: z.string(),
  onboarded: z.boolean(),
  level: z.string(),
  goals: z.array(z.string()),
  settings: settingsSchema
});

export const progressSchema = z.object({
  id: z.string(),
  completedAt: z.string().datetime(),
  score: z.number().min(0).max(100),
  xp: z.number().nonnegative(),
  minutes: z.number().nonnegative(),
  skills: z.object({
    reading: z.number().nonnegative(),
    writing: z.number().nonnegative(),
    listening: z.number().nonnegative(),
    speaking: z.number().nonnegative()
  })
});

export const vocabularyStateSchema = z.object({
  id: z.string(),
  learned: z.boolean(),
  favourite: z.boolean(),
  difficult: z.boolean()
});

export const reviewSchema = z.object({
  id: z.string(),
  timesSeen: z.number().nonnegative(),
  correct: z.number().nonnegative(),
  incorrect: z.number().nonnegative(),
  confidence: z.number().min(0).max(1),
  lastReviewed: z.string(),
  nextReview: z.string(),
  intervalDays: z.number().nonnegative(),
  consecutiveCorrect: z.number().nonnegative()
});

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  profile: profileSchema,
  progress: z.array(progressSchema),
  vocabularyStates: z.array(vocabularyStateSchema),
  reviews: z.array(reviewSchema)
});

export type Backup = z.infer<typeof backupSchema>;
