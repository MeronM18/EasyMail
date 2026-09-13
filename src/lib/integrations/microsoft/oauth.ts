import "server-only";
import { AppError } from "@/lib/errors";
import { getMicrosoftOAuthConfig } from "@/lib/integrations/config";
import {
  isInvalidGrantError,
  parseOAuthErrorBody,
  ProviderReauthRequiredError,
} from "@/lib/integrations/oauth-errors";

/**
 * Least-privilege scopes only (SECURITY.md) — never widen without a new
 * decision record. No `Mail.ReadWrite`, no `Mail.Send`, no app-only
 * (application permission) grants.
 */
export const MICROSOFT_MAIL_SCOPES = "offline_access User.Read Mail.Read";

function authEndpoint(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
}

function tokenEndpoint(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
}

export function buildMicrosoftAuthorizationUrl({
  state,
  codeChallenge,
}: {
  state: string;
  codeChallenge: string;
}): string {
  const config = getMicrosoftOAuthConfig();
  const url = new URL(authEndpoint(config.tenantId));
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", MICROSOFT_MAIL_SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  // Always show the consent prompt so a repeat connect still returns a
  // usable grant, matching the Google flow's `prompt=consent`.
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

export type MicrosoftTokenGrant = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
  scope: string;
};

type MicrosoftTokenPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
};

export async function exchangeMicrosoftAuthorizationCode({
  code,
  codeVerifier,
}: {
  code: string;
  codeVerifier: string;
}): Promise<MicrosoftTokenGrant> {
  const config = getMicrosoftOAuthConfig();
  const response = await fetch(tokenEndpoint(config.tenantId), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      scope: MICROSOFT_MAIL_SCOPES,
    }),
  });

  if (!response.ok) {
    throw new AppError(
      "INTEGRATION_ERROR",
      "Microsoft did not accept the connection request.",
    );
  }

  const payload = (await response.json()) as MicrosoftTokenPayload;
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? null,
    expiresAt: new Date(Date.now() + payload.expires_in * 1000),
    scope: payload.scope,
  };
}

export async function refreshMicrosoftAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; expiresAt: Date }> {
  const config = getMicrosoftOAuthConfig();
  const response = await fetch(tokenEndpoint(config.tenantId), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: MICROSOFT_MAIL_SCOPES,
    }),
  });

  if (!response.ok) {
    // Microsoft reports an expired/revoked/invalid refresh token as
    // `error: "invalid_grant"` (same RFC 6749 code Google uses) — permanent,
    // never fixed by retrying. Never log or surface the response body
    // itself, only the classified outcome.
    const bodyText = await response.text().catch(() => "");
    if (isInvalidGrantError(parseOAuthErrorBody(bodyText))) {
      throw new ProviderReauthRequiredError();
    }
    throw new AppError(
      "INTEGRATION_ERROR",
      "Microsoft refused to refresh the mailbox connection.",
    );
  }

  const payload = (await response.json()) as MicrosoftTokenPayload;
  return {
    accessToken: payload.access_token,
    expiresAt: new Date(Date.now() + payload.expires_in * 1000),
  };
}

/**
 * Best-effort revoke on disconnect (SECURITY.md). The Microsoft identity
 * platform has no public per-refresh-token revoke endpoint (unlike Google) —
 * the only programmatic option is revoking *all* of a user's sessions, which
 * is broader than a single mailbox disconnect. Deleting the stored
 * ciphertext (already done by the disconnect flow) is the real control here;
 * this always returns `false` so callers never report a revoke that did not
 * happen.
 */
export async function revokeMicrosoftToken(): Promise<boolean> {
  return false;
}
