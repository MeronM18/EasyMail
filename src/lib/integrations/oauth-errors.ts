/**
 * Shared OAuth-refresh failure classification (Phase 12, G4).
 *
 * Google and Microsoft's token endpoints both use the same RFC 6749 error
 * code — `error: "invalid_grant"` — to report an expired, revoked, or
 * otherwise permanently invalid refresh token. That is fundamentally
 * different from a transient network/5xx failure: no amount of retrying
 * will fix it, and the account needs the user to reconnect. This module is
 * pure/no-network so the classification itself is directly unit-testable.
 *
 * Never pass the raw response body to this beyond the parsed `error` field —
 * provider error bodies are not logged or surfaced to the user verbatim.
 */

export class ProviderReauthRequiredError extends Error {
  constructor(
    message = "The mailbox connection is no longer valid and needs to be reconnected.",
  ) {
    super(message);
    this.name = "ProviderReauthRequiredError";
  }
}

export type OAuthErrorBody = { error?: string };

/** True only for the specific RFC 6749 code both providers use for a dead refresh token. */
export function isInvalidGrantError(body: OAuthErrorBody | null): boolean {
  return body?.error === "invalid_grant";
}

/** Best-effort, safe parse of a token-endpoint error body — never throws. */
export function parseOAuthErrorBody(bodyText: string): OAuthErrorBody | null {
  if (!bodyText) return null;
  try {
    return JSON.parse(bodyText) as OAuthErrorBody;
  } catch {
    return null;
  }
}
