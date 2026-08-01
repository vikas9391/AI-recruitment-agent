import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface TimerProps {
  durationMinutes: number;
  storageKey: string;
  onExpire?: () => void;
}

function getEndTime(storageKey: string, durationMinutes: number): number {
  const stored = sessionStorage.getItem(storageKey);
  if (stored) {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const endTime = Date.now() + durationMinutes * 60 * 1000;
  sessionStorage.setItem(storageKey, String(endTime));
  return endTime;
}

export function Timer({ durationMinutes, storageKey, onExpire }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const endTime = getEndTime(storageKey, durationMinutes);
    return Math.max(0, Math.round((endTime - Date.now()) / 1000));
  });

  useEffect(() => {
    const endTime = getEndTime(storageKey, durationMinutes);

    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, durationMinutes]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isLow = remainingSeconds > 0 && remainingSeconds <= 5 * 60;
  const isExpired = remainingSeconds <= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
        isExpired
          ? "bg-danger/10 text-danger border-danger/30"
          : isLow
          ? "bg-warning/10 text-warning border-warning/30"
          : "bg-ink/5 text-ink border-ink/10"
      )}
    >
      <Clock size={15} />
      {isExpired ? "Time Expired" : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
    </div>
  );
}