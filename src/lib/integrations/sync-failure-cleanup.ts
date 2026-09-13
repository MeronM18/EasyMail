import "server-only";
import {
  markMailAccountStatus,
  type MailAccountStatus,
} from "@/lib/integrations/mail-accounts";
import { finishSyncRun } from "@/lib/integrations/sync-runs";
import { logger } from "@/lib/logger";

/**
 * Best-effort failure cleanup for a sync attempt (Phase 12, G8): records the
 * account status and finishes the `sync_runs` row, but a secondary DB
 * failure here is only logged — it never masks, replaces, or interrupts
 * reporting of the original sync failure the caller is already handling.
 * Each step is independent, so one failing doesn't skip the other.
 */
export async function recordSyncFailure(params: {
  mailAccountId: string;
  userId: string;
  syncRunId: string;
  accountStatus: MailAccountStatus;
  statusMessage: string;
  errorSummary: string;
}): Promise<void> {
  try {
    await markMailAccountStatus(
      params.mailAccountId,
      params.userId,
      params.accountStatus,
      params.statusMessage,
    );
  } catch (cleanupError) {
    logger.warn("sync.cleanup.status_update_failed", {
      mailAccountId: params.mailAccountId,
      error: cleanupError instanceof Error ? cleanupError.message : "unknown error",
    });
  }

  try {
    await finishSyncRun(params.syncRunId, "failed", {}, params.errorSummary);
  } catch (cleanupError) {
    logger.warn("sync.cleanup.finish_run_failed", {
      mailAccountId: params.mailAccountId,
      error: cleanupError instanceof Error ? cleanupError.message : "unknown error",
    });
  }
}
