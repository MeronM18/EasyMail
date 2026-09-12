import "server-only";
import { AppError } from "@/lib/errors";
import { classifyPendingMessages } from "@/lib/integrations/classify";
import {
  getGmailMessage,
  listGmailMessageIds,
} from "@/lib/integrations/google/gmail-client";
import {
  buildGmailWebLink,
  extractBodyText,
  getHeader,
  parseFromHeader,
} from "@/lib/integrations/google/message-parser";
import { refreshGoogleAccessToken } from "@/lib/integrations/google/oauth";
import {
  loadGoogleAccountForSync,
  markMailAccountStatus,
  markMailAccountSynced,
  storeGoogleAccessToken,
  type MailAccountForSync,
} from "@/lib/integrations/mail-accounts";
import { bodyRetentionDeadline } from "@/lib/integrations/retention";
import {
  finishSyncRun,
  startSyncRun,
  type SyncTrigger,
} from "@/lib/integrations/sync-runs";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/admin";

const SYNC_WINDOW_DAYS = 14;
const MAX_MESSAGES_PER_SYNC = 300;
const ACCESS_TOKEN_REFRESH_MARGIN_MS = 2 * 60 * 1000;

async function ensureFreshAccessToken(account: MailAccountForSync): Promise<string> {
  if (
    account.accessToken &&
    account.accessTokenExpiresAt &&
    account.accessTokenExpiresAt.valueOf() - Date.now() >= ACCESS_TOKEN_REFRESH_MARGIN_MS
  ) {
    return account.accessToken;
  }

  const refreshed = await refreshGoogleAccessToken(account.refreshToken);
  await storeGoogleAccessToken(
    account.id,
    account.userId,
    refreshed.accessToken,
    refreshed.expiresAt,
  );
  return refreshed.accessToken;
}

export type GmailSyncResult = {
  fetched: number;
  stored: number;
  classified: number;
  classifyFailed: number;
};

/**
 * Initial (rolling-window) sync for one Gmail account: list recent message
 * ids, fetch + store each one, then classify everything left pending.
 * Idempotent — re-running is safe: `messages` upserts skip existing rows
 * (`ignoreDuplicates`) via the `(mail_account_id, provider_message_id)`
 * unique constraint, and `sync_runs`'s partial unique index blocks overlap.
 */
export async function syncGmailAccount(
  mailAccountId: string,
  trigger: SyncTrigger,
): Promise<GmailSyncResult> {
  const account = await loadGoogleAccountForSync(mailAccountId);
  const syncRunId = await startSyncRun({
    userId: account.userId,
    mailAccountId: account.id,
    trigger,
  });

  try {
    const accessToken = await ensureFreshAccessToken(account);
    const supabase = createServiceClient();

    const afterUnixSeconds = Math.floor(
      (Date.now() - SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000) / 1000,
    );

    const messageIds: string[] = [];
    let pageToken: string | undefined;
    do {
      const page = await listGmailMessageIds(accessToken, {
        afterUnixSeconds,
        pageToken,
      });
      messageIds.push(...page.messageIds);
      pageToken = page.nextPageToken ?? undefined;
    } while (pageToken && messageIds.length < MAX_MESSAGES_PER_SYNC);

    const boundedIds = messageIds.slice(0, MAX_MESSAGES_PER_SYNC);

    // Skip messages already stored from a prior sync attempt entirely — the
    // upsert's `ignoreDuplicates` only skips the DB write, not the Gmail API
    // call, so without this a retried/repeated sync re-burns Gmail's
    // per-user-per-minute quota re-fetching messages it already has,
    // compounding a rate-limit failure on every retry instead of recovering.
    const { data: existingRows } = await supabase
      .from("messages")
      .select("provider_message_id")
      .eq("mail_account_id", account.id)
      .in("provider_message_id", boundedIds);
    const alreadyStored = new Set(
      (existingRows ?? []).map((row) => row.provider_message_id),
    );
    const newIds = boundedIds.filter((id) => !alreadyStored.has(id));

    let stored = 0;
    let fetchFailed = 0;

    // Each message is fetched/stored independently: a single message that
    // keeps failing after gmailFetch's own retries (e.g. a sustained
    // per-minute quota exhaustion) must not abort the whole sync and strand
    // the messages already stored without ever being classified.
    for (const messageId of newIds) {
      try {
        const full = await getGmailMessage(accessToken, messageId);
        const headers = full.payload?.headers;
        const from = parseFromHeader(getHeader(headers, "From"));
        const subject = getHeader(headers, "Subject") ?? "";
        const receivedAt = full.internalDate
          ? new Date(Number(full.internalDate)).toISOString()
          : new Date().toISOString();
        const bodyText = extractBodyText(full);

        const { error: upsertError } = await supabase.from("messages").upsert(
          {
            user_id: account.userId,
            mail_account_id: account.id,
            provider_message_id: full.id,
            provider_thread_id: full.threadId ?? null,
            received_at: receivedAt,
            from_address: from.address,
            from_name: from.name,
            subject,
            snippet: full.snippet ?? "",
            body_text: bodyText,
            body_retained_until: bodyText ? bodyRetentionDeadline().toISOString() : null,
            web_link: buildGmailWebLink(full.id),
            classification_status: "pending",
            raw_internal_date: receivedAt,
          },
          { onConflict: "mail_account_id,provider_message_id", ignoreDuplicates: true },
        );

        if (upsertError) {
          logger.error("sync.gmail.message_store_failed", {
            mailAccountId: account.id,
            error: upsertError.message,
          });
          fetchFailed += 1;
          continue;
        }
        stored += 1;
      } catch (messageError) {
        fetchFailed += 1;
        logger.error("sync.gmail.message_fetch_failed", {
          mailAccountId: account.id,
          error: messageError instanceof Error ? messageError.message : "unknown error",
        });
      }

      // Light pacing against Gmail's per-user-per-minute quota — gmailFetch's
      // own retry/backoff is the real defense, this just reduces how often
      // a large sync trips it in the first place.
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { classified, failed: classifyFailed } = await classifyPendingMessages(
      account.userId,
      account.id,
      MAX_MESSAGES_PER_SYNC,
    );

    const hasPartialFailure = fetchFailed > 0 || classifyFailed > 0;
    // "Recovered" also covers a retry that had nothing new to fetch because
    // an earlier attempt already stored everything — not just progress made
    // in this specific run.
    const accountRecovered = stored > 0 || classified > 0 || alreadyStored.size > 0;

    await markMailAccountSynced(account.id, account.userId, new Date());
    await markMailAccountStatus(
      account.id,
      account.userId,
      accountRecovered ? "active" : "sync_error",
      accountRecovered && hasPartialFailure
        ? "The last sync only partially completed. It will retry automatically."
        : null,
    );
    await finishSyncRun(syncRunId, hasPartialFailure ? "partial" : "succeeded", {
      seen: boundedIds.length,
      alreadyStored: alreadyStored.size,
      stored,
      fetchFailed,
      classified,
      classifyFailed,
    });

    return { fetched: boundedIds.length, stored, classified, classifyFailed };
  } catch (error) {
    logger.error("sync.gmail.failed", {
      mailAccountId: account.id,
      error: error instanceof Error ? error.message : "unknown error",
    });
    await markMailAccountStatus(
      account.id,
      account.userId,
      "sync_error",
      "The last sync attempt failed. It will retry automatically.",
    );
    await finishSyncRun(
      syncRunId,
      "failed",
      {},
      error instanceof Error ? error.message : "unknown error",
    );
    throw error instanceof AppError
      ? error
      : new AppError("INTEGRATION_ERROR", "Gmail sync failed.");
  }
}
