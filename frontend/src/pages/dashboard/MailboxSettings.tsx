import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { getMailboxStatus, getGmailConnectUrl, type MailboxStatus } from "../../lib/mailboxApi";
import { getApiErrorMessage } from "../../lib/apiClient";

const ERROR_MESSAGES: Record<string, string> = {
  error: "Google returned an error before authorization completed.",
  missing_params: "The redirect from Google was missing required parameters.",
  invalid_state: "This connection attempt expired or was tampered with. Please try again.",
  exchange_failed: "Google accepted the login, but the backend couldn't exchange it for a token. Check the Django server logs.",
};

export default function MailboxSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<MailboxStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const loadStatus = () => {
    setLoading(true);
    getMailboxStatus()
      .then(setStatus)
      .catch((err) => toast.error(getApiErrorMessage(err, "Couldn't load mailbox status.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle the ?status=connected|error&reason=... the backend redirects to
  // after the Google OAuth consent screen.
  useEffect(() => {
    const redirectStatus = searchParams.get("status");
    if (!redirectStatus) return;

    if (redirectStatus === "connected") {
      toast.success("Gmail connected! Resumes emailed to this inbox will now be auto-pulled on job creation.");
      loadStatus();
    } else if (redirectStatus === "error") {
      const reason = searchParams.get("reason") ?? "error";
      toast.error(ERROR_MESSAGES[reason] ?? `Couldn't connect Gmail (${reason}).`);
    }

    // Clean the query params out of the URL so a refresh doesn't re-toast.
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const url = await getGmailConnectUrl();
      window.location.href = url;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't start Gmail connection."));
      setConnecting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Mailbox">
      <div className="space-y-4 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-ink">Resume Inbox</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Connect a Gmail inbox so resume emails matching a job's title (or "Job ID &lt;id&gt;" in the
            subject) are automatically screened when the job is created.
          </p>
        </div>

        <div className="glass-card p-5 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <Loader2 size={16} className="animate-spin" />
              Checking connection status...
            </div>
          ) : status?.connected ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink">Connected as {status.gmail_address}</p>
                <p className="text-xs text-ink-secondary mt-1">
                  {status.last_synced_at
                    ? `Last synced ${new Date(status.last_synced_at).toLocaleString()}`
                    : "Not synced yet — create or open a job to trigger the first pull."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <XCircle size={20} className="text-ink-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink">No mailbox connected</p>
                <p className="text-xs text-ink-secondary mt-1">
                  Job creation will still succeed, but no resumes will be auto-pulled from email.
                </p>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            className="!px-4 !py-2.5 text-sm"
            onClick={handleConnect}
            isLoading={connecting}
          >
            <Mail size={15} className="mr-1.5" />
            {status?.connected ? "Reconnect Gmail" : "Connect Gmail"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
