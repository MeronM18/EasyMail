import "server-only";
import { AppError } from "@/lib/errors";
import { isSyncRunStale } from "@/lib/integrations/sync-staleness";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/admin";

export type SyncTrigger = "onboarding" | "cron" | "manual";
export type SyncFinishStatus = "succeeded" | "failed" | "partial";

/**
 * Marks any genuinely stale `queued`/`running` run for this account as
 * `failed` so `startSyncRun` can proceed. Best-effort: a failure here just
 * means `startSyncRun` falls through to its existing "already in progress"
 * error, which is always a safe outcome — never silently drops the
 * uniqueness guarantee.
 */
async function reapStaleSyncRuns(mailAccountId: string, now = new Date()): Promise<void> {
  const supabase = createServiceClient();
  const { data: activeRuns, error } = await supabase
    .from("sync_runs")
    .select("id, started_at")
    .eq("mail_account_id", mailAccountId)
    .in("status", ["queued", "running"]);

  if (error) {
    logger.warn("sync_runs.stale_check_failed", {
      mailAccountId,
      error: error.message,
    });
    return;
  }

  const staleIds = (activeRuns ?? [])
    .filter((run) => isSyncRunStale(new Date(run.started_at), now))
    .map((run) => run.id);

  if (staleIds.length === 0) return;

  const { error: updateError } = await supabase
    .from("sync_runs")
    .update({
      status: "failed",
      error_summary:
        "Reaped as stale: the sync did not report completion within the expected time (likely a killed or timed-out run).",
      finished_at: now.toISOString(),
    })
    .in("id", staleIds);

  if (updateError) {
    logger.warn("sync_runs.stale_reap_failed", {
      mailAccountId,
      error: updateError.message,
    });
    return;
  }

  logger.info("sync_runs.stale_reaped", { mailAccountId, count: staleIds.length });
}

/**
 * Starts a `sync_runs` row for a mail account. The DB's partial unique index
 * (`sync_runs_one_active_per_account_idx`, one queued|running row per
 * account) is the idempotency guard against overlapping syncs — a conflict
 * here means a sync is already in flight, not a bug to retry past. Before
 * attempting the insert, any run for this account that has been stuck
 * `queued`/`running` past `STALE_SYNC_RUN_THRESHOLD_MS` is reaped so a
 * killed/timed-out prior run can't permanently block this account's sync.
 */
export async function startSyncRun(params: {
  userId: string;
  mailAccountId: string;
  trigger: SyncTrigger;
}): Promise<string> {
  await reapStaleSyncRuns(params.mailAccountId);

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
