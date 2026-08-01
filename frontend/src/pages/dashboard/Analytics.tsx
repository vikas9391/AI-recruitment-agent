import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  FileText,
  Star,
  Users,
  UserCheck,
  Gauge,
  TrendingUp,
  Loader,
  Search,
  XCircle,
  AlertTriangle,
  MinusCircle,
  type LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  fetchDashboardOverview,
  fetchApplicationsTimeline,
  fetchDepartmentDistribution,
  fetchScreeningAnalytics,
  fetchCandidateAnalytics,
  fetchRecentApplications,
  buildHiringFunnel,
} from "../../lib/dashboardApi";
import { formatRelativeTime } from "../../lib/utils";
import type {
  CandidateAnalytics,
  DashboardKPIs,
  DepartmentDistributionItem,
  FunnelStage,
  RecentApplicationItem,
  ScreeningAnalytics,
  TimelinePoint,
} from "../../types/dashboard";

const CHART_COLORS = ["#111827", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function SummaryCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="glass-card p-4 flex items-center gap-3"
    >
      <div className="h-10 w-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-ink" />
      </div>
      <div>
        <p className="text-xs text-ink-secondary">{label}</p>
        <p className="text-xl font-bold text-ink">
          {value}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </motion.div>
  );
}

// Derived from current application status, same reasoning as ActivityCard:
// the backend has no typed activity/event log, only a status per
// application, so the icon/color come from that status.
const ACTIVITY_ICON: Record<string, LucideIcon> = {
  Applied: FileText,
  Processing: Loader,
  "Under Review": Search,
  Shortlisted: Star,
  Rejected: XCircle,
  Failed: AlertTriangle,
  Hired: UserCheck,
  Withdrawn: MinusCircle,
};

const ACTIVITY_COLOR: Record<string, string> = {
  Applied: "text-accent-blue bg-accent-blue/10",
  Processing: "text-ink bg-ink/5",
  "Under Review": "text-warning bg-warning/10",
  Shortlisted: "text-accent-purple bg-accent-purple/10",
  Rejected: "text-danger bg-danger/10",
  Failed: "text-danger bg-danger/10",
  Hired: "text-success bg-success/10",
  Withdrawn: "text-ink-secondary bg-ink/5",
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [departments, setDepartments] = useState<DepartmentDistributionItem[]>([]);
  const [screening, setScreening] = useState<ScreeningAnalytics | null>(null);
  const [candidateAnalytics, setCandidateAnalytics] = useState<CandidateAnalytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentApplicationItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchDashboardOverview(),
      fetchApplicationsTimeline({ granularity: "month" }),
      fetchDepartmentDistribution(),
      fetchScreeningAnalytics(),
      fetchCandidateAnalytics(),
      fetchRecentApplications(8),
    ])
      .then(([kpiData, timelineData, departmentData, screeningData, candidateData, activityData]) => {
        if (cancelled) return;
        setKpis(kpiData);
        setTimeline(timelineData);
        setFunnel(buildHiringFunnel(kpiData));
        setDepartments(departmentData);
        setScreening(screeningData);
        setCandidateAnalytics(candidateData);
        setRecentActivity(activityData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Approximation: the screening endpoint returns a pass *rate*, not raw
  // passed/failed counts, so this backs out counts from the rate and the
  // total analyzed. Exact counts would need the backend to return
  // `passed_mandatory`/`total_analyzed` directly instead of just the
  // percentage — flagging that as a nice-to-have rather than blocking on it.
  const mandatorySkillsPie = screening
    ? (() => {
        const passed = Math.round((screening.mandatorySkillsPassRatePercentage / 100) * screening.totalResumesAnalyzed);
        const failed = Math.max(screening.totalResumesAnalyzed - passed, 0);
        return [
          { name: "Passed", value: passed },
          { name: "Failed", value: failed },
        ];
      })()
    : [];

  if (loading || !kpis || !screening || !candidateAnalytics) {
    return (
      <DashboardLayout pageTitle="Analytics">
        <div className="space-y-4">
          <div className="h-16 rounded-2xl bg-ink/5 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[72px] rounded-2xl bg-ink/5 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-ink/5 animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Analytics</h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Recruitment insights and hiring performance.
          </p>
        </div>

        {/* Summary cards — real KPIs. No "Offers Sent/Accepted" cards since
            the backend has no offer concept yet; replaced with average
            resume score and shortlist rate, both real. */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <SummaryCard icon={FileText} label="Total Applications" value={kpis.totalApplications} />
          <SummaryCard icon={Star} label="Shortlisted" value={kpis.shortlistedApplications} />
          <SummaryCard icon={Users} label="Interviews" value={kpis.interviewsScheduled} />
          <SummaryCard icon={UserCheck} label="Hired" value={kpis.hiredApplications} />
          <SummaryCard icon={Gauge} label="Avg Resume Score" value={Math.round(kpis.averageResumeScore)} />
          <SummaryCard icon={TrendingUp} label="Shortlist Rate" value={kpis.shortlistRatePercentage} suffix="%" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Applications per Month">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Hiring Funnel">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Applications by Department">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applicationCount" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="AI Match Score Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screening.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Mandatory Skills Pass Rate">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mandatorySkillsPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {mandatorySkillsPie.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Candidate Skills">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candidateAnalytics.topSkills} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-ink-secondary">No recent activity yet.</p>
            ) : (
              recentActivity.map((item, i) => {
                const Icon = ACTIVITY_ICON[item.status] ?? FileText;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        ACTIVITY_COLOR[item.status] ?? "text-ink-secondary bg-ink/5"
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink">
                        <span className="font-medium">{item.candidateName}</span> — {item.status}
                      </p>
                      <p className="text-xs text-ink-secondary">Applied for {item.jobTitle}</p>
                    </div>
                    <span className="text-xs text-ink-secondary whitespace-nowrap">
                      {formatRelativeTime(item.appliedAt)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
