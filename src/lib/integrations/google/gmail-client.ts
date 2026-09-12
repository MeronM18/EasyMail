import "server-only";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { GmailMessageResource } from "@/lib/integrations/google/message-parser";

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
const MAX_RETRIES = 6;

// Gmail API signals its per-user rate limit as HTTP 403 with one of these
// `reason` values in the body — NOT HTTP 429 like most Google APIs. Verified
// against a live 403 response: { reason: "rateLimitExceeded", domain:
// "usageLimits", ... "Quota exceeded for quota metric 'Total Query Cost'" }.
const GMAIL_RATE_LIMIT_REASONS = new Set(["rateLimitExceeded", "userRateLimitExceeded"]);

type GmailErrorBody = { error?: { errors?: { reason?: string }[] } };

function isRetryable(status: number, body: GmailErrorBody | null): boolean {
  if (status === 429 || status >= 500) return true;
  if (status !== 403) return false;
  return (body?.error?.errors ?? []).some(
    (e) => e.reason && GMAIL_RATE_LIMIT_REASONS.has(e.reason),
  );
}

async function gmailFetch(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(`${GMAIL_BASE}${path}`, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) return response;

    const bodyText = await response.text().catch(() => "");
    let parsedBody: GmailErrorBody | null = null;
    try {
      parsedBody = bodyText ? (JSON.parse(bodyText) as GmailErrorBody) : null;
    } catch {
      parsedBody = null;
    }
    const reason = parsedBody?.error?.errors?.[0]?.reason ?? "unknown";

    if (isRetryable(response.status, parsedBody) && attempt < MAX_RETRIES - 1) {
      const delayMs = Math.min(2 ** attempt * 500, 8000);
      logger.warn("gmail.request_retrying", {
        path,
        status: response.status,
        reason,
        delayMs,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    logger.error("gmail.request_failed", { path, status: response.status, reason });
    throw new AppError(
      "INTEGRATION_ERROR",
      `Gmail API request failed (${response.status}).`,
    );
  }

  throw new AppError("INTEGRATION_ERROR", "Gmail API request failed (network error).");
}

export type GmailProfile = { emailAddress: string; historyId: string };

/** Uses `gmail.readonly` scope only — no `openid`/`profile`/`email` scope needed. */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const response = await gmailFetch(accessToken, "/profile");
  const payload = (await response.json()) as { emailAddress: string; historyId: string };
  return { emailAddress: payload.emailAddress, historyId: payload.historyId };
}

export type GmailListResult = { messageIds: string[]; nextPageToken: string | null };

export async function listGmailMessageIds(
  accessToken: string,
  {
    afterUnixSeconds,
    pageToken,
    maxResults = 100,
  }: {
    afterUnixSeconds: number;
    pageToken?: string;
    maxResults?: number;
  },
): Promise<GmailListResult> {
  const params = new URLSearchParams({
    q: `after:${afterUnixSeconds}`,
    maxResults: String(maxResults),
  });
  if (pageToken) params.set("pageToken", pageToken);

  const response = await gmailFetch(accessToken, `/messages?${params.toString()}`);
  const payload = (await response.json()) as {
    messages?: { id: string }[];
    nextPageToken?: string;
  };

  return {
    messageIds: (payload.messages ?? []).map((message) => message.id),
    nextPageToken: payload.nextPageToken ?? null,
  };
}

export async function getGmailMessage(
  accessToken: string,
  messageId: string,
): Promise<GmailMessageResource> {
  const response = await gmailFetch(accessToken, `/messages/${messageId}?format=full`);
  return (await response.json()) as GmailMessageResource;
}
