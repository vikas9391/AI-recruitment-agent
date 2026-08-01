import { GlassCard } from "./GlassCard";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface CandidatePreviewCardProps {
  name: string;
  role: string;
  matchScore: number;
  experience: string;
  skills: readonly string[];
  status: string;
  delay?: number;
}

export function CandidatePreviewCard({
  name,
  role,
  matchScore,
  experience,
  skills,
  status,
  delay,
}: CandidatePreviewCardProps) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <GlassCard delay={delay}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-full bg-accent-purple/15 text-accent-purple font-semibold flex items-center justify-center text-sm">
            {initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{name}</p>
            <p className="text-xs text-ink-secondary">{role}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-accent-blue">{matchScore}%</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span key={skill} className="text-[11px] px-2 py-1 rounded-full bg-ink/5 text-ink-secondary">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-secondary">{experience} experience</p>
          <div className="mt-1">
            <Badge label={status} />
          </div>
        </div>
        <Button variant="secondary" className="!px-4 !py-2 text-xs">
          View
        </Button>
      </div>
    </GlassCard>
  );
}