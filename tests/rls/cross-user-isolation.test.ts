import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Cross-user RLS isolation tests (SCHEMA.md / SECURITY.md).
 *
 * Requires a running local Supabase stack with migrations applied:
 *   npx supabase start
 *   npx supabase db reset
 *
 * Skips automatically when SUPABASE URL + service role key are unavailable
 * (typical CI without Docker/services).
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.ANON_KEY ?? "";

const rlsConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY && ANON_KEY);
const forceRun = process.env.RUN_RLS_TESTS === "1";

function describeRls(name: string, fn: () => void) {
  if (!rlsConfigured && !forceRun) {
    describe.skip(`${name} (skipped: local Supabase env not configured)`, fn);
    return;
  }
  describe(name, fn);
}

type SeededUser = {
  user: User;
  email: string;
  password: string;
  client: SupabaseClient;
  accountId: string;
  messageId: string;
};

async function createAuthedUser(
  admin: SupabaseClient,
  label: string,
): Promise<Omit<SeededUser, "accountId" | "messageId">> {
  const email = `rls-${label}-${Date.now()}@example.com`;
  const password = `TestPass-${label}-123456!`;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    throw createError ?? new Error(`Failed to create user ${label}`);
  }

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    throw signInError;
  }

  return { user: created.user, email, password, client };
}

async function seedMailData(
  admin: SupabaseClient,
  userId: string,
  label: string,
): Promise<{ accountId: string; messageId: string }> {
  const { data: account, error: accountError } = await admin
    .from("mail_accounts")
    .insert({
      user_id: userId,
      provider: "google",
      provider_account_id: `provider-${label}-${userId}`,
      email_address: `${label}@example.com`,
      scopes_granted: ["https://www.googleapis.com/auth/gmail.readonly"],
      status: "active",
    })
    .select("id")
    .single();

  if (accountError || !account) {
    throw accountError ?? new Error("Failed to insert mail_account");
  }

  const { error: secretError } = await admin.from("mail_account_secrets").insert({
    mail_account_id: account.id,
    user_id: userId,
    refresh_token_ciphertext: Buffer.from("fake-refresh-token"),
    access_token_ciphertext: Buffer.from("fake-access-token"),
    token_payload_version: 1,
  });
  if (secretError) {
    throw secretError;
  }

  const { data: message, error: messageError } = await admin
    .from("messages")
    .insert({
      user_id: userId,
      mail_account_id: account.id,
      provider_message_id: `msg-${label}-${userId}`,
      received_at: new Date().toISOString(),
      from_address: "sender@example.com",
      subject: `${label} subject`,
      snippet: `${label} snippet`,
      classification_status: "classified",
    })
    .select("id")
    .single();

  if (messageError || !message) {
    throw messageError ?? new Error("Failed to insert message");
  }

  const { error: classificationError } = await admin
    .from("message_classifications")
    .insert({
      message_id: message.id,
      user_id: userId,
      model_intent: "needs_reply",
      effective_intent: "needs_reply",
      reason: "RLS correction test fixture",
      is_user_override: false,
      model_id: "rls-fixture",
      classified_at: new Date().toISOString(),
    });

  if (classificationError) {
    throw classificationError;
  }

  return { accountId: account.id, messageId: message.id };
}

