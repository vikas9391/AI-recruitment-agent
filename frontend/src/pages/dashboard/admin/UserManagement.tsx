import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { AdminTabs } from "../../../components/admin/AdminTabs";
import { adminUsers, type UserRole, type UserStatus } from "../../../constants/adminMockData";
import { cn } from "../../../lib/utils";

const STATUS_STYLES: Record<UserStatus, string> = {
  Active: "bg-success/10 text-success border-success/30",
  Inactive: "bg-ink/5 text-ink-secondary border-ink/10",
  Suspended: "bg-danger/10 text-danger border-danger/30",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

const ROLE_FILTERS: (UserRole | "all")[] = ["all", "Super Admin", "HR Admin", "HR Recruiter", "HR Manager"];
const STATUS_FILTERS: (UserStatus | "all")[] = ["all", "Active", "Inactive", "Suspended"];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  const filtered = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  return (
    <DashboardLayout pageTitle="Admin Panel">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-ink">User Management</h1>
            <p className="text-sm text-ink-secondary mt-1">Manage HR users and administrators.</p>
          </div>
          <button
            // TODO: Backend Integration — create user
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
          >
            <Plus size={15} />
            Create User
          </button>
        </div>

        <AdminTabs />

        <div className="glass-card p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {ROLE_FILTERS.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? "All roles" : r}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{u.role}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{u.department}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-secondary hover:bg-white hover:text-ink transition-colors"
                          aria-label="View user"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          // TODO: Backend Integration — edit user
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-secondary hover:bg-white hover:text-ink transition-colors"
                          aria-label="Edit user"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          // TODO: Backend Integration — delete user
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-danger hover:bg-danger/5 transition-colors"
                          aria-label="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-ink-secondary">
                      No users match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}