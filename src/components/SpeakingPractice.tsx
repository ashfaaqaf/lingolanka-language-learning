import { Mic, RotateCcw, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AudioButton } from "./AudioButton";
import { similarity } from "../lib/utils";

interface RecognitionResultLike {
  [index: number]: { transcript: string };
}
interface RecognitionEventLike extends Event {
  results: ArrayLike<RecognitionResultLike>;
}
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type RecognitionConstructor = new () => RecognitionLike;

export function SpeakingPractice({
  phrase = "ආයුබෝවන්",
  language = "si"
}: {
  phrase?: string;
  language?: "en" | "si";
}) {
  const [state, setState] = useState<"idle" | "listening" | "processing" | "recording">("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const recognitionConstructor =
    typeof window === "undefined"
      ? undefined
      : ((
          window as unknown as {
            SpeechRecognition?: RecognitionConstructor;
            webkitSpeechRecognition?: RecognitionConstructor;
          }
        ).SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: RecognitionConstructor })
          .webkitSpeechRecognition);

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      recorder.current?.stop();
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    },
    [recordingUrl]
  );

  const recognise = () => {
    if (!recognitionConstructor) return;
    const recognition = new recognitionConstructor();
    recognitionRef.current = recognition;
    recognition.lang = language === "si" ? "si-LK" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      setState("processing");
      setResult(event.results[0]?.[0]?.transcript ?? "");
      setState("idle");
    };
    recognition.onerror = () => {
      setError("Recognition could not complete. Try local recording instead.");
      setState("idle");
    };
    recognition.onend = () => setState("idle");
    setError("");
    setState("listening");
    recognition.start();
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      recorder.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => chunks.current.push(event.data);
      mediaRecorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks.current, { type: mediaRecorder.mimeType }));
        setRecordingUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return url;
        });
        stream.getTracks().forEach((track) => track.stop());
        setState("idle");
      };
      mediaRecorder.start();
      setState("recording");
    } catch {
      setError("Microphone permission was not granted. You can still listen and practise aloud.");
      setState("idle");
    }
  };
  const score = result ? similarity(phrase, result) : 0;
  return (
    <section className="card speaking-practice">
      <span className="eyebrow">Approximate practice feedback</span>
      <h2>{phrase}</h2>
      <p>Listen, repeat, and compare. This checks words—not accent quality.</p>
      <AudioButton text={phrase} language={language} />
      <div className="button-row">
        {recognitionConstructor && (
          <button className="button primary" onClick={recognise} disabled={state !== "idle"}>
            <Mic /> {state === "listening" ? "Listening…" : "Use speech recognition"}
          </button>
        )}
        {state !== "recording" ? (
          <button className="button secondary" onClick={startRecording} disabled={state !== "idle"}>
            <Mic /> Record locally
          </button>
        ) : (
          <button className="button danger" onClick={() => recorder.current?.stop()}>
            <Square /> Stop recording
          </button>
        )}
      </div>
      {result && (
        <div className="feedback success" aria-live="polite">
          <strong>Recognised: {result}</strong>
          <span>Approximate word match: {score}%</span>
          <span>
            {score > 70
              ? "Most words matched. Try again for fluency."
              : "Listen again and focus on the missing words."}
          </span>
        </div>
      )}
      {recordingUrl && (
        <div className="recording">
          <audio controls src={recordingUrl}>
            <track kind="captions" />
          </audio>
          <button className="button ghost" onClick={() => setRecordingUrl("")}>
            <RotateCcw /> Delete and retry
          </button>
          <p>Replay the reference and your recording, then self-assess: Again · Good · Easy.</p>
        </div>
      )}
      {!recognitionConstructor && (
        <p className="notice">
          Speech recognition is not supported here. The local recording comparison is available
          instead.
        </p>
      )}
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
