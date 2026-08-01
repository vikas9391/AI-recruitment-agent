import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  CircleDot,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  assessments as initialAssessments,
  jobRoles,
  candidateNames,
  type Assessment,
  type AssessmentStatus,
  type AssessmentDifficulty,
} from "../../constants/assessmentsMockData";
import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  Pending: "bg-ink/5 text-ink-secondary border-ink/10",
  "In Progress": "bg-warning/10 text-warning border-warning/30",
  Completed: "bg-success/10 text-success border-success/30",
  Expired: "bg-danger/10 text-danger border-danger/30",
};

const DIFFICULTY_STYLES: Record<AssessmentDifficulty, string> = {
  Easy: "bg-success/10 text-success border-success/30",
  Medium: "bg-warning/10 text-warning border-warning/30",
  Hard: "bg-danger/10 text-danger border-danger/30",
};

function StatusBadge({ status }: { status: AssessmentStatus }) {
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

function DifficultyBadge({ difficulty }: { difficulty: AssessmentDifficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        DIFFICULTY_STYLES[difficulty]
      )}
    >
      {difficulty}
    </span>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
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
        <p className="text-xl font-bold text-ink">{value}</p>
      </div>
    </motion.div>
  );
}

const STATUS_OPTIONS: (AssessmentStatus | "all")[] = ["all", "Pending", "In Progress", "Completed", "Expired"];
const DIFFICULTY_OPTIONS: (AssessmentDifficulty | "all")[] = ["all", "Easy", "Medium", "Hard"];

interface CreateFormState {
  name: string;
  jobRole: string;
  candidate: string;
  difficulty: AssessmentDifficulty;
  duration: string;
  passingScore: string;
  questionCount: string;
  instructions: string;
}

const emptyForm: CreateFormState = {
  name: "",
  jobRole: "",
  candidate: "",
  difficulty: "Medium",
  duration: "",
  passingScore: "",
  questionCount: "",
  instructions: "",
};

