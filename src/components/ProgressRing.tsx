export function ProgressRing({ value, label }: { value: number; label: string }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div
      className="progress-ring"
      style={{ "--progress": `${safe * 3.6}deg` } as React.CSSProperties}
      role="img"
      aria-label={`${label}: ${safe}%`}
    >
      <div>
        <strong>{safe}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
