export type WritingInterfaceLanguage = "en" | "si";

interface WritingTutorialCopy {
  eyebrow: string;
  title: string;
  introduction: string;
  previewLabel: string;
  previewDescription: string;
  replay: string;
  pause: string;
  resume: string;
  stepsLabel: string;
  steps: readonly [string, string, string];
  ready: string;
  shapeNote: string;
}

export const writingTutorialCopy: Record<WritingInterfaceLanguage, WritingTutorialCopy> = {
  en: {
    eyebrow: "Watch first",
    title: "How to write this letter",
    introduction: "Follow the shape once, copy it in the air, then trace it yourself.",
    previewLabel: "Animated letter shape",
    previewDescription: "The highlighted shape reveals the selected letter from start to finish.",
    replay: "Replay tutorial",
    pause: "Pause tutorial",
    resume: "Resume tutorial",
    stepsLabel: "Three beginner steps",
    steps: [
      "Watch the full shape and notice its lines, curves and small marks.",
      "Air-write the letter once with your finger while saying its sound.",
      "Trace the pale guide slowly, then hide the guide and try it again."
    ],
    ready: "Now trace the letter below",
    shapeNote: "This is a shape guide. Everyday handwriting styles can look slightly different."
  },
  si: {
    eyebrow: "මුලින් බලන්න",
    title: "මෙම අකුර ලියන ආකාරය",
    introduction: "අකුර සෑදෙන ආකාරය වරක් බලන්න. පසුව අහසේ ලියා, ඊළඟට ඔබම ලියන්න.",
    previewLabel: "චලනය වන අකුරු හැඩය",
    previewDescription: "තෝරාගත් අකුරේ සම්පූර්ණ හැඩය පැහැදිලිව පෙන්වයි.",
    replay: "නැවත පෙන්වන්න",
    pause: "නවත්වන්න",
    resume: "ඉදිරියට පෙන්වන්න",
    stepsLabel: "ආරම්භක පියවර තුන",
    steps: [
      "මුළු අකුරම බලා එහි රේඛා, වක්‍ර සහ කුඩා ලකුණු හඳුනාගන්න.",
      "අකුරේ ශබ්දය කියමින් ඔබේ ඇඟිල්ලෙන් අහසේ වරක් ලියන්න.",
      "මඳ පැහැති අකුර මත සෙමින් ලියා, පසුව මාර්ගෝපදේශය සඟවා නැවත උත්සාහ කරන්න."
    ],
    ready: "දැන් පහත අකුර ලියන්න",
    shapeNote: "මෙය අකුරේ හැඩය ඉගෙනගැනීමට මාර්ගෝපදේශයකි. සාමාන්‍ය අත්අකුරු ටිකක් වෙනස් විය හැක."
  }
};

interface WritingToolCopy {
  practiceLabel: string;
  undo: string;
  redo: string;
  clear: string;
  hideGuide: string;
  showGuide: string;
  stroke: string;
  canvas: string;
  initialMessage: string;
  goodCoverage: (coverage: number) => string;
  lowCoverage: (coverage: number) => string;
  selfCheck: string;
}

export const writingToolCopy: Record<WritingInterfaceLanguage, WritingToolCopy> = {
  en: {
    practiceLabel: "Writing practice for",
    undo: "Undo stroke",
    redo: "Redo stroke",
    clear: "Clear drawing",
    hideGuide: "Hide guide",
    showGuide: "Show guide",
    stroke: "Stroke",
    canvas: "Drawing canvas",
    initialMessage: "Trace the character, then use self-check.",
    goodCoverage: (coverage) =>
      `Good tracing coverage: about ${coverage}%. This is guidance, not handwriting recognition.`,
    lowCoverage: (coverage) => `Coverage is about ${coverage}%. Try a slower, fuller trace.`,
    selfCheck: "Self-check"
  },
  si: {
    practiceLabel: "අකුර ලිවීමේ පුහුණුව:",
    undo: "අවසන් රේඛාව ඉවත් කරන්න",
    redo: "ඉවත් කළ රේඛාව නැවත දමන්න",
    clear: "ඇඳීම මකන්න",
    hideGuide: "මාර්ගෝපදේශය සඟවන්න",
    showGuide: "මාර්ගෝපදේශය පෙන්වන්න",
    stroke: "රේඛාවේ පළල",
    canvas: "අකුර ලියන ප්‍රදේශය",
    initialMessage: "අකුර මත ලියා, පසුව ඔබම පරීක්ෂා කරන්න.",
    goodCoverage: (coverage) =>
      `හොඳින් ලියා ඇත: ආවරණය ${coverage}% පමණයි. මෙය මාර්ගෝපදේශයක් මිස අත්අකුරු හඳුනාගැනීමක් නොවේ.`,
    lowCoverage: (coverage) => `ආවරණය ${coverage}% පමණයි. තවත් සෙමින් මුළු අකුරම ලියන්න.`,
    selfCheck: "ඔබම පරීක්ෂා කරන්න"
  }
};
