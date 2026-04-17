interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
}

export function ProgressBar({ value, max, color }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
