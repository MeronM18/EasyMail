import "server-only";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import { isIntent, type Intent } from "@/lib/intent";
import {
  countPendingMessages,
  getSetupProgress,
  getWindowStart,
  groupRecapMessages,
  resolveRecapVisitWindow,
  type RecapMessage,
  type RecapWindow,
} from "@/lib/recap";
import { createClient } from "@/lib/supabase/server";

// PostgREST/Kong reject an overly long query string ("URI too long") once an
// `.in(...)` filter's id list gets large enough — a real mailbox easily has
// hundreds of messages in-window, well past that point. Chunking keeps each
// request's URL short regardless of how many messages a user has.
const IN_FILTER_CHUNK_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export type MailAccountSummary = {
  id: string;
  provider: "google" | "microsoft";
  emailAddress: string;
  label: string;
  status: string;
  statusMessage: string | null;
  lastSyncedAt: string | null;
  isDemo: boolean;
};

export type RecapData = {
  displayName: string | null;
  accounts: MailAccountSummary[];
  setup: ReturnType<typeof getSetupProgress>;
  groups: ReturnType<typeof groupRecapMessages>;
  classifiedCount: number;
  pendingCount: number;
  windowStart: string;
};

export type MessageDetail = RecapMessage & {
  bodyText: string | null;
};

function accountSummary(row: {
  id: string;
  provider: string;
  provider_account_id: string;
  email_address: string;
  nickname: string | null;
  status: string;
  status_message: string | null;
  last_synced_at: string | null;
}): MailAccountSummary {
  return {
    id: row.id,
    provider: row.provider === "microsoft" ? "microsoft" : "google",
    emailAddress: row.email_address,
    label: row.nickname || row.email_address,
    status: row.status,
    statusMessage: row.status_message,
    lastSyncedAt: row.last_synced_at,
    isDemo: row.provider_account_id.startsWith("phase10-demo-"),
  };
}

async function loadAccountsAndProfile(userId: string) {
  const supabase = await createClient();
  const [profileResult, accountResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "display_name,last_recap_visit_at,recap_session_started_at,recap_window_start_at",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("mail_accounts")
      .select(
        "id,provider,provider_account_id,email_address,nickname,status,status_message,last_synced_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
  ]);

  if (profileResult.error || accountResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load your workspace.");
  }

  return {
    supabase,
    profile: profileResult.data,
    accounts: (accountResult.data ?? []).map(accountSummary),
  };
}

async function loadClassifiedMessages({
  userId,
  since,
  accountId,
}: {
  userId: string;
  since: Date;
  accountId?: string;
}) {
  const supabase = await createClient();
  let messagesQuery = supabase
    .from("messages")
    .select(
      "id,mail_account_id,received_at,from_address,from_name,subject,snippet,web_link,classification_status",
    )
    .eq("user_id", userId)
    .eq("is_handled", false)
    .gte("received_at", since.toISOString())
    .order("received_at", { ascending: false });

  if (accountId) messagesQuery = messagesQuery.eq("mail_account_id", accountId);
  const messagesResult = await messagesQuery;
  if (messagesResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load your recap.");
  }

  const messageRows = messagesResult.data ?? [];
  if (messageRows.length === 0) {
    return { messages: [] as RecapMessage[], pendingCount: 0 };
  }

  const classificationChunks = await Promise.all(
    chunk(
      messageRows.map(({ id }) => id),
      IN_FILTER_CHUNK_SIZE,
    ).map((ids) =>
      supabase
        .from("message_classifications")
        .select(
          "message_id,model_intent,effective_intent,reason,action_signal,is_user_override",
        )
        .eq("user_id", userId)
        .in("message_id", ids),
    ),
  );

  if (classificationChunks.some((result) => result.error)) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load your recap.");
  }

  const classifications = new Map(
    classificationChunks
      .flatMap((result) => result.data ?? [])
      .map((classification) => [classification.message_id, classification]),
  );
  const accountIds = [...new Set(messageRows.map((message) => message.mail_account_id))];
  const accountsResult = await supabase
    .from("mail_accounts")
    .select("id,provider,email_address,nickname")
    .eq("user_id", userId)
    .in("id", accountIds);

  if (accountsResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load your recap.");
  }

  const accounts = new Map(
    (accountsResult.data ?? []).map((account) => [account.id, account]),
  );
  const messages: RecapMessage[] = [];

  for (const message of messageRows) {
    const classification = classifications.get(message.id);
    const account = accounts.get(message.mail_account_id);
    if (
      !classification ||
      !account ||
      !isIntent(classification.effective_intent) ||
      !isIntent(classification.model_intent)
    ) {
      continue;
    }

    messages.push({
      id: message.id,
      accountId: message.mail_account_id,
      accountLabel: account.nickname || account.email_address,
      accountEmail: account.email_address,
      provider: account.provider === "microsoft" ? "microsoft" : "google",
      receivedAt: message.received_at,
      fromAddress: message.from_address,
      fromName: message.from_name,
      subject: message.subject,
      snippet: message.snippet,
      webLink: message.web_link,
      intent: classification.effective_intent,
      modelIntent: classification.model_intent,
      reason: classification.reason,
      actionSignal: classification.action_signal,
      isUserOverride: classification.is_user_override,
    });
  }

  return {
    messages,
    pendingCount: countPendingMessages(messageRows),
  };
}

