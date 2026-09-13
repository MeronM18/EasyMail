/**
 * Generic bounded retry-with-backoff (Phase 12, G3). No network, no
 * provider-specific knowledge, no server-only dependency — this only calls
 * whatever async function it's given, so it's directly unit-testable with a
 * plain mock function.
 */

export type RetryOptions<T> = {
  /** Total attempts, including the first — always ≥ 1. */
  maxAttempts: number;
  /** Base delay for exponential backoff: attempt N waits baseDelayMs * 2^N. */
  baseDelayMs: number;
  /** Only errors this accepts are retried; anything else is thrown immediately. */
  isTransient: (error: unknown) => boolean;
  /**
   * Optional escape hatch checked before the transient check on every
   * failure: if it returns a value (including a falsy one, but not
   * `undefined`), that value is returned immediately — no retry, no throw.
   * Used for a deterministic repair path (e.g. malformed structured output)
   * that isn't "retry the request" but also isn't a hard failure.
   */
  recover?: (error: unknown) => T | undefined;
  onRetry?: (attempt: number, delayMs: number, error: unknown) => void;
};

export async function retryTransient<T>(
  fn: () => Promise<T>,
  options: RetryOptions<T>,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < options.maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const recovered = options.recover?.(error);
      if (recovered !== undefined) return recovered;

      const isLastAttempt = attempt === options.maxAttempts - 1;
      if (!options.isTransient(error) || isLastAttempt) {
        throw error;
      }

      const delayMs = options.baseDelayMs * 2 ** attempt;
      options.onRetry?.(attempt, delayMs, error);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
