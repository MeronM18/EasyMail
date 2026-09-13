/**
 * Thrown by `startSyncRun` when another sync for the same account is
 * already `queued`/`running` (Phase 12, G6) — a legitimate concurrency
 * conflict enforced by the DB's unique index, not a bug. Distinct from the
 * generic `AppError("INTEGRATION_ERROR", ...)` so callers (specifically the
 * OAuth callback routes) can tell "a sync is already in flight" apart from
 * an actual failure — the two need different handling: an account that was
 * just successfully connected/upserted, but lost a race to sync itself
 * because another sync is already running, is NOT a connection failure.
 */
export class SyncAlreadyInProgressError extends Error {
  constructor(message = "A sync is already in progress for this mailbox.") {
    super(message);
    this.name = "SyncAlreadyInProgressError";
  }
}
