import "server-only";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
const MAX_RETRIES = 6;

type GraphErrorBody = { error?: { code?: string; message?: string } };

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

async function graphFetch(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(
      path.startsWith("http") ? path : `${GRAPH_BASE}${path}`,
      {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
          // Ask Graph to normalize body content to plain text server-side —
          // avoids storing/parsing raw HTML (SECURITY.md: HTML not stored).
          Prefer: 'outlook.body-content-type="text"',
        },
      },
    );

    if (response.ok) return response;

    const bodyText = await response.text().catch(() => "");
    let parsedBody: GraphErrorBody | null = null;
    try {
      parsedBody = bodyText ? (JSON.parse(bodyText) as GraphErrorBody) : null;
    } catch {
      parsedBody = null;
    }
    const code = parsedBody?.error?.code ?? "unknown";

    if (isRetryable(response.status) && attempt < MAX_RETRIES - 1) {
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : null;
      const delayMs =
        retryAfterMs && Number.isFinite(retryAfterMs)
          ? retryAfterMs
          : Math.min(2 ** attempt * 500, 8000);
      logger.warn("graph.request_retrying", {
        path,
        status: response.status,
        code,
        delayMs,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    logger.error("graph.request_failed", { path, status: response.status, code });
    throw new AppError(
      "INTEGRATION_ERROR",
      `Microsoft Graph request failed (${response.status}).`,
    );
  }

  throw new AppError(
    "INTEGRATION_ERROR",
    "Microsoft Graph request failed (network error).",
  );
}

export type MicrosoftProfile = { emailAddress: string; id: string };

/** Uses `User.Read` — the same scope already required for `/me` identity. */
export async function getMicrosoftProfile(
  accessToken: string,
): Promise<MicrosoftProfile> {
  const response = await graphFetch(accessToken, "/me?$select=id,mail,userPrincipalName");
  const payload = (await response.json()) as {
    id: string;
    mail?: string | null;
    userPrincipalName?: string;
  };
  const emailAddress = payload.mail ?? payload.userPrincipalName;
  if (!emailAddress) {
    throw new AppError(
      "INTEGRATION_ERROR",
      "Microsoft account has no usable mailbox address.",
    );
  }
  return { emailAddress, id: payload.id };
}

export type GraphMessage = {
  id: string;
  conversationId?: string;
  subject?: string;
  bodyPreview?: string;
  receivedDateTime?: string;
  webLink?: string;
  from?: { emailAddress?: { address?: string; name?: string } };
  body?: { contentType?: string; content?: string };
};

export type GraphMessagePage = { messages: GraphMessage[]; nextLink: string | null };

const MESSAGE_SELECT =
  "id,conversationId,subject,bodyPreview,receivedDateTime,webLink,from,body";

/**
 * Lists messages received on/after `sinceIso`, newest first, paging via
 * Graph's `@odata.nextLink` (which already carries the full query — later
 * pages are fetched by URL, not by rebuilding params).
 */
export async function listMicrosoftMessages(
  accessToken: string,
  { sinceIso, nextLink, top = 50 }: { sinceIso: string; nextLink?: string; top?: number },
): Promise<GraphMessagePage> {
  const path =
    nextLink ??
    (() => {
      const params = new URLSearchParams({
        $select: MESSAGE_SELECT,
        $orderby: "receivedDateTime desc",
        $top: String(top),
        $filter: `receivedDateTime ge ${sinceIso}`,
      });
      return `/me/messages?${params.toString()}`;
    })();

  const response = await graphFetch(accessToken, path);
  const payload = (await response.json()) as {
    value?: GraphMessage[];
    "@odata.nextLink"?: string;
  };

  return {
    messages: payload.value ?? [],
    nextLink: payload["@odata.nextLink"] ?? null,
  };
}
