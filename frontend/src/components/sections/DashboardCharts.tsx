import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "../ui/ChartCard";
import {
  fetchApplicationsTimeline,
  fetchApplicationStatusBreakdown,
  fetchDashboardOverview,
  fetchDepartmentDistribution,
  buildHiringFunnel,
} from "../../lib/dashboardApi";
import type {
  DepartmentDistributionItem,
  FunnelStage,
  StatusBreakdownItem,
  TimelinePoint,
} from "../../types/dashboard";

const STATUS_COLOR: Record<string, string> = {
  Applied: "#65B8FF",
  Processing: "#A78BFA",
  "Under Review": "#F59E0B",
  Shortlisted: "#B38BFF",
  Rejected: "#EF4444",
  Failed: "#9CA3AF",
  Hired: "#22C55E",
  Withdrawn: "#6B7280",
};

function ChartSkeleton() {
  return (
    <ChartCard title=" " className="animate-pulse">
      <div className="h-[220px] rounded-2xl bg-ink/5" />
    </ChartCard>
  );
}

export default function DashboardCharts() {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [departments, setDepartments] = useState<DepartmentDistributionItem[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchApplicationsTimeline({ granularity: "month" }),
      fetchDashboardOverview(),
      fetchDepartmentDistribution(),
      fetchApplicationStatusBreakdown(),
    ])
      .then(([timelineData, kpis, departmentData, breakdown]) => {
        if (cancelled) return;
        setTimeline(timelineData);
        setFunnel(buildHiringFunnel(kpis));
        setDepartments(departmentData);
        setStatusBreakdown(breakdown);
      })
      .catch(() => {
        if (!cancelled) {
          setTimeline([]);
          setFunnel([]);
          setDepartments([]);
          setStatusBreakdown([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="Monthly Applications" subtitle="Applications received per month">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#65B8FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#65B8FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Area type="monotone" dataKey="count" stroke="#65B8FF" strokeWidth={2} fill="url(#appGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Hiring Funnel" subtitle="Applications → Shortlisted → Interviews → Hired">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={funnel} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Bar dataKey="count" fill="#B38BFF" radius={[0, 8, 8, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Applications by Department" subtitle="Open roles' applications, by department">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={departments}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Bar dataKey="applicationCount" fill="#65B8FF" radius={[8, 8, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Candidate Status" subtitle="Current distribution">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusBreakdown}
              dataKey="count"
              nameKey="label"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {statusBreakdown.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLOR[entry.label] ?? "#9CA3AF"} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {statusBreakdown.map((s) => (
            <span key={s.status} className="flex items-center gap-1.5 text-xs text-ink-secondary">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[s.label] ?? "#9CA3AF" }} />
              {s.label}
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
