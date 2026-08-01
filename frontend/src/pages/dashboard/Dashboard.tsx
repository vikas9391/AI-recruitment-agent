import { lazy, Suspense, memo, useEffect, useState } from "react";
import { Briefcase, Users, CalendarPlus, BarChart3 } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { StatCard } from "../../components/ui/StatCard";
import { ActivityCard } from "../../components/ui/ActivityCard";
import { PipelineCard } from "../../components/ui/PipelineCard";
import { QuickActionCard } from "../../components/ui/QuickActionCard";
import { CandidatePreviewCard } from "../../components/ui/CandidatePreviewCard";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { fetchDashboardOverview, fetchUpcomingInterviews } from "../../lib/dashboardApi";
import { fetchCandidates } from "../../lib/candidatesApi";
import type { DashboardKPIs, UpcomingInterviewItem } from "../../types/dashboard";
import type { CandidateListItem } from "../../types/candidate";

const DashboardCharts = lazy(() => import("../../components/sections/DashboardCharts"));

const quickActions = [
  { icon: Briefcase, label: "Post a Job", description: "Create a new job opening" },
  { icon: Users, label: "Review Candidates", description: "Screen top-ranked applicants" },
  { icon: CalendarPlus, label: "Schedule Interview", description: "Book a slot with a candidate" },
  { icon: BarChart3, label: "View Analytics", description: "See hiring performance" },
];

// Stat cards, mapped from real overview KPIs. There's no "Offers" concept
// on the backend (no Offer model / status), so it's replaced with average
// resume score — a real number instead of a fabricated one. None of these
// have a growth/trend badge because the backend doesn't track historical
// comparisons yet (see StatCard's `growth` prop).
function buildStats(kpis: DashboardKPIs) {
  return [
    { id: "active-jobs", label: "Active Jobs", value: kpis.openJobs, icon: "Briefcase" },
    { id: "applications", label: "Applications", value: kpis.totalApplications, icon: "FileText" },
    { id: "shortlisted", label: "Shortlisted", value: kpis.shortlistedApplications, icon: "ListChecks" },
    { id: "interviews", label: "Interviews", value: kpis.interviewsScheduled, icon: "CalendarClock" },
    { id: "hired", label: "Hired", value: kpis.hiredApplications, icon: "UserCheck" },
    { id: "avg-score", label: "Avg Resume Score", value: Math.round(kpis.averageResumeScore), icon: "Gauge" },
  ];
}

function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReturnType<typeof buildStats>>([]);
  const [interviews, setInterviews] = useState<UpcomingInterviewItem[]>([]);
  const [topCandidates, setTopCandidates] = useState<CandidateListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchDashboardOverview(),
      fetchUpcomingInterviews(4),
      fetchCandidates({ ordering: "-score__overall_score", page: 1 }),
    ])
      .then(([kpis, interviewData, candidateData]) => {
        if (cancelled) return;
        setStats(buildStats(kpis));
        setInterviews(interviewData);
        setTopCandidates(candidateData.candidates.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) {
          setStats([]);
          setInterviews([]);
          setTopCandidates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[104px] rounded-2xl bg-ink/5 animate-pulse" />
              ))
            : stats.map((stat, i) => (
                <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} delay={i * 0.05} />
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
          {loading ? (
            <div className="h-32 rounded-2xl bg-ink/5 animate-pulse" />
          ) : interviews.length === 0 ? (
            <p className="text-sm text-ink-secondary">No interviews scheduled.</p>
          ) : (
            <Table<UpcomingInterviewItem>
              columns={[
                { key: "candidate", header: "Candidate", render: (r) => r.candidate },
                { key: "position", header: "Position", render: (r) => r.position },
                { key: "date", header: "Date", render: (r) => r.date },
                { key: "status", header: "Status", render: (r) => <Badge label={r.status} /> },
              ]}
              data={interviews}
              rowKey={(r) => r.id}
            />
          )}
        </div>

        {/* Top candidates */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Top Candidates</h3>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[220px] rounded-2xl bg-ink/5 animate-pulse" />
              ))}
            </div>
          ) : topCandidates.length === 0 ? (
            <p className="text-sm text-ink-secondary">No candidates yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {topCandidates.map((c, i) => (
                <CandidatePreviewCard
                  key={c.id}
                  name={c.name}
                  role={c.appliedJob}
                  matchScore={c.matchScore}
                  experience={c.experienceLabel}
                  skills={c.skills}
                  status={c.status}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Dashboard = memo(DashboardHome);
