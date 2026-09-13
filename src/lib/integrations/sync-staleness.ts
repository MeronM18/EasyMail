/**
 * Pure sync-run staleness policy (Phase 12, G5). No network, no env — kept
 * separate from sync-runs.ts (which is server-only, since it holds the
 * service-role DB client) so the staleness decision itself is directly
 * unit-testable, matching this codebase's message-parser.ts/retention.ts
 * pattern.
 */

/**
 * How long a `queued`/`running` sync run may sit without finishing before
 * it's considered abandoned (the process was killed/timed out rather than
 * completing normally) — not a bug to retry past, but not a legitimate
 * in-flight sync either. Set comfortably above Vercel's default 300s
 * function ceiling so a genuinely still-running sync is never reaped.
 */
export const STALE_SYNC_RUN_THRESHOLD_MS = 10 * 60 * 1000;

export function staleSyncRunCutoff(now = new Date()): Date {
  return new Date(now.valueOf() - STALE_SYNC_RUN_THRESHOLD_MS);
}

export function isSyncRunStale(startedAt: Date, now = new Date()): boolean {
  return startedAt.valueOf() < staleSyncRunCutoff(now).valueOf();
}
