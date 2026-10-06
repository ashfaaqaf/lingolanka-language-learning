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
import { motionOr, springUI } from "../lib/motion";

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
  const reduceMotion = useReducedMotion() || profile.settings.reducedMotion;
  const audioCopy =
    profile.settings.interfaceLanguage === "si"
      ? {
          ready: "හඬ ඇසීමට සූදානම්",
          loading: "උච්චාරණ හඬ පූරණය වේ",
          playing: "උච්චාරණය වාදනය වේ",
          playingSlowly: "මන්දගාමීව වාදනය වේ",
          complete: "හඬ අවසන්",
          unavailable: "මෙම උපකරණයේ හඬ වාදනය කළ නොහැක",
          resumed: "හඬ නැවත ආරම්භ කළා",
          paused: "හඬ නවතා ඇත",
          stopped: "හඬ අවසන් කළා",
          group: "උච්චාරණ හඬ පාලන",
          play: "හඬ අසන්න",
          playSlowly: "මන්දගාමී හඬ අසන්න",
          resume: "හඬ නැවත අරඹන්න",
          pause: "හඬ තාවකාලිකව නවතන්න",
          stop: "හඬ අවසන් කරන්න"
        }
      : {
          ready: "Ready to play",
          loading: "Loading pronunciation",
          playing: "Playing pronunciation",
          playingSlowly: "Playing slowly",
          complete: "Playback complete",
          unavailable: "Audio is unavailable on this device",
          resumed: "Playback resumed",
          paused: "Playback paused",
          stopped: "Playback stopped",
          group: "Pronunciation playback controls",
          play: "Play",
          playSlowly: "Play slowly",
          resume: "Resume speech",
          pause: "Pause speech",
          stop: "Stop speech"
        };
  const [playback, setPlayback] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [message, setMessage] = useState(audioCopy.ready);
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
        setMessage(slow ? audioCopy.playingSlowly : audioCopy.playing);
      },
      onEnd: () => {
        setPlayback("idle");
        setMessage(audioCopy.complete);
      },
      onError: () => {
        setPlayback("idle");
        setMessage(audioCopy.unavailable);
      }
    });
    if (ok) {
      setPlayback("loading");
      setMessage(audioCopy.loading);
    } else {
      setPlayback("idle");
      setMessage(audioCopy.unavailable);
    }
  };

  const togglePause = () => {
    if (playback === "paused") {
      if (speech.resume()) {
        setPlayback("playing");
        setMessage(audioCopy.resumed);
      }
      return;
    }

    if (speech.pause()) {
      setPlayback("paused");
      setMessage(audioCopy.paused);
    }
  };

  const stop = () => {
    speech.stop();
    setPlayback("idle");
    setMessage(audioCopy.stopped);
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
      transition={motionOr(reduceMotion, springUI)}
    >
      <span className="audio-group" role="group" aria-label={audioCopy.group}>
        <button
          className="icon-button audio-play"
          type="button"
          onClick={play}
          aria-pressed={playback === "playing"}
          aria-label={label ?? `${slow ? audioCopy.playSlowly : audioCopy.play}: ${text}`}
        >
          {slow ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <button
          className="icon-button subtle"
          type="button"
          disabled={playback === "idle"}
          onClick={togglePause}
          aria-label={playback === "paused" ? audioCopy.resume : audioCopy.pause}
        >
          {playback === "paused" ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button
          className="icon-button subtle"
          type="button"
          disabled={playback === "idle"}
          onClick={stop}
          aria-label={audioCopy.stop}
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
