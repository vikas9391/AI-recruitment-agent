import { cn } from "../../lib/utils";
import type { Job } from "../../constants/jobsMockData";

const STATUS_STYLES: Record<Job["status"], string> = {
  Open: "bg-success/10 text-success",
  Closed: "bg-danger/10 text-danger",
  Draft: "bg-warning/10 text-warning",
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