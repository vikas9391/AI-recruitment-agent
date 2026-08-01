export function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card h-24 animate-pulse bg-ink/5" />
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card p-5 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl bg-ink/5 animate-pulse" />
      ))}
    </div>
  );
}