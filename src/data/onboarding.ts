export type InterfaceLanguage = "en" | "si";

export const onboardingLevels = [
  {
    value: "Complete beginner",
    label: { en: "Complete beginner", si: "සම්පූර්ණ ආරම්භකයෙක්" }
  },
  {
    value: "I know a few words",
    label: { en: "I know a few words", si: "මම වචන කිහිපයක් දන්නවා" }
  },
  {
    value: "Basic",
    label: { en: "Basic", si: "මූලික දැනුමක් තිබේ" }
  },
  {
    value: "Intermediate",
    label: { en: "Intermediate", si: "මධ්‍යම මට්ටම" }
  }
] as const;

export const onboardingGoals = [
  {
    value: "Everyday conversation",
    label: { en: "Everyday conversation", si: "දෛනික සංවාද" }
  },
  { value: "Reading", label: { en: "Reading", si: "කියවීම" } },
  { value: "Writing", label: { en: "Writing", si: "ලිවීම" } },
  { value: "Pronunciation", label: { en: "Pronunciation", si: "උච්චාරණය" } },
  { value: "School", label: { en: "School", si: "පාසල" } },
  { value: "Work", label: { en: "Work", si: "රැකියාව" } },
  { value: "Travel", label: { en: "Travel", si: "සංචාර" } },
  {
    value: "Friends and family",
    label: { en: "Friends and family", si: "මිතුරන් සහ පවුල" }
  },
  {
    value: "Complete mastery",
    label: { en: "Complete mastery", si: "සම්පූර්ණ ප්‍රවීණත්වය" }
  }
] as const;

export const onboardingCopy = {
  en: {
    stepOf: (step: number) => `Step ${step} of 6`,
    beginEyebrow: "Let's begin",
    languageQuestion: "Which language do you understand best?",
    languageHelp: "We’ll use this language for every instruction and explanation.",
    english: "English",
    englishChoice: "I understand English · I want to learn Sinhala",
    sinhala: "සිංහල",
    sinhalaChoice: "I understand Sinhala · I want to learn English",
    courseEyebrow: "Your course",
    courseTitle: "You’ll learn Sinhala",
    courseDirection: "English → Sinhala",
    courseHelp: "English guidance with Sinhala practice.",
    directionNote: "You can change direction later without losing progress.",
    levelEyebrow: "Starting point",
    levelQuestion: "What is your current Sinhala level?",
    goalsEyebrow: "Make it yours",
    goalsQuestion: "What would you like to achieve in Sinhala?",
    goalsHelp: "Choose every goal that matters to you.",
    targetEyebrow: "A gentle rhythm",
    targetQuestion: "Choose your daily target",
    minutes: "minutes",
    targetHelp: "No harsh penalties if you miss a day. Small steps still count.",
    readyEyebrow: "Optional placement",
    readyTitle: "You’re ready to learn",
    readyHelp:
      "Start from Foundations now. You can explore advanced modules at any time, so there is no need to prove what you know.",
    summary: (minutes: number, goals: number) =>
      `${minutes} minutes a day · ${goals} learning goal${goals === 1 ? "" : "s"}`,
    back: "Back",
    continue: "Continue",
    start: "Start learning now"
  },
  si: {
    stepOf: (step: number) => `පියවර 6 න් ${step}`,
    beginEyebrow: "අපි පටන් ගනිමු",
    languageQuestion: "ඔබට හොඳින් තේරෙන භාෂාව කුමක්ද?",
    languageHelp: "සෑම උපදෙසක්ම සහ පැහැදිලි කිරීමක්ම මේ භාෂාවෙන් පෙන්වන්නෙමු.",
    english: "ඉංග්‍රීසි",
    englishChoice: "මට ඉංග්‍රීසි තේරෙනවා · මට සිංහල ඉගෙන ගන්න ඕනෑ",
    sinhala: "සිංහල",
    sinhalaChoice: "මට සිංහල තේරෙනවා · මට ඉංග්‍රීසි ඉගෙන ගන්න ඕනෑ",
    courseEyebrow: "ඔබේ පාඨමාලාව",
    courseTitle: "ඔබ ඉංග්‍රීසි ඉගෙන ගන්නවා",
    courseDirection: "සිංහල → ඉංග්‍රීසි",
    courseHelp: "සිංහලෙන් පැහැදිලි උපදෙස් සමඟ ඉංග්‍රීසි පුහුණුව.",
    directionNote: "ප්‍රගතිය අහිමි නොකර පසුව භාෂා දිශාව වෙනස් කළ හැක.",
    levelEyebrow: "ආරම්භක මට්ටම",
    levelQuestion: "ඔබේ වත්මන් ඉංග්‍රීසි දැනුම කෙබඳුද?",
    goalsEyebrow: "ඔබට ගැළපෙන ලෙස",
    goalsQuestion: "ඔබට ඉංග්‍රීසි භාෂාවෙන් ලබාගැනීමට අවශ්‍ය දේ මොනවාද?",
    goalsHelp: "ඔබට වැදගත් සියලු ඉලක්ක තෝරන්න.",
    targetEyebrow: "දිනපතා පුහුණුව",
    targetQuestion: "ඔබේ දෛනික ඉලක්කය තෝරන්න",
    minutes: "මිනිත්තු",
    targetHelp: "දවසක් මඟහැරුණත් දඬුවමක් නැහැ. කුඩා පියවරත් වැදගත්.",
    readyEyebrow: "විකල්ප මට්ටම් පරීක්ෂණය",
    readyTitle: "ඔබ ඉගෙනීම ආරම්භ කිරීමට සූදානම්",
    readyHelp:
      "දැන් මූලික පාඩම්වලින් ආරම්භ කරන්න. ඔබට ඕනෑම වෙලාවක උසස් පාඩම් බලන්න පුළුවන්. දැනට දන්නා දේ ඔප්පු කිරීමට අවශ්‍ය නැහැ.",
    summary: (minutes: number, goals: number) =>
      `දිනකට මිනිත්තු ${minutes} · ඉගෙනුම් ඉලක්ක ${goals}`,
    back: "ආපසු",
    continue: "ඉදිරියට",
    start: "දැන් ඉගෙනීම අරඹන්න"
  }
};
