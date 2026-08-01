import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

function roleLabel(role?: string) {
  if (role === "SUPER_ADMIN") return "Super Admin";
  if (role === "HR_ADMIN") return "HR Admin";
  if (role === "HR_USER") return "HR User";
  return "";
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  }

  const menuItems = [
    { icon: User, label: "My Profile", onClick: () => setOpen(false) },
    { icon: Settings, label: "Settings", onClick: () => setOpen(false) },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-white/60"
      >
        <span className="h-8 w-8 rounded-full bg-accent-blue/20 text-accent-blue font-semibold flex items-center justify-center text-xs">
          {getInitials(user?.first_name, user?.last_name)}
        </span>
        <span className="hidden sm:block text-left">
          <span className="block text-xs font-semibold text-ink leading-tight">
            {user?.full_name ?? "..."}
          </span>
          <span className="block text-[11px] text-ink-secondary leading-tight">
            {roleLabel(user?.role)}
          </span>
        </span>
        <ChevronDown size={14} className="text-ink-secondary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 glass-card p-2 z-50"
            >
              {menuItems.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-ink-secondary hover:bg-white/60 hover:text-ink"
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}