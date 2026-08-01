import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="hidden md:flex items-center gap-2 rounded-full bg-white/60 border border-glass-border px-4 py-2 w-64">
      <Search size={15} className="text-ink-secondary" />
      <input
        type="search"
        placeholder="Search candidates, jobs..."
        aria-label="Search"
        className="bg-transparent outline-none text-sm placeholder:text-ink-secondary/60 w-full"
      />
    </div>
  );
}