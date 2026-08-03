import audioManifest from "../data/audioManifest.json";

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

const bundledAudio = audioManifest as Record<string, string>;

class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private synthesisSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined";
  private audioSupported = typeof Audio !== "undefined";
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private activeOnEnd: (() => void) | null = null;
  private activeOnError: (() => void) | null = null;
  private paused = false;

  constructor() {
    if (!this.synthesisSupported) return;
    this.loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", this.loadVoices);
  }

  private loadVoices = () => {
    if (!this.synthesisSupported) return;
    this.voices = window.speechSynthesis.getVoices();
  };

  private getBundledSource(text: string, lang: SpeechOptions["lang"]): string | null {
    const language = lang.startsWith("si") ? "si" : "en";
    const normalized = text.trim();
    const filename =
      bundledAudio[`${language}:${normalized}`] ??
      (language === "en" ? bundledAudio[`${language}:${normalized.toLowerCase()}`] : undefined);
    if (!filename) return null;
    return `${import.meta.env.BASE_URL}audio/${filename}`;
  }

  getVoices(language?: "en" | "si"): SpeechSynthesisVoice[] {
    if (!language) return this.voices;
    return this.voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
  }

  isSupported(): boolean {
    return this.audioSupported || this.synthesisSupported;
  }

  speak(text: string, options: SpeechOptions): boolean {
    if (!text.trim()) return false;
    this.stop(false);

    const bundledSource = this.getBundledSource(text, options.lang);
    if (bundledSource && this.audioSupported) {
      return this.playBundledAudio(bundledSource, text, options);
    }

    return this.speakWithDeviceVoice(text, options);
  }

  private playBundledAudio(source: string, text: string, options: SpeechOptions): boolean {
    try {
      const audio = new Audio(source);
      audio.preload = "auto";
      audio.muted = false;
      audio.playbackRate = Math.min(1.5, Math.max(0.5, options.rate ?? 1));
      audio.volume = Math.min(1, Math.max(0, options.volume ?? 1));
      audio.preservesPitch = true;
      (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;

      this.activeAudio = audio;
      this.activeOnEnd = options.onEnd ?? null;
      this.activeOnError = options.onError ?? null;
      this.paused = false;

      let started = false;
      audio.onplay = () => {
        if (started) return;
        started = true;
        options.onStart?.();
      };
      audio.onended = () => this.finishAudio(audio, options.onEnd);
      const handleAudioFailure = () => {
        if (this.activeAudio !== audio) return;
        this.clearAudio(audio);
        if (!this.speakWithDeviceVoice(text, options)) options.onError?.();
      };
      audio.onerror = handleAudioFailure;

      audio.load();
      const playResult = audio.play();
      playResult?.catch(handleAudioFailure);
      return true;
    } catch {
      return this.speakWithDeviceVoice(text, options);
    }
  }

  private speakWithDeviceVoice(text: string, options: SpeechOptions): boolean {
    if (!this.synthesisSupported) return false;

    try {
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
          voice.lang.toLowerCase().startsWith(options.lang.slice(0, 2).toLowerCase())
        ) ??
        null;

      this.activeUtterance = utterance;
      this.activeOnEnd = options.onEnd ?? null;
      this.activeOnError = options.onError ?? null;
      this.paused = false;
      utterance.onstart = () => options.onStart?.();
      utterance.onend = () => this.finishUtterance(utterance, options.onEnd);
      utterance.onerror = () => {
        if (this.activeUtterance !== utterance) return;
        this.clearUtterance();
        options.onError?.();
      };
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      this.clearUtterance();
      return false;
    }
  }

  private finishAudio(audio: HTMLAudioElement, onEnd?: () => void): void {
    if (this.activeAudio !== audio) return;
    this.clearAudio(audio);
    onEnd?.();
  }

  private finishUtterance(utterance: SpeechSynthesisUtterance, onEnd?: () => void): void {
    if (this.activeUtterance !== utterance) return;
    this.clearUtterance();
    onEnd?.();
  }

  private clearAudio(audio: HTMLAudioElement): void {
    audio.onplay = null;
    audio.onended = null;
    audio.onerror = null;
    if (this.activeAudio === audio) this.activeAudio = null;
    this.activeOnEnd = null;
    this.activeOnError = null;
    this.paused = false;
  }

  private clearUtterance(): void {
    this.activeUtterance = null;
    this.activeOnEnd = null;
    this.activeOnError = null;
    this.paused = false;
  }

  pause(): boolean {
    if (this.paused) return false;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.paused = true;
      return true;
    }
    if (!this.synthesisSupported || !this.activeUtterance) return false;
    window.speechSynthesis.pause();
    this.paused = true;
    return true;
  }

  resume(): boolean {
    if (!this.paused) return false;
    if (this.activeAudio) {
      const audio = this.activeAudio;
      this.paused = false;
      audio.play().catch(() => {
        if (this.activeAudio !== audio) return;
        const onError = this.activeOnError;
        this.clearAudio(audio);
        onError?.();
      });
      return true;
    }
    if (!this.synthesisSupported || !this.activeUtterance) return false;
    window.speechSynthesis.resume();
    this.paused = false;
    return true;
  }

  stop(notify = true): boolean {
    const wasActive = this.activeAudio !== null || this.activeUtterance !== null;
    const onEnd = this.activeOnEnd;

    if (this.activeAudio) {
      const audio = this.activeAudio;
      audio.pause();
      audio.currentTime = 0;
      this.clearAudio(audio);
    }
    if (this.activeUtterance && this.synthesisSupported) {
      this.clearUtterance();
      window.speechSynthesis.cancel();
    }

    if (wasActive && notify) onEnd?.();
    return wasActive;
  }
}

export const speech = new SpeechService();
