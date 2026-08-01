interface SectionDividerProps {
  label?: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  if (!label) {
    return <div className="h-px w-full bg-glass-border my-6" />;
  }

  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-glass-border" />
      <span className="text-xs text-ink-secondary">{label}</span>
      <div className="h-px flex-1 bg-glass-border" />
    </div>
  );
}