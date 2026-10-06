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
  slow: string;
  normal: string;
  strokeOrder: (count: number) => string;
  stepsLabel: string;
  steps: readonly [string, string, string];
  ready: string;
  shapeNote: string;
}

export const writingTutorialCopy: Record<WritingInterfaceLanguage, WritingTutorialCopy> = {
  en: {
    eyebrow: "Watch first",
    title: "How to write this letter",
    introduction:
      "Watch each themed stroke draw in order. The numbered start point and arrow show exactly where your hand moves.",
    previewLabel: "Selected practice letter",
    previewDescription: "An animated path draws the selected letter one stroke at a time.",
    replay: "Replay tutorial",
    pause: "Pause tutorial",
    resume: "Resume tutorial",
    slow: "Slow speed",
    normal: "Normal speed",
    strokeOrder: (count) => `${count} numbered stroke${count === 1 ? "" : "s"}`,
    stepsLabel: "Three beginner steps",
    steps: [
      "Start at circle 1 and follow its glowing line to the arrow. Continue with 2, 3 and the remaining strokes.",
      "Lift your finger or pencil between numbered strokes. Use Slow when a curve is difficult to follow.",
      "Replay the animation, then trace the pale guide below using the same starts and directions."
    ],
    ready: "Now trace the letter below",
    shapeNote:
      "The animation follows the selected letter itself—never a separate decorative pen motion. Sinhala formations are adapted from the Foreign Service Institute construction guidance; Latin letters use standard block-letter formation."
  },
  si: {
    eyebrow: "මුලින් බලන්න",
    title: "මෙම අකුර ලියන ආකාරය",
    introduction:
      "එක් එක් රේඛාව පිළිවෙළින් ඇඳෙන ආකාරය බලන්න. අංකය පටන් ගන්නා තැනත් ඊතලය අත ගෙන යන දිශාවත් පෙන්වයි.",
    previewLabel: "තෝරාගත් පුහුණු අකුර",
    previewDescription: "තෝරාගත් අකුර රේඛාවෙන් රේඛාවට චලනය කර පෙන්වයි.",
    replay: "නැවත පෙන්වන්න",
    pause: "නවත්වන්න",
    resume: "ඉදිරියට පෙන්වන්න",
    slow: "සෙමින්",
    normal: "සාමාන්‍ය වේගය",
    strokeOrder: (count) => `අංක කළ රේඛා ${count}`,
    stepsLabel: "ආරම්භක පියවර තුන",
    steps: [
      "අංක 1 වටයෙන් පටන් ගෙන දිලිසෙන රේඛාව ඊතලය දක්වා අනුගමනය කරන්න. ඉන්පසු 2, 3 සහ ඉතිරි රේඛා කරන්න.",
      "අංක දෙකක් අතර අත හෝ පෑන ඔසවන්න. වක්‍රය අපහසු නම් ‘සෙමින්’ බොත්තම භාවිතා කරන්න.",
      "චලනය නැවත බලා, පහත මඳ පැහැති අකුර මත එම ආරම්භ සහ දිශා අනුව ලියන්න."
    ],
    ready: "දැන් පහත අකුර ලියන්න",
    shapeNote:
      "චලනය තෝරාගත් අකුරේම මාර්ගය අනුගමනය කරයි; වෙනම අලංකාර පෑනක් ගමන් නොකරයි. සිංහල හැඩ Foreign Service Institute ලිවීමේ මඟපෙන්වීම් අනුව සකසා ඇත."
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
  scoreHeading: (score: number) => string;
  levels: Record<"excellent" | "close" | "developing" | "retry", string>;
  coverage: string;
  control: string;
  strokeOrderFeedback: string;
  tips: Record<"coverage" | "control" | "strokeOrder", string>;
  privacyNote: string;
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
    initialMessage: "Trace the glowing guide, then check how closely your lines match it.",
    scoreHeading: (score) => `Guide match: ${score}%`,
    levels: {
      excellent: "Excellent match",
      close: "Very close",
      developing: "Good beginning",
      retry: "Try once more"
    },
    coverage: "Shape covered",
    control: "Line control",
    strokeOrderFeedback: "Starts & order",
    tips: {
      coverage: "Cover more of the pale guide from beginning to end.",
      control: "Keep your line closer to the centre of the glowing path.",
      strokeOrder: "Begin at each numbered circle and lift between strokes."
    },
    privacyNote: "Measured only against the on-device guide. No drawing is uploaded or stored.",
    selfCheck: "Check my trace"
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
    initialMessage: "දිලිසෙන මාර්ගය මත ලියා, ඔබේ රේඛා එයට කොපමණ ගැළපේදැයි පරීක්ෂා කරන්න.",
    scoreHeading: (score) => `මාර්ගයට ගැළපීම: ${score}%`,
    levels: {
      excellent: "ඉතා හොඳින් ගැළපේ",
      close: "හොඳින් ළඟයි",
      developing: "හොඳ ආරම්භයක්",
      retry: "නැවත උත්සාහ කරන්න"
    },
    coverage: "හැඩය ආවරණය",
    control: "රේඛා පාලනය",
    strokeOrderFeedback: "ආරම්භය සහ පිළිවෙළ",
    tips: {
      coverage: "මඳ පැහැති මාර්ගය ආරම්භයේ සිට අවසානය දක්වා තවත් ආවරණය කරන්න.",
      control: "ඔබේ රේඛාව දිලිසෙන මාර්ගයේ මැදට ළං කරගෙන යන්න.",
      strokeOrder: "එක් එක් අංක කළ වටයෙන් පටන් ගෙන රේඛා අතර අත ඔසවන්න."
    },
    privacyNote: "මෙය ඔබේ උපාංගයේ ඇති මාර්ගය සමඟ පමණක් සසඳයි. ඇඳීම උඩුගත හෝ ගබඩා නොකරයි.",
    selfCheck: "මගේ ලිවීම පරීක්ෂා කරන්න"
  }
};
