import { Inbox } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="h-14 w-14 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-4">
        <Inbox size={24} />
      </span>
      <p className="text-sm font-medium text-ink">No job openings found.</p>
      <p className="text-xs text-ink-secondary mt-1">Try adjusting your filters, or create a new job.</p>
      <div className="mt-5">
        <Button variant="primary" className="!px-5 !py-2.5 text-sm" onClick={onCreate}>
          Create First Job
        </Button>
      </div>
    </div>
  );
}