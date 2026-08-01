import { cn } from "../../lib/utils";
import type { Job } from "../../types/job";

const STATUS_STYLES: Record<Job["status"], string> = {
  Open: "bg-success/10 text-success",
  Closed: "bg-danger/10 text-danger",
  Draft: "bg-warning/10 text-warning",
  Paused: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

export function JobStatusBadge({ status }: { status: Job["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}