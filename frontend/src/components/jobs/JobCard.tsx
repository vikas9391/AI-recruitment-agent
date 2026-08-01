import { MapPin, Users } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { JobStatusBadge } from "./JobStatusBadge";
import type { Job } from "../../constants/jobsMockData";

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
}

export function JobCard({ job, onView }: JobCardProps) {
  return (
    <GlassCard onClick={() => onView(job)} className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{job.title}</p>
          <p className="text-xs text-ink-secondary mt-0.5">{job.department}</p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink-secondary">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {job.applications} applicants
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="text-[11px] px-2 py-1 rounded-full bg-ink/5 text-ink-secondary">
            {skill}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}