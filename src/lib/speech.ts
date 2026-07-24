export interface SpeechOptions {
  lang: "en-US" | "en-GB" | "si-LK";
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
}

class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private supported = typeof window !== "undefined" && "speechSynthesis" in window;
  private listeners = new Set<() => void>();

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
    if (!this.supported || !text.trim()) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang;
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    utterance.voice =
      this.voices.find((voice) => voice.name === options.voiceName) ??
      this.voices.find((voice) => voice.lang.toLowerCase() === options.lang.toLowerCase()) ??
      this.voices.find((voice) => voice.lang.toLowerCase().startsWith(options.lang.slice(0, 2))) ??
      null;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  pause(): void {
    if (this.supported) window.speechSynthesis.pause();
  }
  resume(): void {
    if (this.supported) window.speechSynthesis.resume();
  }
  stop(): void {
    if (this.supported) window.speechSynthesis.cancel();
  }
}

export const speech = new SpeechService();
