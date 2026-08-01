import { Menu } from "lucide-react";
import { Breadcrumb } from "../ui/Breadcrumb";
import { SearchBar } from "../ui/SearchBar";
import { NotificationMenu } from "../ui/NotificationMenu";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ProfileMenu } from "../ui/ProfileMenu";

interface TopNavbarProps {
  pageTitle: string;
  onMobileMenuClick: () => void;
}

export function TopNavbar({ pageTitle, onMobileMenuClick }: TopNavbarProps) {
  return (
    <header className="sticky top-4 z-30 glass-card px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden h-9 w-9 rounded-full bg-white/60 flex items-center justify-center shrink-0"
          aria-label="Open menu"
        >
          <Menu size={17} />
        </button>
        <div className="min-w-0">
          <Breadcrumb items={[{ label: "Dashboard", to: "/dashboard" }, { label: pageTitle }]} />
          <h2 className="text-base font-bold text-ink truncate">{pageTitle}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <SearchBar />
        <NotificationMenu />
        <ThemeToggle />
        <div className="hidden sm:block h-6 w-px bg-glass-border" />
        <ProfileMenu />
      </div>
    </header>
  );
}