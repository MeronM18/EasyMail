import "server-only";
import { AppError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/admin";

export type SyncTrigger = "onboarding" | "cron" | "manual";
export type SyncFinishStatus = "succeeded" | "failed" | "partial";

/**
 * Starts a `sync_runs` row for a mail account. The DB's partial unique index
 * (`sync_runs_one_active_per_account_idx`, one queued|running row per
 * account) is the idempotency guard against overlapping syncs — a conflict
 * here means a sync is already in flight, not a bug to retry past.
 */
export async function startSyncRun(params: {
  userId: string;
  mailAccountId: string;
  trigger: SyncTrigger;
}): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sync_runs")
    .insert({
      user_id: params.userId,
      mail_account_id: params.mailAccountId,
      trigger: params.trigger,
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new AppError(
      "INTEGRATION_ERROR",
      "A sync is already in progress for this mailbox.",
    );
  }

  return data.id;
}

export async function finishSyncRun(
  syncRunId: string,
  status: SyncFinishStatus,
  stats: Record<string, number>,
  errorSummary?: string,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("sync_runs")
    .update({
      status,
      stats,
      error_summary: errorSummary ?? null,
      finished_at: new Date().toISOString(),
    })
    .eq("id", syncRunId);
}
