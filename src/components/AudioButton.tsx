import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { speech } from "../lib/speech";
import { useApp } from "../context/AppContext";
import {
  moveLiquidGlass,
  pressLiquidGlass,
  releaseLiquidGlass,
  resetLiquidGlass
} from "../lib/liquidGlass";

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
  const reduceMotion = useReducedMotion();
  const [playback, setPlayback] = useState<"idle" | "playing" | "paused">("idle");
  const [message, setMessage] = useState("Ready to play");
  useEffect(
    () => () => {
      speech.stop(false);
    },
    []
  );

  const play = () => {
    const settings = profile.settings;
    const ok = speech.speak(text, {
      lang: language === "si" ? "si-LK" : "en-US",
      rate: slow ? Math.max(0.55, settings.speechRate * 0.72) : settings.speechRate,
      pitch: settings.speechPitch,
      volume: settings.speechVolume,
      voiceName: language === "si" ? settings.sinhalaVoice : settings.englishVoice,
      onStart: () => {
        setPlayback("playing");
        setMessage(slow ? "Playing slowly" : "Playing pronunciation");
      },
      onEnd: () => {
        setPlayback("idle");
        setMessage("Playback complete");
      },
      onError: () => {
        setPlayback("idle");
        setMessage("Audio is unavailable on this device");
      }
    });
    if (ok) {
      setPlayback("playing");
      setMessage(slow ? "Playing slowly" : "Playing pronunciation");
    } else {
      setPlayback("idle");
      setMessage("Audio is unavailable on this device");
    }
  };

  const togglePause = () => {
    if (playback === "paused") {
      if (speech.resume()) {
        setPlayback("playing");
        setMessage("Playback resumed");
      }
      return;
    }

    if (speech.pause()) {
      setPlayback("paused");
      setMessage("Playback paused");
    }
  };

  const stop = () => {
    speech.stop();
    setPlayback("idle");
    setMessage("Playback stopped");
  };

  return (
    <motion.span
      className={`audio-control liquid-glass playback-${playback}`}
      onPointerMove={moveLiquidGlass}
      onPointerDown={pressLiquidGlass}
      onPointerUp={releaseLiquidGlass}
      onPointerCancel={resetLiquidGlass}
      onPointerLeave={resetLiquidGlass}
      animate={reduceMotion ? undefined : { scale: playback === "playing" ? 1.012 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <span className="audio-group" role="group" aria-label="Pronunciation playback controls">
        <button
          className="icon-button audio-play"
          type="button"
          onClick={play}
          aria-pressed={playback === "playing"}
          aria-label={label ?? `${slow ? "Play slowly" : "Play"}: ${text}`}
        >
          {slow ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <button
          className="icon-button subtle"
          type="button"
          disabled={playback === "idle"}
          onClick={togglePause}
          aria-label={playback === "paused" ? "Resume speech" : "Pause speech"}
        >
          {playback === "paused" ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button
          className="icon-button subtle"
          type="button"
          disabled={playback === "idle"}
          onClick={stop}
          aria-label="Stop speech"
        >
          <Square aria-hidden="true" />
        </button>
      </span>
      <span className="audio-status" aria-live="polite">
        <i aria-hidden="true" />
        {message}
      </span>
    </motion.span>
  );
}
