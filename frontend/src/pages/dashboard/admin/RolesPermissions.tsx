import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { AdminTabs } from "../../../components/admin/AdminTabs";
import { adminRoles } from "../../../constants/adminMockData";

export default function RolesPermissions() {
  return (
    <DashboardLayout pageTitle="Admin Panel">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Roles & Permissions</h1>
          <p className="text-sm text-ink-secondary mt-1">Review access levels for each role.</p>
        </div>

        <AdminTabs />

        <div className="grid sm:grid-cols-2 gap-4">
          {adminRoles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="glass-card p-5 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{role.name}</h3>
                  <p className="text-sm text-ink-secondary mt-0.5">{role.description}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-secondary mb-2">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink-secondary whitespace-nowrap"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <button
                // TODO: Backend Integration — edit permissions
                className="mt-auto self-start rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink hover:bg-white transition-colors"
              >
                Edit Permissions
              </button>
            </motion.div>
          ))}
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}