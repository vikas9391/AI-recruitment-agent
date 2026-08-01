import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Mail, Phone, GraduationCap, Sparkles } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import type { CandidateDetail, CandidateStatus } from "../../types/candidate";
import { fetchCandidateDetail } from "../../lib/candidatesApi";
import { getApiErrorMessage } from "../../lib/apiClient";
import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  Applied: "bg-ink/5 text-ink-secondary border-ink/10",
  Processing: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  "Under Review": "bg-warning/10 text-warning border-warning/30",
  Shortlisted: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  Hired: "bg-success/10 text-success border-success/30",
  Rejected: "bg-danger/10 text-danger border-danger/30",
  Failed: "bg-danger/10 text-danger border-danger/30",
  Withdrawn: "bg-ink/5 text-ink-secondary border-ink/10",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function ResumeViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No candidate specified.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchCandidateDetail(id)
      .then((data) => {
        if (!cancelled) setCandidate(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Failed to load candidate."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Resume Viewer">
        <p className="text-sm text-ink-secondary">Loading candidate...</p>
      </DashboardLayout>
    );
  }

  if (error || !candidate) {
    return (
      <DashboardLayout pageTitle="Resume Viewer">
        <p className="text-sm text-danger bg-danger/10 rounded-xl px-4 py-2.5 inline-block">
          {error || "Candidate not found."}
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Resume Viewer">
      <div className="space-y-4">
        <button
          onClick={() => navigate("/dashboard/candidates")}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-ink"
        >
          <ArrowLeft size={15} />
          Back to Candidates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
          {/* Left: resume preview */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink">Resume Preview</h3>
              <a
                href={candidate.resumeUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-ink hover:bg-white/60",
                  !candidate.resumeUrl && "pointer-events-none opacity-40"
                )}
              >
                <Download size={13} />
                Download
              </a>
            </div>

            <div className="flex-1 min-h-[480px] rounded-2xl border border-dashed border-gray-300 bg-white/60 flex flex-col items-center justify-center gap-3 text-center px-6">
              <FileText size={40} className="text-ink-secondary" />
              <p className="text-sm font-medium text-ink">{candidate.resumeFileName}</p>
              <p className="text-xs text-ink-secondary max-w-[240px]">
                {candidate.resumeUrl
                  ? "In-browser PDF preview isn't wired up yet — use Download to open the file."
                  : "No resume file on this application."}
              </p>
            </div>
          </motion.div>

          {/* Right: candidate info */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">{candidate.name}</h2>
                  <p className="text-sm text-ink-secondary">{candidate.appliedJob}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                    STATUS_STYLES[candidate.status]
                  )}
                >
                  {candidate.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-ink-secondary">
                  <Mail size={14} />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2 text-ink-secondary">
                  <Phone size={14} />
                  {candidate.phone}
                </div>
                <div className="flex items-center gap-2 text-ink-secondary">
                  <GraduationCap size={14} />
                  {candidate.experienceLabel} experience
                </div>
                <div className="flex items-center gap-2 font-semibold text-success">
                  <Sparkles size={14} />
                  {candidate.matchScore}% AI Match
                </div>
              </div>
            </div>

            <Section title="Education">
              <p className="text-sm text-ink-secondary">{candidate.education}</p>
            </Section>

            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <span key={s} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Projects">
              {candidate.projects.length > 0 ? (
                <ul className="space-y-1.5">
                  {candidate.projects.map((project) => (
                    <li key={project} className="text-sm text-ink-secondary">
                      • {project}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-secondary">No projects listed.</p>
              )}
            </Section>

            <Section title="Certifications">
              {candidate.certifications.length > 0 ? (
                <ul className="space-y-1.5">
                  {candidate.certifications.map((cert) => (
                    <li key={cert} className="text-sm text-ink-secondary">
                      • {cert}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-secondary">No certifications listed.</p>
              )}
            </Section>

            <Section title="AI Summary">
              <p className="text-sm text-ink-secondary leading-relaxed">{candidate.aiSummary}</p>
            </Section>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}