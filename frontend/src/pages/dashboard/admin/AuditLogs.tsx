import { motion } from "framer-motion";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { AdminTabs } from "../../../components/admin/AdminTabs";
import { auditLogs, type AuditStatus } from "../../../constants/adminMockData";
import { cn } from "../../../lib/utils";

const STATUS_STYLES: Record<AuditStatus, string> = {
  Success: "bg-success/10 text-success border-success/30",
  Failed: "bg-danger/10 text-danger border-danger/30",
};

function StatusBadge({ status }: { status: AuditStatus }) {
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

export default function AuditLogs() {
  return (
    <DashboardLayout pageTitle="Admin Panel">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Audit Logs</h1>
          <p className="text-sm text-ink-secondary mt-1">Track user activity across the platform.</p>
        </div>

        <AdminTabs />

        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Module</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{log.user}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{log.action}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{log.module}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{log.date}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{log.time}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}