import { apiClient, type ApiEnvelope } from "./apiClient";

export interface MailboxStatus {
  connected: boolean;
  gmail_address?: string;
  is_active?: boolean;
  last_synced_at?: string | null;
  created_at?: string;
}

export interface ResumeIngestionSummary {
  attempted: boolean;
  found: number;
  created: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export async function getMailboxStatus(): Promise<MailboxStatus> {
  const { data } = await apiClient.get<ApiEnvelope<MailboxStatus>>("/mailbox/status/");
  return data.data;
}

export async function getGmailConnectUrl(): Promise<string> {
  const { data } = await apiClient.get<ApiEnvelope<{ authorization_url: string }>>("/mailbox/connect/");
  return data.data.authorization_url;
}

export async function pullResumesForJob(jobId: string): Promise<ResumeIngestionSummary> {
  const { data } = await apiClient.post<ApiEnvelope<ResumeIngestionSummary>>(
    `/mailbox/jobs/${jobId}/pull-resumes/`
  );
  return data.data;
}