describeRls("RLS cross-user isolation", () => {
  let admin: SupabaseClient;
  let userA: SeededUser;
  let userB: SeededUser;
  let supabaseReachable = true;

  beforeAll(async () => {
    admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
      const health = await fetch(`${SUPABASE_URL}/auth/v1/health`).catch(() => null);
      if (!health?.ok) {
        // Some local stacks do not expose /auth/v1/health; try a cheap admin call.
        const { error } = await admin.from("profiles").select("id").limit(1);
        if (error && /fetch failed|ECONNREFUSED|ENOTFOUND/i.test(error.message)) {
          supabaseReachable = false;
          return;
        }
      }

      const a = await createAuthedUser(admin, "a");
      const b = await createAuthedUser(admin, "b");
      const aData = await seedMailData(admin, a.user.id, "a");
      const bData = await seedMailData(admin, b.user.id, "b");

      userA = { ...a, ...aData };
      userB = { ...b, ...bData };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/fetch failed|ECONNREFUSED|ENOTFOUND|Failed to fetch/i.test(message)) {
        supabaseReachable = false;
        return;
      }
      throw error;
    }
  });

  afterAll(async () => {
    if (!supabaseReachable) return;
    if (userA?.user?.id) {
      await admin.auth.admin.deleteUser(userA.user.id);
    }
    if (userB?.user?.id) {
      await admin.auth.admin.deleteUser(userB.user.id);
    }
  });

  it("User A cannot SELECT User B mail_accounts or messages", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { data: accounts, error: accountsError } = await userA.client
      .from("mail_accounts")
      .select("id")
      .eq("id", userB.accountId);

    expect(accountsError).toBeNull();
    expect(accounts ?? []).toHaveLength(0);

    const { data: messages, error: messagesError } = await userA.client
      .from("messages")
      .select("id")
      .eq("id", userB.messageId);

    expect(messagesError).toBeNull();
    expect(messages ?? []).toHaveLength(0);
  });

  it("User A cannot UPDATE or DELETE User B rows", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { data: updated, error: updateError } = await userA.client
      .from("mail_accounts")
      .update({ nickname: "hijacked" })
      .eq("id", userB.accountId)
      .select("id");

    expect(updateError).toBeNull();
    expect(updated ?? []).toHaveLength(0);

    const { data: deleted, error: deleteError } = await userA.client
      .from("messages")
      .delete()
      .eq("id", userB.messageId)
      .select("id");

    expect(deleteError).toBeNull();
    expect(deleted ?? []).toHaveLength(0);

    const { data: stillThere } = await admin
      .from("messages")
      .select("id")
      .eq("id", userB.messageId)
      .maybeSingle();
    expect(stillThere?.id).toBe(userB.messageId);
  });

  it("authenticated role cannot read mail_account_secrets", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { data, error } = await userA.client
      .from("mail_account_secrets")
      .select("mail_account_id")
      .eq("mail_account_id", userA.accountId);

    // Table may be fully revoked (permission error) or RLS-empty — both OK.
    if (error) {
      expect(error.message.toLowerCase()).toMatch(
        /permission|policy|denied|not accept|schema cache|rls/i,
      );
      return;
    }
    expect(data ?? []).toHaveLength(0);
  });

  it("User A can read their own mail_accounts", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { data, error } = await userA.client
      .from("mail_accounts")
      .select("id")
      .eq("id", userA.accountId);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data?.[0]?.id).toBe(userA.accountId);
  });

  it("records one refresh-stable recap visit window atomically", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recorded, error: recordError } = await userA.client.rpc(
      "record_recap_visit",
      {
        p_previous_visit_at: null,
        p_window_start_at: windowStart,
      },
    );
    expect(recordError).toBeNull();
    expect(recorded).toBe(true);

    const { data: firstProfile } = await admin
      .from("profiles")
      .select("last_recap_visit_at,recap_session_started_at,recap_window_start_at")
      .eq("id", userA.user.id)
      .single();
    expect(firstProfile?.last_recap_visit_at).toBeTruthy();
    expect(firstProfile?.recap_session_started_at).toBeTruthy();
    expect(new Date(firstProfile?.recap_window_start_at ?? 0).valueOf()).toBe(
      new Date(windowStart).valueOf(),
    );

    const { data: duplicate, error: duplicateError } = await userA.client.rpc(
      "record_recap_visit",
      {
        p_previous_visit_at: null,
        p_window_start_at: new Date().toISOString(),
      },
    );
    expect(duplicateError).toBeNull();
    expect(duplicate).toBe(false);

    const { data: unchangedProfile } = await admin
      .from("profiles")
      .select("last_recap_visit_at,recap_window_start_at")
      .eq("id", userA.user.id)
      .single();
    expect(unchangedProfile?.last_recap_visit_at).toBe(firstProfile?.last_recap_visit_at);
    expect(new Date(unchangedProfile?.recap_window_start_at ?? 0).valueOf()).toBe(
      new Date(windowStart).valueOf(),
    );
  });

  it("an owner can correct a classification through the atomic RPC", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { error } = await userA.client.rpc("correct_message_classification", {
      p_message_id: userA.messageId,
      p_to_intent: "matters",
    });
    expect(error).toBeNull();

    const { data: classification } = await admin
      .from("message_classifications")
      .select("effective_intent,is_user_override")
      .eq("message_id", userA.messageId)
      .single();
    expect(classification).toMatchObject({
      effective_intent: "matters",
      is_user_override: true,
    });

    const { data: corrections } = await admin
      .from("classification_corrections")
      .select("from_intent,to_intent,user_id")
      .eq("message_id", userA.messageId);
    expect(corrections).toEqual([
      {
        from_intent: "needs_reply",
        to_intent: "matters",
        user_id: userA.user.id,
      },
    ]);
  });

  it("User A cannot correct User B's classification", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { error } = await userA.client.rpc("correct_message_classification", {
      p_message_id: userB.messageId,
      p_to_intent: "can_ignore",
    });
    expect(error).not.toBeNull();

    const { data: classification } = await admin
      .from("message_classifications")
      .select("effective_intent,is_user_override")
      .eq("message_id", userB.messageId)
      .single();
    expect(classification).toMatchObject({
      effective_intent: "needs_reply",
      is_user_override: false,
    });
  });

  it("authenticated clients cannot bypass correction auditing", async ({ skip }) => {
    if (!supabaseReachable) skip();

    const { error } = await userA.client
      .from("message_classifications")
      .update({ effective_intent: "can_ignore" })
      .eq("message_id", userA.messageId);
    expect(error).not.toBeNull();
  });
});
