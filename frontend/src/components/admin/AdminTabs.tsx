import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const ADMIN_TABS = [
  { to: "/dashboard/admin/users", label: "User Management" },
  { to: "/dashboard/admin/roles", label: "Roles & Permissions" },
  { to: "/dashboard/admin/audit-logs", label: "Audit Logs" },
  { to: "/dashboard/admin/settings", label: "System Settings" },
];

export function AdminTabs() {
  return (
    <div className="glass-card p-1.5 flex flex-wrap gap-1">
      {ADMIN_TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className="flex-1 min-w-[140px]">
          {({ isActive }) => (
            <div
              className={cn(
                "rounded-xl px-3.5 py-2 text-center text-sm font-medium transition-colors",
                isActive ? "bg-ink text-white" : "text-ink-secondary hover:bg-white/60 hover:text-ink"
              )}
            >
              {tab.label}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}