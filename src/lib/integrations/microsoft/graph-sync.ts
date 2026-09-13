import "server-only";
import { AppError } from "@/lib/errors";
import { classifyPendingMessages } from "@/lib/integrations/classify";
import { listMicrosoftMessages } from "@/lib/integrations/microsoft/graph-client";
import {
  extractGraphBodyText,
  graphWebLink,
  parseGraphFromAddress,
  parseGraphReceivedAt,
} from "@/lib/integrations/microsoft/message-parser";
import { refreshMicrosoftAccessToken } from "@/lib/integrations/microsoft/oauth";
import {
  loadMicrosoftAccountForSync,
  markMailAccountStatus,
  markMailAccountSynced,
  storeMicrosoftAccessToken,
  type MailAccountForSync,
} from "@/lib/integrations/mail-accounts";
import { ProviderReauthRequiredError } from "@/lib/integrations/oauth-errors";
import { bodyRetentionDeadline } from "@/lib/integrations/retention";
import {
  finishSyncRun,
  startSyncRun,
  type SyncTrigger,
} from "@/lib/integrations/sync-runs";
import { decideSyncOutcome } from "@/lib/integrations/sync-outcome";
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

  const refreshed = await refreshMicrosoftAccessToken(account.refreshToken);
  await storeMicrosoftAccessToken(
    account.id,
    account.userId,
    refreshed.accessToken,
    refreshed.expiresAt,
  );
  return refreshed.accessToken;
}

export type GraphSyncResult = {
  fetched: number;
  stored: number;
  classified: number;
  classifyFailed: number;
};

/**
 * Initial (rolling-window) sync for one Outlook account: list recent
 * messages, store each one, then classify everything left pending. Mirrors
 * `syncGmailAccount` — same 14-day/300-message bound, same idempotent upsert
 * via the `(mail_account_id, provider_message_id)` unique constraint, same
 * `sync_runs` overlap guard, and the same shared `classifyPendingMessages`
 * pipeline (provider-agnostic, keyed by `mail_account_id`).
 */
export async function syncMicrosoftAccount(
  mailAccountId: string,
  trigger: SyncTrigger,
): Promise<GraphSyncResult> {
  const account = await loadMicrosoftAccountForSync(mailAccountId);
  const syncRunId = await startSyncRun({
    userId: account.userId,
    mailAccountId: account.id,
    trigger,
  });

  try {
    const accessToken = await ensureFreshAccessToken(account);
    const supabase = createServiceClient();

    const sinceIso = new Date(
      Date.now() - SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    const messages: Awaited<ReturnType<typeof listMicrosoftMessages>>["messages"] = [];
    let nextLink: string | undefined;
    do {
      const page = await listMicrosoftMessages(accessToken, { sinceIso, nextLink });
      messages.push(...page.messages);
      nextLink = page.nextLink ?? undefined;
    } while (nextLink && messages.length < MAX_MESSAGES_PER_SYNC);

    const bounded = messages.slice(0, MAX_MESSAGES_PER_SYNC);

    // Skip messages already stored from a prior sync attempt entirely — same
    // rationale as the Gmail sync: the upsert's `ignoreDuplicates` only
    // skips the DB write, not the Graph API traffic already spent listing.
    const { data: existingRows } = await supabase
      .from("messages")
      .select("provider_message_id")
      .eq("mail_account_id", account.id)
      .in(
        "provider_message_id",
        bounded.map((m) => m.id),
      );
    const alreadyStored = new Set(
      (existingRows ?? []).map((row) => row.provider_message_id),
    );
    const newMessages = bounded.filter((m) => !alreadyStored.has(m.id));

    let stored = 0;
    let fetchFailed = 0;

    for (const message of newMessages) {
      try {
        const from = parseGraphFromAddress(message);
        const receivedAt = parseGraphReceivedAt(message);
        const bodyText = extractGraphBodyText(message);

        const { error: upsertError } = await supabase.from("messages").upsert(
          {
            user_id: account.userId,
            mail_account_id: account.id,
            provider_message_id: message.id,
            provider_thread_id: message.conversationId ?? null,
            received_at: receivedAt,
            from_address: from.address,
            from_name: from.name,
            subject: message.subject ?? "",
            snippet: message.bodyPreview ?? "",
            body_text: bodyText,
            body_retained_until: bodyText ? bodyRetentionDeadline().toISOString() : null,
            web_link: graphWebLink(message),
            classification_status: "pending",
            raw_internal_date: receivedAt,
          },
          { onConflict: "mail_account_id,provider_message_id", ignoreDuplicates: true },
        );

        if (upsertError) {
          logger.error("sync.microsoft.message_store_failed", {
            mailAccountId: account.id,
            error: upsertError.message,
          });
          fetchFailed += 1;
          continue;
        }
        stored += 1;
      } catch (messageError) {
        fetchFailed += 1;
        logger.error("sync.microsoft.message_store_failed", {
          mailAccountId: account.id,
          error: messageError instanceof Error ? messageError.message : "unknown error",
        });
      }
    }

    const { classified, failed: classifyFailed } = await classifyPendingMessages(
      account.userId,
      account.id,
      MAX_MESSAGES_PER_SYNC,
    );

    const outcome = decideSyncOutcome({ fetchFailed, classifyFailed });

    await markMailAccountSynced(account.id, account.userId, new Date());
    await markMailAccountStatus(
      account.id,
      account.userId,
      outcome.accountStatus,
      outcome.statusMessage,
    );
    await finishSyncRun(syncRunId, outcome.finishStatus, {
      seen: bounded.length,
      alreadyStored: alreadyStored.size,
      stored,
      fetchFailed,
      classified,
      classifyFailed,
    });

    return { fetched: bounded.length, stored, classified, classifyFailed };
  } catch (error) {
    // An expired/revoked refresh token is permanent — no retry will fix it,
    // and the account needs the user to reconnect (Phase 12, G4). Anything
    // else (network blips, provider 5xx) is a transient sync failure.
    const reauthRequired = error instanceof ProviderReauthRequiredError;
    logger.error("sync.microsoft.failed", {
      mailAccountId: account.id,
      reauthRequired,
      error: error instanceof Error ? error.message : "unknown error",
    });
    await markMailAccountStatus(
      account.id,
      account.userId,
      reauthRequired ? "needs_reconnect" : "sync_error",
      reauthRequired
        ? "This account's connection is no longer valid. Reconnect to keep syncing."
        : "The last sync attempt failed.",
    );
    await finishSyncRun(
      syncRunId,
      "failed",
      {},
      error instanceof Error ? error.message : "unknown error",
    );
    throw error instanceof AppError
      ? error
      : new AppError("INTEGRATION_ERROR", "Outlook sync failed.");
  }
}
