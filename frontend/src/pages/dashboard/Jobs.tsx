import { useEffect, useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { SummaryCards } from "../../components/jobs/SummaryCards";
import { JobSearchInput } from "../../components/jobs/JobSearchInput";
import { FilterBar, type JobFilters } from "../../components/jobs/FilterBar";
import { JobTable } from "../../components/jobs/JobTable";
import { JobCard } from "../../components/jobs/JobCard";
import { CreateJobModal } from "../../components/jobs/CreateJobModal";
import { JobDetailsDrawer } from "../../components/jobs/JobDetailsDrawer";
import { EmptyState } from "../../components/jobs/EmptyState";
import { SkeletonCards, SkeletonTable } from "../../components/jobs/LoadingSkeleton";
import { jobsMockData, type Job } from "../../constants/jobsMockData";

const EMPTY_FILTERS: JobFilters = {
  department: "",
  location: "",
  employmentType: "",
  status: "",
  experienceLevel: "",
};

export default function Jobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(jobsMockData);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment = !filters.department || job.department === filters.department;
      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesType = !filters.employmentType || job.employmentType === filters.employmentType;
      const matchesStatus = !filters.status || job.status === filters.status;
      const matchesLevel = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;

      return (
        matchesSearch && matchesDepartment && matchesLocation && matchesType && matchesStatus && matchesLevel
      );
    });
  }, [jobs, search, filters]);

  return (
    <DashboardLayout pageTitle="Jobs">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-ink">Jobs</h1>
            <p className="text-sm text-ink-secondary mt-1">Manage all job openings in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="!px-4 !py-2.5 text-sm"
              // TODO: Backend Integration — implement export
            >
              <Download size={15} className="mr-1.5" />
              Export
            </Button>
            <Button variant="primary" className="!px-4 !py-2.5 text-sm" onClick={() => setModalOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              Create Job
            </Button>
          </div>
        </div>

        {loading ? (
          <SkeletonCards />
        ) : (
          <SummaryCards jobs={jobs} />
        )}

        <div className="glass-card p-5 space-y-4">
          <JobSearchInput value={search} onChange={setSearch} />
          <FilterBar filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} />
        </div>

        {loading ? (
          <SkeletonTable />
        ) : filteredJobs.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <>
            <div className="hidden lg:block glass-card p-0 overflow-hidden">
              <JobTable
                jobs={filteredJobs}
                onView={setSelectedJob}
                onDelete={(id) => setJobs((prev) => prev.filter((j) => j.id !== id))}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 lg:hidden">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onView={setSelectedJob} />
              ))}
            </div>
          </>
        )}
      </div>

      <CreateJobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(job) => setJobs((prev) => [job, ...prev])}
      />
      <JobDetailsDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </DashboardLayout>
  );
}