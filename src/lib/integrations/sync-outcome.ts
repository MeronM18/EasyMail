/**
 * Pure sync-outcome decision, shared by the Gmail and Microsoft sync jobs
 * (Phase 12, G1). A genuinely empty result — nothing to fetch, nothing new
 * to store or classify — is a SUCCESSFUL sync, not a failure. Only actual
 * fetch/classify failures should ever mark the account `sync_error`.
 */

export type SyncOutcomeStatus = "active" | "sync_error";
export type SyncFinishOutcome = "succeeded" | "partial";

export type SyncAttemptCounts = {
  fetchFailed: number;
  classifyFailed: number;
};

export type SyncOutcome = {
  accountStatus: SyncOutcomeStatus;
  statusMessage: string | null;
  finishStatus: SyncFinishOutcome;
};

export function decideSyncOutcome(counts: SyncAttemptCounts): SyncOutcome {
  const hasFailure = counts.fetchFailed > 0 || counts.classifyFailed > 0;
  return {
    accountStatus: hasFailure ? "sync_error" : "active",
    // No claim of automatic retry — there is currently no mechanism that
    // retries a sync on its own; the account's existing "Connect" button is
    // the only way to trigger another attempt.
    statusMessage: hasFailure ? "The last sync only partially completed." : null,
    finishStatus: hasFailure ? "partial" : "succeeded",
  };
}
