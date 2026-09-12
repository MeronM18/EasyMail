import "server-only";
import { decryptToken, encryptToken } from "@/lib/crypto/token-cipher";
import { AppError } from "@/lib/errors";
import { getTokenEncryptionKey } from "@/lib/integrations/config";
import type { GoogleTokenGrant } from "@/lib/integrations/google/oauth";
import { createServiceClient } from "@/lib/supabase/admin";

/**
 * Mail account + secret writes for Phase 11 integrations.
 *
 * Every function here uses the service-role client, explicitly filtered by
 * `user_id` / `mail_account_id` (SECURITY.md: "service-role jobs must query
 * with explicit user_id / mail_account_id predicates") rather than the
 * RLS-respecting session client — `messages`, `sync_runs`, and
 * `mail_account_secrets` have no authenticated-role INSERT policy by design
 * (SCHEMA.md), since sync/classify is always a server-driven job, not a
 * user-initiated table write.
 */

export type ConnectGoogleAccountInput = {
  userId: string;
  emailAddress: string;
  grant: GoogleTokenGrant;
};

/** Upserts the mail account row and encrypts/stores its OAuth secrets. */
export async function upsertGoogleMailAccount({
  userId,
  emailAddress,
  grant,
}: ConnectGoogleAccountInput): Promise<{ id: string }> {
  if (!grant.refreshToken) {
    // buildGoogleAuthorizationUrl always sets prompt=consent so Google should
    // always return one; treat a missing refresh token as a hard failure
    // rather than silently storing an account nobody can sync.
    throw new AppError(
      "INTEGRATION_ERROR",
      "Google did not grant offline access. Try connecting again.",
    );
  }

  const supabase = createServiceClient();
  const key = getTokenEncryptionKey();

  const { data: account, error: accountError } = await supabase
    .from("mail_accounts")
    .upsert(
      {
        user_id: userId,
        provider: "google",
        provider_account_id: emailAddress,
        email_address: emailAddress,
        scopes_granted: grant.scope.split(" ").filter(Boolean),
        status: "active",
        status_message: null,
      },
      { onConflict: "user_id,provider,provider_account_id" },
    )
    .select("id")
    .single();

  if (accountError || !account) {
    throw new AppError("INTEGRATION_ERROR", "Could not save the connected mailbox.");
  }

  const { error: secretError } = await supabase.from("mail_account_secrets").upsert({
    mail_account_id: account.id,
    user_id: userId,
    refresh_token_ciphertext: encryptToken(grant.refreshToken, key),
    access_token_ciphertext: encryptToken(grant.accessToken, key),
    access_token_expires_at: grant.expiresAt.toISOString(),
    token_payload_version: 1,
  });

  if (secretError) {
    throw new AppError(
      "INTEGRATION_ERROR",
      "Could not securely store the mailbox connection.",
    );
  }

  return { id: account.id };
}

export type MailAccountForSync = {
  id: string;
  userId: string;
  emailAddress: string;
  refreshToken: string;
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
};

/** Loads a Google account's decrypted credentials for a sync/classify job. */
export async function loadGoogleAccountForSync(
  mailAccountId: string,
): Promise<MailAccountForSync> {
  const supabase = createServiceClient();
  const key = getTokenEncryptionKey();

  const { data: account, error: accountError } = await supabase
    .from("mail_accounts")
    .select("id,user_id,email_address,provider")
    .eq("id", mailAccountId)
    .eq("provider", "google")
    .maybeSingle();

  if (accountError || !account) {
    throw new AppError("NOT_FOUND", "Mailbox connection not found.");
  }

  const { data: secret, error: secretError } = await supabase
    .from("mail_account_secrets")
    .select("refresh_token_ciphertext,access_token_ciphertext,access_token_expires_at")
    .eq("mail_account_id", mailAccountId)
    .maybeSingle();

  if (secretError || !secret?.refresh_token_ciphertext) {
    throw new AppError("INTEGRATION_ERROR", "Mailbox credentials are missing.");
  }

  return {
    id: account.id,
    userId: account.user_id,
    emailAddress: account.email_address,
    refreshToken: decryptToken(secret.refresh_token_ciphertext, key),
    accessToken: secret.access_token_ciphertext
      ? decryptToken(secret.access_token_ciphertext, key)
      : null,
    accessTokenExpiresAt: secret.access_token_expires_at
      ? new Date(secret.access_token_expires_at)
      : null,
  };
}

export async function storeGoogleAccessToken(
  mailAccountId: string,
  userId: string,
  accessToken: string,
  expiresAt: Date,
): Promise<void> {
  const supabase = createServiceClient();
  const key = getTokenEncryptionKey();
  const { error } = await supabase
    .from("mail_account_secrets")
    .update({
      access_token_ciphertext: encryptToken(accessToken, key),
      access_token_expires_at: expiresAt.toISOString(),
    })
    .eq("mail_account_id", mailAccountId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError("INTEGRATION_ERROR", "Could not refresh the mailbox connection.");
  }
}

export type MailAccountStatus =
  "active" | "needs_reconnect" | "sync_error" | "disconnected";

export async function markMailAccountStatus(
  mailAccountId: string,
  userId: string,
  status: MailAccountStatus,
  statusMessage: string | null,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("mail_accounts")
    .update({ status, status_message: statusMessage })
    .eq("id", mailAccountId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError("DATA_ACCESS_FAILED", "Could not update the mailbox status.");
  }
}

export async function markMailAccountSynced(
  mailAccountId: string,
  userId: string,
  syncedAt: Date,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("mail_accounts")
    .update({
      last_synced_at: syncedAt.toISOString(),
      last_sync_attempt_at: syncedAt.toISOString(),
    })
    .eq("id", mailAccountId)
    .eq("user_id", userId);

  if (error) {
    throw new AppError("DATA_ACCESS_FAILED", "Could not update the mailbox sync time.");
  }
}
