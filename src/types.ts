export type LearningDirection = "english-to-sinhala" | "sinhala-to-english";
export type Difficulty = "foundation" | "beginner" | "elementary" | "intermediate";
export type ExerciseType =
  | "multiple-choice"
  | "audio-choice"
  | "matching"
  | "word-order"
  | "translation-input"
  | "dictation"
  | "listen-repeat"
  | "speaking"
  | "letter-tracing"
  | "fill-blank"
  | "reading-comprehension"
  | "flashcard"
  | "true-false"
  | "spelling";

export interface VocabularyItem {
  id: string;
  english: string;
  sinhala: string;
  transliteration?: string;
  category: string;
  partOfSpeech?: string;
  difficulty: Difficulty;
  examples: Array<{ english: string; sinhala: string; transliteration?: string }>;
  tags: string[];
  audioText: { english: string; sinhala: string };
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  instructions: string;
  correctAnswer: string | string[];
  acceptedAlternatives: string[];
  distractors: string[];
  hint: string;
  explanation: string;
  audioText?: string;
  difficulty: Difficulty;
  xp: number;
  sourceLanguage: "en" | "si";
  targetLanguage: "en" | "si";
}

export interface Lesson {
  id: string;
  title: string;
  titleSi: string;
  description: string;
  minutes: number;
  vocabularyIds: string[];
  exercises: Exercise[];
  outcomes: string[];
}

export interface Module {
  id: string;
  title: string;
  titleSi: string;
  overview: string;
  level: number;
  lessons: Lesson[];
  rewardXp: number;
}

export interface Course {
  id: LearningDirection;
  title: string;
  knownLanguage: "en" | "si";
  targetLanguage: "en" | "si";
  levels: Array<{ id: number; name: string; modules: Module[] }>;
}

export interface AlphabetEntry {
  id: string;
  character: string;
  secondary?: string;
  name: string;
  category: string;
  transliteration: string;
  sound: string;
  explanation: string;
  example: string;
  meaning: string;
  language: "en" | "si";
}

export interface ConversationLine {
  speaker: string;
  english: string;
  sinhala: string;
  transliteration: string;
}

export interface Conversation {
  id: string;
  title: string;
  titleSi: string;
  context: string;
  objective: string;
  lines: ConversationLine[];
  question: string;
  answer: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  titleSi: string;
  explanationEn: string;
  explanationSi: string;
  examples: Array<{ english: string; sinhala: string; breakdown: string }>;
}

export interface UserSettings {
  direction: LearningDirection;
  interfaceLanguage: "en" | "si";
  transliteration: "always" | "request" | "never";
  theme: "light" | "dark" | "system";
  textSize: "normal" | "large" | "extra";
  highContrast: boolean;
  reducedMotion: boolean;
  soundEffects: boolean;
  dailyTarget: number;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  englishVoice: string;
  sinhalaVoice: string;
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
  level: string;
  goals: string[];
  settings: UserSettings;
}

export interface ProgressRecord {
  id: string;
  completedAt: string;
  score: number;
  xp: number;
  minutes: number;
  skills: { reading: number; writing: number; listening: number; speaking: number };
}

export interface VocabularyState {
  id: string;
  learned: boolean;
  favourite: boolean;
  difficult: boolean;
}

export interface ReviewRecord {
  id: string;
  timesSeen: number;
  correct: number;
  incorrect: number;
  confidence: number;
  lastReviewed: string;
  nextReview: string;
  intervalDays: number;
  consecutiveCorrect: number;
}
