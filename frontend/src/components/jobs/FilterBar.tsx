import { RotateCcw } from "lucide-react";
import {
  departments,
  locations,
  employmentTypes,
  experienceLevels,
  jobStatuses,
} from "../../types/job";

export interface JobFilters {
  department: string;
  location: string;
  employmentType: string;
  status: string;
  experienceLevel: string;
}

interface FilterBarProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
}

const selectClass =
  "text-sm rounded-xl border border-glass-border bg-white/70 px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40";

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const update = (key: keyof JobFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className={selectClass} value={filters.department} onChange={(e) => update("department", e.target.value)}>
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select className={selectClass} value={filters.location} onChange={(e) => update("location", e.target.value)}>
        <option value="">All Locations</option>
        {locations.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select className={selectClass} value={filters.employmentType} onChange={(e) => update("employmentType", e.target.value)}>
        <option value="">All Types</option>
        {employmentTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select className={selectClass} value={filters.status} onChange={(e) => update("status", e.target.value)}>
        <option value="">All Statuses</option>
        {jobStatuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select className={selectClass} value={filters.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)}>
        <option value="">All Experience Levels</option>
        {experienceLevels.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors px-3 py-2"
      >
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  );
}