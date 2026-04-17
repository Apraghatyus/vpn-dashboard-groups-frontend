interface BadgeProps {
  label: string;
  color: string;
  showDot?: boolean;
}

export function Badge({ label, color, showDot = true }: BadgeProps) {
  return (
    <span
      className="badge"
      style={{
        background: `${color}18`,
        color: color,
      }}
    >
      {showDot && (
        <span className="badge-dot" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}