export default function Assessments() {
  const [data] = useState<Assessment[]>(initialAssessments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<AssessmentDifficulty | "all">("all");

  const [viewing, setViewing] = useState<Assessment | null>(null);
  const [deleting, setDeleting] = useState<Assessment | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateFormState, string>>>({});

  const filtered = useMemo(() => {
    return data.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        a.jobRole.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesRole = roleFilter === "all" || a.jobRole === roleFilter;
      const matchesDifficulty = difficultyFilter === "all" || a.difficulty === difficultyFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesDifficulty;
    });
  }, [data, search, statusFilter, roleFilter, difficultyFilter]);

  const summary = useMemo(
    () => ({
      total: data.length,
      active: data.filter((a) => a.status === "In Progress").length,
      completed: data.filter((a) => a.status === "Completed").length,
      pending: data.filter((a) => a.status === "Pending").length,
    }),
    [data]
  );

  function updateForm<K extends keyof CreateFormState>(field: K, value: CreateFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateForm(): boolean {
    const errors: Partial<Record<keyof CreateFormState, string>> = {};
    if (!form.name.trim()) errors.name = "Assessment name is required";
    if (!form.jobRole.trim()) errors.jobRole = "Job role is required";
    if (!form.candidate.trim()) errors.candidate = "Candidate is required";
    if (!form.duration || Number(form.duration) <= 0) errors.duration = "Enter a valid duration";
    if (!form.passingScore || Number(form.passingScore) < 0 || Number(form.passingScore) > 100)
      errors.passingScore = "Enter a score between 0–100";
    if (!form.questionCount || Number(form.questionCount) <= 0) errors.questionCount = "Enter a valid question count";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO: Backend Integration — persist new assessment via API.
    setCreateOpen(false);
    setForm(emptyForm);
    setFormErrors({});
  }

  return (
    <DashboardLayout pageTitle="Assessments">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Assessments</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              Manage candidate assessments and monitor progress.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-ink text-white px-4 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors w-fit"
          >
            <Plus size={16} />
            Create Assessment
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryCard icon={ClipboardList} label="Total Assessments" value={summary.total} />
          <SummaryCard icon={CircleDot} label="Active Assessments" value={summary.active} />
          <SummaryCard icon={CheckCircle2} label="Completed" value={summary.completed} />
          <SummaryCard icon={Clock} label="Pending" value={summary.pending} />
        </div>

        {/* Search + filters */}
        <div className="glass-card p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate, assessment, or role..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssessmentStatus | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              <option value="all">All job roles</option>
              {jobRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as AssessmentDifficulty | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All difficulties" : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="border-b border-glass-border text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Assessment Name</th>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Job Role</th>
                  <th className="px-4 py-3 font-medium">Difficulty</th>
                  <th className="px-4 py-3 font-medium">Questions</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-glass-border last:border-0 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{a.candidateName}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{a.jobRole}</td>
                    <td className="px-4 py-3">
                      <DifficultyBadge difficulty={a.difficulty} />
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{a.questionCount}</td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{a.durationMinutes} min</td>
                    <td className="px-4 py-3">
                      {a.score !== null ? (
                        <span
                          className={cn(
                            "font-semibold",
                            a.score >= a.passingScore ? "text-success" : "text-danger"
                          )}
                        >
                          {a.score}%
                        </span>
                      ) : (
                        <span className="text-ink-secondary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{a.createdDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewing(a)}
                          title="View"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-ink hover:bg-white transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          title="Edit"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-ink hover:bg-white transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleting(a)}
                          title="Delete"
                          className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-danger hover:bg-danger/5 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-ink-secondary">
                      No assessments match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Backend Integration */}
      </div>

      {/* View drawer */}
      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewing(null)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md glass-card rounded-l-3xl rounded-r-none p-6 overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">{viewing.name}</h3>
                  <p className="text-sm text-ink-secondary">{viewing.candidateName}</p>
                </div>
                <button
                  onClick={() => setViewing(null)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-white/60"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div>
                  <p className="text-xs text-ink-secondary">Job Role</p>
                  <p className="font-medium text-ink">{viewing.jobRole}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Difficulty</p>
                  <DifficultyBadge difficulty={viewing.difficulty} />
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Question Count</p>
                  <p className="font-medium text-ink">{viewing.questionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Duration</p>
                  <p className="font-medium text-ink">{viewing.durationMinutes} min</p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Passing Score</p>
                  <p className="font-medium text-ink">{viewing.passingScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Current Score</p>
                  <p className="font-medium text-ink">
                    {viewing.score !== null ? `${viewing.score}%` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Completion Status</p>
                  <StatusBadge status={viewing.status} />
                </div>
                <div>
                  <p className="text-xs text-ink-secondary">Submission Time</p>
                  <p className="font-medium text-ink">{viewing.submissionTime ?? "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink mb-2">Question Summary</p>
                <div className="space-y-2">
                  {viewing.questionSummary.map((q) => (
                    <div
                      key={q.topic}
                      className="flex items-center justify-between rounded-xl bg-ink/5 px-3 py-2 text-sm"
                    >
                      <span className="text-ink-secondary">{q.topic}</span>
                      <span className="font-medium text-ink">{q.count} questions</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleting(null)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative glass-card p-6 w-full max-w-sm"
            >
              <h3 className="text-base font-bold text-ink">Delete assessment?</h3>
              <p className="text-sm text-ink-secondary mt-1.5">
                This will remove <span className="font-medium text-ink">{deleting.name}</span> for{" "}
                {deleting.candidateName}. This action cannot be undone.
              </p>
              {/* TODO: Backend Integration — wire delete confirmation to API */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-ink hover:bg-white/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 rounded-full bg-danger text-white px-4 py-2.5 text-sm font-medium hover:bg-danger/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create assessment modal */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateOpen(false)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-ink">Create Assessment</h3>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-white/60"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Assessment Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. Frontend Developer Test"
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                      formErrors.name ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                    )}
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-danger">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Job Role</label>
                    <input
                      value={form.jobRole}
                      onChange={(e) => updateForm("jobRole", e.target.value)}
                      placeholder="e.g. Backend Developer"
                      className={cn(
                        "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                        formErrors.jobRole ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                      )}
                    />
                    {formErrors.jobRole && <p className="mt-1 text-xs text-danger">{formErrors.jobRole}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Candidate</label>
                    <input
                      value={form.candidate}
                      onChange={(e) => updateForm("candidate", e.target.value)}
                      placeholder="Candidate name"
                      list="candidate-options"
                      className={cn(
                        "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                        formErrors.candidate ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                      )}
                    />
                    <datalist id="candidate-options">
                      {candidateNames.map((n) => (
                        <option key={n} value={n} />
                      ))}
                    </datalist>
                    {formErrors.candidate && <p className="mt-1 text-xs text-danger">{formErrors.candidate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => updateForm("difficulty", e.target.value as AssessmentDifficulty)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-accent-blue"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Duration (min)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.duration}
                      onChange={(e) => updateForm("duration", e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                        formErrors.duration ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                      )}
                    />
                    {formErrors.duration && <p className="mt-1 text-xs text-danger">{formErrors.duration}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Passing Score (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.passingScore}
                      onChange={(e) => updateForm("passingScore", e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                        formErrors.passingScore ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                      )}
                    />
                    {formErrors.passingScore && (
                      <p className="mt-1 text-xs text-danger">{formErrors.passingScore}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Question Count</label>
                  <input
                    type="number"
                    min={1}
                    value={form.questionCount}
                    onChange={(e) => updateForm("questionCount", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
                      formErrors.questionCount ? "border-red-400" : "border-gray-200 focus:border-accent-blue"
                    )}
                  />
                  {formErrors.questionCount && (
                    <p className="mt-1 text-xs text-danger">{formErrors.questionCount}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Instructions</label>
                  <textarea
                    value={form.instructions}
                    onChange={(e) => updateForm("instructions", e.target.value)}
                    rows={3}
                    placeholder="Instructions shown to the candidate before starting..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/40 resize-none"
                  />
                </div>

                {/* TODO: Backend Integration — submit new assessment to API */}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateOpen(false);
                      setForm(emptyForm);
                      setFormErrors({});
                    }}
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-ink hover:bg-white/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-ink text-white px-4 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
                  >
                    Create Assessment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}