import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ListOrdered,
  ClipboardCheck,
  BarChart3,
  MailCheck,
  ShieldCheck,
  Building2,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard/candidates", label: "Candidates", icon: Users },
  { to: "/dashboard/rankings", label: "Candidate Rankings", icon: ListOrdered },
  { to: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/email-approval", label: "Email Approval", icon: MailCheck },
  { to: "/dashboard/admin/users", label: "Admin Panel", icon: ShieldCheck },
];

const PLATFORM_NAV_ITEM = {
  to: "/platform/companies",
  label: "Platform Admin",
  icon: Building2,
};

function SidebarItem({
  to,
  label,
  icon: Icon,
  collapsed,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink to={to} end={to === "/dashboard"} onClick={onClick}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: collapsed ? 0 : 3 }}
          className={cn(
            "relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-colors",
            isActive ? "text-white" : "text-ink-secondary hover:text-ink hover:bg-white/50"
          )}
        >
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-2xl bg-ink"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <Icon size={17} className="relative z-10 shrink-0" />
          {!collapsed && <span className="relative z-10 whitespace-nowrap">{label}</span>}
        </motion.div>
      )}
    </NavLink>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === "SUPER_ADMIN" ? [...NAV_ITEMS, PLATFORM_NAV_ITEM] : NAV_ITEMS;

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2 py-2 mb-4">
        <Logo size="sm" showText={!collapsed} className="min-w-0" />
        <button
          onClick={onToggle}
          className="hidden lg:flex h-7 w-7 rounded-full items-center justify-center text-ink-secondary hover:bg-white/60 shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarItem key={item.to} {...item} collapsed={collapsed} onClick={onMobileClose} />
        ))}
      </nav>

      <div className="space-y-1 pt-4 border-t border-glass-border">
        <SidebarItem to="/dashboard/settings" label="Settings" icon={Settings} collapsed={collapsed} onClick={onMobileClose} />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
          type="button"
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 248 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden lg:block sticky top-4 h-[calc(100vh-32px)] glass-card p-3 shrink-0"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute left-3 top-3 bottom-3 w-64 glass-card p-3"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}