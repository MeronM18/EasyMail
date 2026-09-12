/** User-facing copy for Settings `?error=` / `?connected=` query params (UX.md). */

const messages: Record<string, string> = {
  oauth_denied: "Google sign-in was cancelled or denied. You can try again anytime.",
  oauth_state_invalid:
    "That connection link expired or was already used. Try connecting again.",
  google_not_configured:
    "Google mailbox connection is not configured on this server yet.",
  google_connect_failed: "We could not connect that Google account. Try again.",
};

export function getIntegrationMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  return messages[code] ?? "Something went wrong connecting that account.";
}
