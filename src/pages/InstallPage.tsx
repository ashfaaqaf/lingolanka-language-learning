import { CheckCircle2, Copy, Download, EllipsisVertical, Share2, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function getStandaloneState() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  );
}

export function InstallPage() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(getStandaloneState);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const appUrl = useMemo(() => new URL(import.meta.env.BASE_URL, window.location.origin).href, []);
  const isAppleMobile = /iPad|iPhone|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateInstalledState = () => setIsInstalled(getStandaloneState());
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setMessage("LingoLanka is installed and ready on your home screen.");
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    displayMode.addEventListener?.("change", updateInstalledState);

    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      displayMode.removeEventListener?.("change", updateInstalledState);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setMessage("Installation started. LingoLanka will appear on your home screen.");
    }
    setInstallPrompt(null);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setMessage(`Copy this address: ${appUrl}`);
    }
  };

  const shareLink = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: "LingoLanka",
        text: "Learn Sinhala or English for free with LingoLanka.",
        url: appUrl
      });
    } catch {
      // Closing the native share sheet is not an error that needs to interrupt the learner.
    }
  };

  return (
    <div className="page install-page">
      <header className="install-hero">
        <span className="eyebrow">Free mobile app</span>
        <h1>Put LingoLanka on your home screen</h1>
        <p>
          Install it from your browser for a full-screen, fast experience with offline-friendly
          lessons—no app store or account required.
        </p>
        <div className={`install-status ${isInstalled ? "installed" : ""}`} role="status">
          {isInstalled ? <CheckCircle2 /> : <Smartphone />}
          <span>
            <strong>{isInstalled ? "Already installed" : "Ready to install"}</strong>
            {isInstalled
              ? " Open LingoLanka from your home screen."
              : isAppleMobile
                ? " Follow the Safari steps below."
                : " Use the install button or browser menu below."}
          </span>
        </div>
        {!isInstalled && installPrompt && (
          <button className="button primary large install-now" type="button" onClick={install}>
            <Download /> Install LingoLanka
          </button>
        )}
        {message && <p className="feedback neutral">{message}</p>}
      </header>

      <section className="install-grid" aria-label="Phone installation instructions">
        <article className="install-card">
          <div className="install-card-heading">
            <span className="platform-icon android" aria-hidden="true">
              <Smartphone />
            </span>
            <div>
              <span className="eyebrow">Android</span>
              <h2>Install with Chrome</h2>
            </div>
          </div>
          <ol className="install-steps">
            <li>
              <span>1</span>
              <div>
                <strong>Open this app in Chrome</strong>
                <p>Use the direct link below in Google Chrome.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Open the Chrome menu</strong>
                <p>
                  Tap <EllipsisVertical aria-hidden="true" /> in the top-right, then choose
                  <b> Install app</b> or <b>Add to Home screen</b>.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Confirm Install</strong>
                <p>The LingoLanka icon will appear with your other apps.</p>
              </div>
            </li>
          </ol>
        </article>

        <article className="install-card">
          <div className="install-card-heading">
            <span className="platform-icon apple" aria-hidden="true">
              <Smartphone />
            </span>
            <div>
              <span className="eyebrow">iPhone & iPad</span>
              <h2>Install with Safari</h2>
            </div>
          </div>
          <ol className="install-steps">
            <li>
              <span>1</span>
              <div>
                <strong>Open this app in Safari</strong>
                <p>Apple only offers home-screen installation from Safari.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Tap the Share button</strong>
                <p>
                  Tap <Share2 aria-hidden="true" /> in Safari, then scroll down in the share sheet.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Tap Add to Home Screen</strong>
                <p>
                  Keep the name LingoLanka, then tap <b>Add</b> in the top-right.
                </p>
              </div>
            </li>
          </ol>
        </article>
      </section>

      <section className="install-link-card">
        <div>
          <span className="eyebrow">Direct app link</span>
          <h2>Send it to another phone</h2>
          <p className="install-url">{appUrl}</p>
        </div>
        <div className="button-row">
          <button className="button secondary" type="button" onClick={copyLink}>
            {copied ? <CheckCircle2 /> : <Copy />} {copied ? "Copied" : "Copy link"}
          </button>
          <button className="button primary" type="button" onClick={shareLink}>
            <Share2 /> Share
          </button>
        </div>
      </section>
    </div>
  );
}
