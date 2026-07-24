export interface SpeechOptions {
  lang: "en-US" | "en-GB" | "si-LK";
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private supported = typeof window !== "undefined" && "speechSynthesis" in window;
  private listeners = new Set<() => void>();
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeOnEnd: (() => void) | null = null;
  private paused = false;

  constructor() {
    if (!this.supported) return;
    this.loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", this.loadVoices);
  }

  private loadVoices = () => {
    this.voices = window.speechSynthesis.getVoices();
    this.listeners.forEach((listener) => listener());
  };

  getVoices(language?: "en" | "si"): SpeechSynthesisVoice[] {
    if (!language) return this.voices;
    return this.voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
  }

  isSupported(): boolean {
    return this.supported;
  }

  speak(text: string, options: SpeechOptions): boolean {
    if (!this.supported || !text.trim() || typeof SpeechSynthesisUtterance === "undefined") {
      return false;
    }

    try {
      this.stop();
      this.loadVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang;
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.voice =
        this.voices.find((voice) => voice.name === options.voiceName) ??
        this.voices.find((voice) => voice.lang.toLowerCase() === options.lang.toLowerCase()) ??
        this.voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(options.lang.slice(0, 2))
        ) ??
        null;

      this.activeUtterance = utterance;
      this.activeOnEnd = options.onEnd ?? null;
      this.paused = false;
      utterance.onstart = () => options.onStart?.();
      utterance.onend = () => this.finish(utterance, options.onEnd);
      utterance.onerror = () => {
        if (this.activeUtterance !== utterance) return;
        this.activeUtterance = null;
        this.activeOnEnd = null;
        this.paused = false;
        options.onError?.();
      };
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      this.activeUtterance = null;
      this.activeOnEnd = null;
      this.paused = false;
      options.onError?.();
      return false;
    }
  }

  private finish(utterance: SpeechSynthesisUtterance, onEnd?: () => void): void {
    if (this.activeUtterance !== utterance) return;
    this.activeUtterance = null;
    this.activeOnEnd = null;
    this.paused = false;
    onEnd?.();
  }

  pause(): boolean {
    if (!this.supported || !this.activeUtterance || this.paused) return false;
    window.speechSynthesis.pause();
    this.paused = true;
    return true;
  }

  resume(): boolean {
    if (!this.supported || !this.activeUtterance || !this.paused) return false;
    window.speechSynthesis.resume();
    this.paused = false;
    return true;
  }

  stop(notify = true): boolean {
    if (!this.supported) return false;
    const wasActive = this.activeUtterance !== null;
    const onEnd = this.activeOnEnd;
    this.activeUtterance = null;
    this.activeOnEnd = null;
    this.paused = false;
    window.speechSynthesis.cancel();
    if (wasActive && notify) onEnd?.();
    return wasActive;
  }
}

export const speech = new SpeechService();
