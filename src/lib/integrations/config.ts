import { AppError } from "@/lib/errors";
import { getServerEnv } from "@/lib/env";

/**
 * Integration-specific configuration boundary (Phase 11).
 *
 * Google/Microsoft/AI Gateway credentials stay optional in `env.ts` so local
 * dev, lint, typecheck, tests, and the production build never require them.
 * These getters are the single place that turns "not configured" into a
 * clear, typed `AppError` — call them only at the point an integration is
 * actually used (an OAuth route, a sync/classify worker), never at module
 * load time. No "server-only" guard here, matching `env.ts` itself (which
 * holds the same secrets and is directly unit-tested) — the real boundary is
 * that nothing in `src/lib/integrations/**` is ever imported by client code.
 */

function safeServerEnv() {
  try {
    return getServerEnv();
  } catch (error) {
    throw new AppError(
      "INTEGRATION_NOT_CONFIGURED",
      "The server environment is not fully configured.",
      { cause: error },
    );
  }
}

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getGoogleOAuthConfig(): GoogleOAuthConfig {
  const env = safeServerEnv();
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new AppError(
      "INTEGRATION_NOT_CONFIGURED",
      "Google mailbox integration is not configured on this server.",
    );
  }
  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  };
}

/** The 32-byte, base64-encoded key used to encrypt/decrypt provider tokens at rest. */
export function getTokenEncryptionKey(): string {
  return safeServerEnv().TOKEN_ENCRYPTION_KEY;
}

export type AiClassifyConfig = {
  model: string;
};

const DEFAULT_CLASSIFY_MODEL = "anthropic/claude-haiku-4.5";

export function getAiClassifyConfig(): AiClassifyConfig {
  const env = safeServerEnv();
  if (!env.AI_GATEWAY_API_KEY) {
    throw new AppError(
      "INTEGRATION_NOT_CONFIGURED",
      "AI classification is not configured on this server.",
    );
  }
  return { model: env.AI_CLASSIFY_MODEL ?? DEFAULT_CLASSIFY_MODEL };
}

/** Shared bearer secret for internal job endpoints (purge, Cron-triggered sync). */
export function getCronSecret(): string {
  const env = safeServerEnv();
  if (!env.CRON_SECRET) {
    throw new AppError(
      "INTEGRATION_NOT_CONFIGURED",
      "The internal job secret is not configured on this server.",
    );
  }
  return env.CRON_SECRET;
}
