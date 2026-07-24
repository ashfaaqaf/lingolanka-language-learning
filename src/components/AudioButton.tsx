import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { speech } from "../lib/speech";
import { useApp } from "../context/AppContext";

export function AudioButton({
  text,
  language,
  slow = false,
  label
}: {
  text: string;
  language: "en" | "si";
  slow?: boolean;
  label?: string;
}) {
  const { profile } = useApp();
  const [message, setMessage] = useState("");
  useEffect(() => () => speech.stop(), []);
  const play = () => {
    const settings = profile.settings;
    const ok = speech.speak(text, {
      lang: language === "si" ? "si-LK" : "en-US",
      rate: slow ? Math.max(0.55, settings.speechRate * 0.72) : settings.speechRate,
      pitch: settings.speechPitch,
      volume: settings.speechVolume,
      voiceName: language === "si" ? settings.sinhalaVoice : settings.englishVoice
    });
    setMessage(
      ok
        ? "Playing device-supported pronunciation."
        : "Speech is unavailable on this device. Read the text shown."
    );
  };
  return (
    <span className="audio-group">
      <button
        className="icon-button"
        type="button"
        onClick={play}
        aria-label={label ?? `${slow ? "Play slowly" : "Play"}: ${text}`}
      >
        {slow ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      <button
        className="icon-button subtle"
        type="button"
        onClick={() => speech.pause()}
        aria-label="Pause speech"
      >
        <Pause aria-hidden="true" />
      </button>
      <button
        className="icon-button subtle"
        type="button"
        onClick={() => speech.stop()}
        aria-label="Stop speech"
      >
        <Square aria-hidden="true" />
      </button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </span>
  );
}
