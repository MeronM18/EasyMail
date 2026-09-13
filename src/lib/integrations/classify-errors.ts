/**
 * Pure classification-error handling (Phase 12, G3). No network, no
 * server-only dependency — kept separate from classify.ts (which is
 * server-only, since it calls the AI Gateway and the DB) so the transient
 * classification and repair-parsing logic is directly unit-testable.
 */
import { APICallError, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { intents } from "@/lib/intent";

/**
 * Structured classification (ARCHITECTURE.md): intent enum + short reason +
 * optional action signal. The message body is untrusted user-facing content,
 * never treated as instructions — the schema constrains the model's output
 * regardless of what the email itself says.
 */
export const classificationSchema = z.object({
  intent: z.enum(intents),
  reason: z.string().max(160),
  actionSignal: z.string().max(160).nullable(),
});

export type Classification = z.infer<typeof classificationSchema>;

/**
 * True only for failures reasonably considered transient: the AI SDK's own
 * `APICallError.isRetryable` already encodes rate limiting (429) and
 * upstream/server errors (5xx) versus a genuine client error; a bare
 * `TypeError` is how a fetch-level network interruption (e.g. undici's
 * "fetch failed") typically surfaces with no HTTP response to build an
 * `APICallError` from. A malformed/invalid structured-output response
 * (`NoObjectGeneratedError`) is a deterministic modeling issue, not a
 * transport failure — it goes through `tryRepairNoObjectGenerated` instead,
 * never blind retry. Anything else unrecognized is treated as non-transient
 * rather than retried blindly.
 */
export function isTransientClassifyError(error: unknown): boolean {
  if (APICallError.isInstance(error)) return error.isRetryable;
  if (NoObjectGeneratedError.isInstance(error)) return false;
  return error instanceof TypeError;
}

/**
 * Providers reliably enforce the intent enum in structured output, but
 * string length limits (`reason`/`actionSignal`, max 160) are not strictly
 * enforced at the token level by any provider — a response a few characters
 * over is a known near-miss, not a real classification failure. Repairs by
 * truncating and re-validating rather than discarding an otherwise-good
 * classification; the schema itself is unchanged. Returns `undefined`
 * (never throws) when the error isn't this specific, repairable case.
 */
export function tryRepairNoObjectGenerated(error: unknown): Classification | undefined {
  if (!(NoObjectGeneratedError.isInstance(error) && error.text)) return undefined;
  try {
    const raw = JSON.parse(error.text) as Record<string, unknown>;
    if (typeof raw.reason === "string" && raw.reason.length > 160) {
      raw.reason = raw.reason.slice(0, 160);
    }
    if (typeof raw.actionSignal === "string" && raw.actionSignal.length > 160) {
      raw.actionSignal = raw.actionSignal.slice(0, 160);
    }
    return classificationSchema.parse(raw);
  } catch {
    return undefined;
  }
}
