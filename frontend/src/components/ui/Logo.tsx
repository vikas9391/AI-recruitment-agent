import { cn } from "../../lib/utils";
import icon from "../../assets/crewsync-icon.png";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { icon: string; text: string; gap: string }> = {
  sm: {
    icon: "h-8 w-8",
    text: "text-lg",
    gap: "gap-2.5",
  },
  md: {
    icon: "h-9 w-9 sm:h-10 sm:w-10",
    text: "text-xl sm:text-2xl",
    gap: "gap-2.5 sm:gap-3",
  },
  lg: {
    icon: "h-11 w-11 sm:h-12 sm:w-12",
    text: "text-2xl sm:text-3xl",
    gap: "gap-3",
  },
};

/**
 * Shared CrewSync logo mark. Renders the icon and wordmark as independent
 * elements (rather than a single flattened raster lockup) so size, gap and
 * vertical alignment stay controllable and consistent everywhere it's used.
 */
export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = SIZE_MAP[size];

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <img
        src={icon}
        alt="CrewSync"
        className={cn(s.icon, "shrink-0 object-contain")}
        draggable={false}
      />
      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none whitespace-nowrap",
            s.text
          )}
        >
          <span className="text-ink">Crew</span>
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            Sync
          </span>
        </span>
      )}
    </span>
  );
}