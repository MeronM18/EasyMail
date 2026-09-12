/**
 * Pure retention-window calculations (SCHEMA.md retention defaults, DEC-009).
 * No env, no DB — kept separate from purge.ts so the policy itself is
 * directly unit-testable.
 */

export const MESSAGE_RETENTION_DAYS = 14;
export const BODY_RETENTION_DAYS = 7;

/** Messages received before this cutoff are eligible for hard delete. */
export function messageRetentionCutoff(now = new Date()): Date {
  return new Date(now.valueOf() - MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/** The `body_retained_until` value to store for a newly-synced message body. */
export function bodyRetentionDeadline(now = new Date()): Date {
  return new Date(now.valueOf() + BODY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}
