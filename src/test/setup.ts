import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  })),
  writable: true
});
Object.defineProperty(window, "speechSynthesis", {
  value: {
    getVoices: vi.fn(() => []),
    addEventListener: vi.fn(),
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn()
  },
  writable: true
});
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  value: vi.fn(function (this: HTMLMediaElement) {
    queueMicrotask(() => this.onplay?.(new Event("play")));
    return Promise.resolve();
  }),
  writable: true
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  value: vi.fn(),
  writable: true
});
Object.defineProperty(HTMLMediaElement.prototype, "load", {
  value: vi.fn(),
  writable: true
});
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => ({
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn()
  })),
  writable: true
});
globalThis.SpeechSynthesisUtterance = class {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  constructor(text: string) {
    this.text = text;
  }
} as unknown as typeof SpeechSynthesisUtterance;
