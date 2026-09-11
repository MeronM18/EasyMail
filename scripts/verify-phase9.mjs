import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "MAILPIT_URL",
];

for (const name of required) {
  assert.ok(process.env[name], `Missing required environment variable: ${name}`);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL).origin;
const mailpitUrl = process.env.MAILPIT_URL;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function createAnonymousClient() {
  return createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function assertNoError(error, context) {
  assert.equal(error, null, `${context}: ${error?.message ?? "unknown error"}`);
}

async function waitForRecoveryEmail(address) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${mailpitUrl}/api/v1/messages`, {
      signal: AbortSignal.timeout(5_000),
    });
    assert.equal(response.ok, true, "Mailpit message API was unavailable");
    const inbox = await response.json();
    const messages = Array.isArray(inbox.messages) ? inbox.messages : [];
    const match = messages.some((message) =>
      (message.To ?? []).some(
        (recipient) => recipient.Address?.toLowerCase() === address.toLowerCase(),
      ),
    );
    if (match) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  assert.fail(`No password recovery email arrived for ${address}`);
}

async function createSsrSession(email, password) {
  const cookieJar = new Map();
  const client = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return Array.from(cookieJar, ([name, cookie]) => ({
          name,
          value: cookie.value,
        }));
      },
      setAll(cookies) {
        for (const cookie of cookies) cookieJar.set(cookie.name, cookie);
      },
    },
  });

  const { error } = await client.auth.signInWithPassword({ email, password });
  assertNoError(error, "SSR sign-in failed");
  assert.ok(cookieJar.size > 0, "SSR sign-in did not create a session cookie");

  return Array.from(cookieJar, ([name, cookie]) => `${name}=${cookie.value}`).join("; ");
}

async function seedAccount(userId, label) {
  const { data, error } = await admin
    .from("mail_accounts")
    .insert({
      user_id: userId,
      provider: "google",
      provider_account_id: `phase9-${label}-${randomUUID()}`,
      email_address: `${label}-${randomUUID()}@example.com`,
      scopes_granted: ["https://www.googleapis.com/auth/gmail.readonly"],
      status: "active",
    })
    .select("id")
    .single();
  assertNoError(error, `Seeding ${label} mail account failed`);
  return data.id;
}

async function seedMessage(userId, accountId, label) {
  const { data, error } = await admin
    .from("messages")
    .insert({
      user_id: userId,
      mail_account_id: accountId,
      provider_message_id: `phase9-${label}-${randomUUID()}`,
      received_at: new Date().toISOString(),
      from_address: "sender@example.com",
      subject: `${label} ownership probe`,
      snippet: "Phase 9 verification data",
      classification_status: "pending",
    })
    .select("id")
    .single();
  assertNoError(error, `Seeding ${label} message failed`);
  return data.id;
}

const suffix = randomUUID();
const emailA = `phase9-a-${suffix}@example.com`;
const emailB = `phase9-b-${suffix}@example.com`;
const passwordA = `Phase9-A-${suffix}!`;
const passwordB = `Phase9-B-${suffix}!`;
let userAId;
let userBId;

try {
  const health = await fetch(`${supabaseUrl}/auth/v1/health`, {
    signal: AbortSignal.timeout(5_000),
  });
  assert.equal(health.ok, true, "Supabase Auth health check failed");

  const signupClient = createAnonymousClient();
  const { data: signup, error: signupError } = await signupClient.auth.signUp({
    email: emailA,
    password: passwordA,
  });
  assertNoError(signupError, "Email/password signup failed");
  assert.ok(signup.user, "Signup did not create a user");
  assert.ok(signup.session, "Local signup did not establish a session");
  userAId = signup.user.id;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userAId)
    .single();
  assertNoError(profileError, "Signup profile trigger failed");
  assert.equal(profile.id, userAId);

  const { data: createdB, error: createBError } = await admin.auth.admin.createUser({
    email: emailB,
    password: passwordB,
    email_confirm: true,
  });
  assertNoError(createBError, "Creating second verification user failed");
  assert.ok(createdB.user, "Second verification user was not created");
  userBId = createdB.user.id;

  const clientA = createAnonymousClient();
  const clientB = createAnonymousClient();
  const { error: signInAError } = await clientA.auth.signInWithPassword({
    email: emailA,
    password: passwordA,
  });
  const { error: signInBError } = await clientB.auth.signInWithPassword({
    email: emailB,
    password: passwordB,
  });
  assertNoError(signInAError, "User A sign-in failed");
  assertNoError(signInBError, "User B sign-in failed");

  const accountAId = await seedAccount(userAId, "a");
  const accountBId = await seedAccount(userBId, "b");
  const messageBId = await seedMessage(userBId, accountBId, "b");

  const { error: secretError } = await admin.from("mail_account_secrets").insert({
    mail_account_id: accountAId,
    user_id: userAId,
    refresh_token_ciphertext: Buffer.from("phase9-test-refresh-token"),
    token_payload_version: 1,
  });
  assertNoError(secretError, "Seeding service-role-only secret failed");

  const { data: ownAccounts, error: ownError } = await clientA
    .from("mail_accounts")
    .select("id")
    .eq("id", accountAId);
  assertNoError(ownError, "Owner account read failed");
  assert.equal(ownAccounts.length, 1, "Owner could not read their own account");

  const { data: otherAccounts, error: otherAccountError } = await clientA
    .from("mail_accounts")
    .select("id")
    .eq("id", accountBId);
  assertNoError(otherAccountError, "Cross-user account read returned an API error");
  assert.equal(otherAccounts.length, 0, "User A could read User B's account");

  const { data: otherMessages, error: otherMessageError } = await clientA
    .from("messages")
    .select("id")
    .eq("id", messageBId);
  assertNoError(otherMessageError, "Cross-user message read returned an API error");
  assert.equal(otherMessages.length, 0, "User A could read User B's message");

  const { data: updated, error: updateError } = await clientA
    .from("mail_accounts")
    .update({ nickname: "not-owned" })
    .eq("id", accountBId)
    .select("id");
  assertNoError(updateError, "Cross-user update returned an API error");
  assert.equal(updated.length, 0, "User A could update User B's account");

  const { data: deleted, error: deleteError } = await clientA
    .from("messages")
    .delete()
    .eq("id", messageBId)
    .select("id");
  assertNoError(deleteError, "Cross-user delete returned an API error");
  assert.equal(deleted.length, 0, "User A could delete User B's message");

  const { data: secretRows, error: secretReadError } = await clientA
    .from("mail_account_secrets")
    .select("mail_account_id")
    .eq("mail_account_id", accountAId);
  assert.ok(
    secretReadError || secretRows.length === 0,
    "Authenticated user could read service-role-only mailbox secrets",
  );

  const { error: resetError } = await clientA.auth.resetPasswordForEmail(emailA, {
    redirectTo: `${appUrl}/auth/callback?next=/update-password`,
  });
  assertNoError(resetError, "Password recovery request failed");
  await waitForRecoveryEmail(emailA);

  const cookieHeader = await createSsrSession(emailA, passwordA);
  const protectedResponse = await fetch(`${appUrl}/app`, {
    headers: { cookie: cookieHeader },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(
    protectedResponse.status,
    200,
    `Authenticated /app request returned ${protectedResponse.status}`,
  );
  const protectedHtml = await protectedResponse.text();
  assert.match(protectedHtml, /EasyMail recap/);

  const publicClient = createAnonymousClient();
  const { data: anonymousRows, error: anonymousError } = await publicClient
    .from("mail_accounts")
    .select("id");
  assertNoError(anonymousError, "Anonymous account read returned an API error");
  assert.equal(anonymousRows.length, 0, "Anonymous client could read mail accounts");

  console.log("Phase 9 integration verification passed:");
  console.log("- Supabase email/password signup and sign-in");
  console.log("- automatic profile creation");
  console.log("- password recovery email delivery");
  console.log("- authenticated SSR cookie and protected app route");
  console.log("- owner access and cross-user RLS isolation");
  console.log("- service-role-only mailbox secret isolation");
  console.log("- anonymous data isolation");
} finally {
  for (const userId of [userAId, userBId]) {
    if (userId) await admin.auth.admin.deleteUser(userId);
  }
}
