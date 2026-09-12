import "server-only";
import { messageRetentionCutoff } from "@/lib/integrations/retention";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/admin";

export type PurgeResult = {
  bodiesScrubbed: number;
  messagesDeleted: number;
  oauthStatesDeleted: number;
};

/**
 * Enforces SCHEMA.md's retention defaults: scrub message bodies past their
 * stored 7-day deadline, hard-delete messages past the 14-day window
 * (cascades classifications/corrections), and clear expired OAuth CSRF
 * state rows. Safe to call repeatedly — every predicate is idempotent.
 */
export async function purgeExpiredMailData(now = new Date()): Promise<PurgeResult> {
  const supabase = createServiceClient();
  const nowIso = now.toISOString();

  const { data: scrubbed, error: scrubError } = await supabase
    .from("messages")
    .update({ body_text: null, body_retained_until: null })
    .lt("body_retained_until", nowIso)
    .not("body_text", "is", null)
    .select("id");

  if (scrubError) {
    logger.error("purge.body_scrub_failed", { error: scrubError.message });
  }

  const { data: deletedMessages, error: deleteError } = await supabase
    .from("messages")
    .delete()
    .lt("received_at", messageRetentionCutoff(now).toISOString())
    .select("id");

  if (deleteError) {
    logger.error("purge.message_delete_failed", { error: deleteError.message });
  }

  const { data: deletedStates, error: stateError } = await supabase
    .from("oauth_states")
    .delete()
    .lt("expires_at", nowIso)
    .select("state");

  if (stateError) {
    logger.error("purge.oauth_state_delete_failed", { error: stateError.message });
  }

  const result: PurgeResult = {
    bodiesScrubbed: scrubbed?.length ?? 0,
    messagesDeleted: deletedMessages?.length ?? 0,
    oauthStatesDeleted: deletedStates?.length ?? 0,
  };

  logger.info("purge.completed", result);
  return result;
}
