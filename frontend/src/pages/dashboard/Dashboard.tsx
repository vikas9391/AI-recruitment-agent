import { lazy, Suspense, memo } from "react";
import { Briefcase, Users, CalendarPlus, BarChart3 } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { StatCard } from "../../components/ui/StatCard";
import { ActivityCard } from "../../components/ui/ActivityCard";
import { PipelineCard } from "../../components/ui/PipelineCard";
import { QuickActionCard } from "../../components/ui/QuickActionCard";
import { CandidatePreviewCard } from "../../components/ui/CandidatePreviewCard";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import {
  dashboardStats,
  upcomingInterviews,
  topCandidates,
} from "../../constants/mockData";

const DashboardCharts = lazy(() => import("../../components/sections/DashboardCharts"));

interface Interview {
  id: number;
  candidate: string;
  position: string;
  date: string;
  status: string;
}

const quickActions = [
  { icon: Briefcase, label: "Post a Job", description: "Create a new job opening" },
  { icon: Users, label: "Review Candidates", description: "Screen top-ranked applicants" },
  { icon: CalendarPlus, label: "Schedule Interview", description: "Book a slot with a candidate" },
  { icon: BarChart3, label: "View Analytics", description: "See hiring performance" },
];

function DashboardHome() {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="glass-card p-6">
          <h1 className="text-xl font-bold text-ink">Welcome back 👋</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Here's what's happening with your hiring pipeline today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dashboardStats.map((stat, i) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              growth={stat.growth}
              icon={stat.icon}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* Charts */}
        <Suspense fallback={<div className="h-[220px] rounded-2xl bg-ink/5 animate-pulse" />}>
          <DashboardCharts />
        </Suspense>

        {/* Activity + Pipeline */}
        <div className="grid lg:grid-cols-2 gap-4">
          <ActivityCard />
          <PipelineCard />
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.label} {...action} />
            ))}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Upcoming Interviews</h3>
          <Table<Interview>
            columns={[
              { key: "candidate", header: "Candidate", render: (r) => r.candidate },
              { key: "position", header: "Position", render: (r) => r.position },
              { key: "date", header: "Date", render: (r) => r.date },
              { key: "status", header: "Status", render: (r) => <Badge label={r.status} /> },
            ]}
            data={[...upcomingInterviews]}
            rowKey={(r) => r.id}
          />
        </div>

        {/* Top candidates */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Top Candidates</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {topCandidates.map((c, i) => (
              <CandidatePreviewCard
                key={c.id}
                name={c.name}
                role={c.role}
                matchScore={c.matchScore}
                experience={c.experience}
                skills={c.skills}
                status={c.status}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Dashboard = memo(DashboardHome);