export async function getMailAccountsForSettings(): Promise<MailAccountSummary[]> {
  const user = await requireUser();
  const { accounts } = await loadAccountsAndProfile(user.id);
  return accounts;
}

export async function getRecapData(window: RecapWindow): Promise<RecapData> {
  const user = await requireUser();
  const { supabase, profile, accounts } = await loadAccountsAndProfile(user.id);
  const now = new Date();
  const visitWindow = resolveRecapVisitWindow({
    now,
    lastVisitAt: profile?.last_recap_visit_at ?? null,
    sessionStartedAt: profile?.recap_session_started_at ?? null,
    sessionWindowStartAt: profile?.recap_window_start_at ?? null,
  });
  const windowStart =
    window === "since_last_visit"
      ? visitWindow.windowStart
      : getWindowStart(window, now, profile?.last_recap_visit_at ?? null);
  const { messages, pendingCount } = await loadClassifiedMessages({
    userId: user.id,
    since: windowStart,
  });

  if (window === "since_last_visit" && !visitWindow.isExistingSession) {
    const { error } = await supabase.rpc("record_recap_visit", {
      // Postgres accepts NULL for a first visit; generated RPC args do not
      // preserve function-argument nullability.
      p_previous_visit_at: (profile?.last_recap_visit_at ?? null) as unknown as string,
      p_window_start_at: windowStart.toISOString(),
    });
    if (error) {
      throw new AppError("DATA_ACCESS_FAILED", "We could not complete your recap visit.");
    }
  }

  return {
    displayName: profile?.display_name ?? null,
    accounts,
    setup: getSetupProgress(accounts),
    groups: groupRecapMessages(messages),
    classifiedCount: messages.length,
    pendingCount,
    windowStart: windowStart.toISOString(),
  };
}

export async function getTriageData({
  intent,
  accountId,
}: {
  intent: Intent | "all_needs_me";
  accountId?: string;
}) {
  const user = await requireUser();
  const { accounts } = await loadAccountsAndProfile(user.id);
  const selectedAccount = accountId
    ? accounts.find((account) => account.id === accountId)
    : undefined;
  const { messages } = await loadClassifiedMessages({
    userId: user.id,
    since: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    accountId: selectedAccount?.id,
  });
  const filtered =
    intent === "all_needs_me"
      ? messages.filter(({ intent: value }) =>
          ["needs_reply", "needs_action", "matters"].includes(value),
        )
      : messages.filter(({ intent: value }) => value === intent);

  return { accounts, selectedAccount, messages: filtered };
}

export async function getMessageDetail(messageId: string): Promise<MessageDetail> {
  const user = await requireUser();
  const supabase = await createClient();
  const messageResult = await supabase
    .from("messages")
    .select(
      "id,mail_account_id,received_at,from_address,from_name,subject,snippet,body_text,web_link",
    )
    .eq("user_id", user.id)
    .eq("id", messageId)
    .maybeSingle();

  if (messageResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load this message.");
  }
  if (!messageResult.data) notFound();

  const [classificationResult, accountResult] = await Promise.all([
    supabase
      .from("message_classifications")
      .select("model_intent,effective_intent,reason,action_signal,is_user_override")
      .eq("user_id", user.id)
      .eq("message_id", messageId)
      .maybeSingle(),
    supabase
      .from("mail_accounts")
      .select("id,provider,email_address,nickname")
      .eq("user_id", user.id)
      .eq("id", messageResult.data.mail_account_id)
      .maybeSingle(),
  ]);

  if (classificationResult.error || accountResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load this message.");
  }
  const classification = classificationResult.data;
  const account = accountResult.data;
  if (
    !classification ||
    !account ||
    !isIntent(classification.effective_intent) ||
    !isIntent(classification.model_intent)
  ) {
    notFound();
  }

  return {
    id: messageResult.data.id,
    accountId: messageResult.data.mail_account_id,
    accountLabel: account.nickname || account.email_address,
    accountEmail: account.email_address,
    provider: account.provider === "microsoft" ? "microsoft" : "google",
    receivedAt: messageResult.data.received_at,
    fromAddress: messageResult.data.from_address,
    fromName: messageResult.data.from_name,
    subject: messageResult.data.subject,
    snippet: messageResult.data.snippet,
    bodyText: messageResult.data.body_text,
    webLink: messageResult.data.web_link,
    intent: classification.effective_intent,
    modelIntent: classification.model_intent,
    reason: classification.reason,
    actionSignal: classification.action_signal,
    isUserOverride: classification.is_user_override,
  };
}
