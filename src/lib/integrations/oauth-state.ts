import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { AppError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/admin";

const STATE_TTL_MS = 10 * 60 * 1000;

export type OAuthProvider = "google" | "microsoft";

export type PendingOAuthState = {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
};

/**
 * Creates a single-use, short-lived `oauth_states` row (SECURITY.md CSRF
 * pattern) with a PKCE (S256) verifier/challenge pair for the given user.
 */
export async function createOAuthState(
  userId: string,
  provider: OAuthProvider,
): Promise<PendingOAuthState> {
  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");

  const supabase = createServiceClient();
  const { error } = await supabase.from("oauth_states").insert({
    state,
    user_id: userId,
    provider,
    code_verifier: codeVerifier,
    expires_at: new Date(Date.now() + STATE_TTL_MS).toISOString(),
  });

  if (error) {
    throw new AppError("INTEGRATION_ERROR", "Could not start the connection. Try again.");
  }

  return { state, codeVerifier, codeChallenge };
}

export type ConsumedOAuthState = {
  userId: string;
  codeVerifier: string | null;
};

/**
 * Atomically consumes (deletes) a single-use OAuth state row and validates
 * it belongs to the given provider and has not expired. Returns `null` on
 * any mismatch so callers can produce one generic "invalid or expired"
 * error without leaking which check failed.
 */
export async function consumeOAuthState(
  state: string,
  provider: OAuthProvider,
): Promise<ConsumedOAuthState | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("oauth_states")
    .delete()
    .eq("state", state)
    .select("user_id,provider,code_verifier,expires_at")
    .maybeSingle();

  if (error || !data) return null;
  if (data.provider !== provider) return null;
  if (new Date(data.expires_at).valueOf() < Date.now()) return null;

  return { userId: data.user_id, codeVerifier: data.code_verifier };
}
