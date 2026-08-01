import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { AdminTabs } from "../../../components/admin/AdminTabs";
import { companySettings, type CompanySettings } from "../../../constants/adminMockData";
import { cn } from "../../../lib/utils";

const THEME_OPTIONS: { value: CompanySettings["theme"]; label: string; icon: typeof Sun }[] = [
  { value: "Light", label: "Light", icon: Sun },
  { value: "Dark", label: "Dark", icon: Moon },
  { value: "System", label: "System", icon: Monitor },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-ink" : "bg-ink/15"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<CompanySettings>(companySettings);

  return (
    <DashboardLayout pageTitle="Admin Panel">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">System Settings</h1>
          <p className="text-sm text-ink-secondary mt-1">Configure company details and platform preferences.</p>
        </div>

        <AdminTabs />

        {/* Company Information */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-ink">Company Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-secondary">Company Name</label>
              <input
                value={settings.companyName}
                onChange={(e) => setSettings((s) => ({ ...s, companyName: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-secondary">Email</label>
              <input
                value={settings.email}
                onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-secondary">Phone</label>
              <input
                value={settings.phone}
                onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-ink-secondary">Address</label>
              <input
                value={settings.address}
                onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-ink">Theme</h3>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSettings((s) => ({ ...s, theme: value }))}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                  settings.theme === value
                    ? "border-ink bg-ink text-white"
                    : "border-gray-200 text-ink-secondary hover:bg-white"
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-ink">Notification Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Email Notifications</p>
                <p className="text-xs text-ink-secondary mt-0.5">Receive general platform updates via email.</p>
              </div>
              <Toggle
                checked={settings.notifications.emailNotifications}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, notifications: { ...s.notifications, emailNotifications: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Assessment Alerts</p>
                <p className="text-xs text-ink-secondary mt-0.5">Get notified when candidates complete assessments.</p>
              </div>
              <Toggle
                checked={settings.notifications.assessmentAlerts}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, notifications: { ...s.notifications, assessmentAlerts: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Interview Alerts</p>
                <p className="text-xs text-ink-secondary mt-0.5">Get notified about upcoming interviews.</p>
              </div>
              <Toggle
                checked={settings.notifications.interviewAlerts}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, notifications: { ...s.notifications, interviewAlerts: v } }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            // TODO: Backend Integration — save settings
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}