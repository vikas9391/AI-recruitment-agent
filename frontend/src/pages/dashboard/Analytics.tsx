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
  Send,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  ClipboardCheck,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  summaryStats,
  applicationsPerMonth,
  hiringFunnel,
  candidatesByDepartment,
  matchScoreDistribution,
  assessmentCompletion,
  interviewSuccessRate,
  recentActivity,
  type ActivityItem,
} from "../../constants/analyticsMockData";

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

const ACTIVITY_ICON: Record<ActivityItem["type"], typeof UserPlus> = {
  "Candidate Applied": UserPlus,
  "Assessment Completed": ClipboardCheck,
  "Interview Scheduled": CalendarCheck,
  "Offer Approved": BadgeCheck,
};

const ACTIVITY_COLOR: Record<ActivityItem["type"], string> = {
  "Candidate Applied": "text-accent-blue bg-accent-blue/10",
  "Assessment Completed": "text-warning bg-warning/10",
  "Interview Scheduled": "text-ink bg-ink/5",
  "Offer Approved": "text-success bg-success/10",
};

export default function Analytics() {
  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Analytics</h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Recruitment insights and hiring performance.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <SummaryCard icon={FileText} label="Total Applications" value={summaryStats.totalApplications} />
          <SummaryCard icon={Star} label="Shortlisted" value={summaryStats.shortlisted} />
          <SummaryCard icon={Users} label="Interviews" value={summaryStats.interviews} />
          <SummaryCard icon={Send} label="Offers Sent" value={summaryStats.offersSent} />
          <SummaryCard icon={CheckCircle2} label="Offers Accepted" value={summaryStats.offersAccepted} />
          <SummaryCard icon={TrendingUp} label="Hiring Rate" value={summaryStats.hiringRate} suffix="%" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Applications per Month">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Hiring Funnel">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringFunnel} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Candidates by Department">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candidatesByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="candidates" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="AI Match Score Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Assessment Completion Rate">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assessmentCompletion}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {assessmentCompletion.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Interview Success Rate">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interviewSuccessRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="successRate" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => {
              const Icon = ACTIVITY_ICON[item.type];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="flex items-start gap-3"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${ACTIVITY_COLOR[item.type]}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">
                      <span className="font-medium">{item.candidateName}</span> — {item.type}
                    </p>
                    <p className="text-xs text-ink-secondary">{item.detail}</p>
                  </div>
                  <span className="text-xs text-ink-secondary whitespace-nowrap">{item.timestamp}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>
    </DashboardLayout>
  );
}