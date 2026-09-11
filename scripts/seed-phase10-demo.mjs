import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
assert.ok(supabaseUrl, "Missing NEXT_PUBLIC_SUPABASE_URL");
assert.ok(serviceRoleKey, "Missing SUPABASE_SERVICE_ROLE_KEY");

const localUrl = new URL(supabaseUrl);
assert.ok(
  ["127.0.0.1", "localhost"].includes(localUrl.hostname),
  "Phase 10 demo data may only be seeded into local Supabase.",
);

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const requestedEmail = process.env.DEMO_USER_EMAIL?.toLowerCase();
const { data: usersPage, error: usersError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 100,
});
if (usersError) throw usersError;
const users = usersPage.users.filter((user) => user.email);
const user = requestedEmail
  ? users.find(({ email }) => email?.toLowerCase() === requestedEmail)
  : users.length === 1
    ? users[0]
    : null;

assert.ok(
  user,
  requestedEmail
    ? "DEMO_USER_EMAIL does not match a local user."
    : "Set DEMO_USER_EMAIL because the local stack has zero or multiple users.",
);

const now = Date.now();
const hoursAgo = (hours) => new Date(now - hours * 60 * 60 * 1000).toISOString();
const accountSeeds = [
  {
    user_id: user.id,
    provider: "google",
    provider_account_id: "phase10-demo-school",
    email_address: "school.demo@example.com",
    nickname: "School Gmail",
    scopes_granted: [],
    status: "active",
    last_synced_at: hoursAgo(0.25),
  },
  {
    user_id: user.id,
    provider: "microsoft",
    provider_account_id: "phase10-demo-work",
    email_address: "work.demo@example.com",
    nickname: "Work Outlook",
    scopes_granted: [],
    status: "active",
    last_synced_at: hoursAgo(0.5),
  },
];

const { data: accounts, error: accountsError } = await admin
  .from("mail_accounts")
  .upsert(accountSeeds, { onConflict: "user_id,provider,provider_account_id" })
  .select("id,provider_account_id");
if (accountsError) throw accountsError;
const accountId = new Map(
  accounts.map((account) => [account.provider_account_id, account.id]),
);

const fixtures = [
  {
    key: "advisor-response",
    account: "phase10-demo-school",
    received: 1,
    from: "Dr. Maya Chen",
    address: "maya.chen@example.edu",
    subject: "Capstone review — one decision needed",
    snippet: "Can you confirm which research direction you want to present by Friday?",
    body: "Hi,\n\nI reviewed the two capstone directions. Both are viable, but the presentation needs one clear choice. Can you confirm which direction you want to present by Friday?\n\nBest,\nMaya",
    intent: "needs_reply",
    reason: "The sender asks for a direct decision and expects a response.",
    action: "Reply with the selected research direction by Friday.",
  },
  {
    key: "expense-action",
    account: "phase10-demo-work",
    received: 2,
    from: "Finance Operations",
    address: "finance@example.com",
    subject: "Expense report needs one receipt",
    snippet: "Upload the missing hotel receipt before the report can be approved.",
    body: "Your August expense report is almost ready. The hotel line is missing its receipt. Upload it before September 14 so the report can move to approval.",
    intent: "needs_action",
    reason: "A concrete task must be completed before a stated deadline.",
    action: "Upload the hotel receipt by September 14.",
  },
  {
    key: "team-question",
    account: "phase10-demo-work",
    received: 3,
    from: "Jordan Lee",
    address: "jordan.lee@example.com",
    subject: "Can you review the launch notes?",
    snippet: "I marked two sections where your confirmation would unblock the team.",
    body: "I finished the launch notes and marked two sections that need your confirmation. Could you review them before tomorrow's stand-up?",
    intent: "needs_reply",
    reason: "A teammate explicitly requests confirmation before a meeting.",
    action: "Review two marked sections before tomorrow's stand-up.",
  },
  {
    key: "office-hours",
    account: "phase10-demo-school",
    received: 5,
    from: "Student Services",
    address: "services@example.edu",
    subject: "Advising hours moved next week",
    snippet: "Tuesday advising hours will run from 2–4 PM in Room 310.",
    body: "Please note that Tuesday advising hours will run from 2–4 PM in Room 310 next week. No response is needed.",
    intent: "matters",
    reason: "The schedule change is relevant, but no response is requested.",
    action: null,
  },
  {
    key: "policy-update",
    account: "phase10-demo-work",
    received: 7,
    from: "People Team",
    address: "people@example.com",
    subject: "Updated holiday schedule",
    snippet: "The year-end office closure dates are now confirmed.",
    body: "The year-end office closure dates are now confirmed. The complete schedule is available in the employee handbook.",
    intent: "matters",
    reason: "This is useful workplace awareness without a required action.",
    action: null,
  },
  {
    key: "event-promo",
    account: "phase10-demo-school",
    received: 9,
    from: "Campus Events",
    address: "events@example.edu",
    subject: "Tonight: outdoor movie on the quad",
    snippet: "Food trucks arrive at 7 PM and the movie begins after sunset.",
    body: "Join us for an outdoor movie on the quad tonight. Food trucks arrive at 7 PM and the movie begins after sunset.",
    intent: "can_ignore",
    reason: "This is an optional promotional announcement with no obligation.",
    action: null,
  },
  {
    key: "product-digest",
    account: "phase10-demo-work",
    received: 11,
    from: "Product Weekly",
    address: "digest@example.com",
    subject: "This week's product news",
    snippet: "A roundup of launches, essays, and community links.",
    body: "Your weekly roundup of launches, essays, and community links is ready.",
    intent: "can_ignore",
    reason: "A recurring digest can be safely skipped in the current recap.",
    action: null,
  },
  {
    key: "retail-newsletter",
    account: "phase10-demo-school",
    received: 13,
    from: "Northline Store",
    address: "news@example-shop.com",
    subject: "Final hours: members save 20%",
    snippet: "The seasonal promotion ends at midnight.",
    body: "Members save 20% on selected seasonal items until midnight.",
    intent: "cleanup_candidate",
    reason: "This recurring promotional sender is a candidate for later cleanup.",
    action: null,
  },
  {
    key: "travel-deals",
    account: "phase10-demo-work",
    received: 18,
    from: "Weekend Fare Alerts",
    address: "alerts@example-travel.com",
    subject: "Three flight deals from your city",
    snippet: "Browse this week's promotional fare alerts.",
    body: "Here are three promotional fare alerts from your city for this weekend.",
    intent: "cleanup_candidate",
    reason: "Frequent promotional mail makes this sender a cleanup candidate.",
    action: null,
  },
];

for (const fixture of fixtures) {
  const { data: message, error: messageError } = await admin
    .from("messages")
    .upsert(
      {
        user_id: user.id,
        mail_account_id: accountId.get(fixture.account),
        provider_message_id: `phase10-demo-${fixture.key}`,
        received_at: hoursAgo(fixture.received),
        from_address: fixture.address,
        from_name: fixture.from,
        subject: fixture.subject,
        snippet: fixture.snippet,
        body_text: fixture.body,
        body_retained_until: hoursAgo(-7 * 24),
        classification_status: "classified",
        is_handled: false,
      },
      { onConflict: "mail_account_id,provider_message_id" },
    )
    .select("id")
    .single();
  if (messageError) throw messageError;

  const { error: classificationError } = await admin
    .from("message_classifications")
    .upsert({
      message_id: message.id,
      user_id: user.id,
      model_intent: fixture.intent,
      effective_intent: fixture.intent,
      reason: fixture.reason,
      action_signal: fixture.action,
      is_user_override: false,
      model_id: "phase10-demo-fixture-v1",
      classified_at: hoursAgo(fixture.received - 0.1),
    });
  if (classificationError) throw classificationError;
}

const pendingAccountId = accountId.get("phase10-demo-work");
const { error: pendingError } = await admin.from("messages").upsert(
  {
    user_id: user.id,
    mail_account_id: pendingAccountId,
    provider_message_id: "phase10-demo-pending",
    received_at: hoursAgo(0.5),
    from_address: "updates@example.com",
    from_name: "Project Updates",
    subject: "Weekly project activity",
    snippet: "This message is intentionally pending for the UI state.",
    classification_status: "pending",
    is_handled: false,
  },
  { onConflict: "mail_account_id,provider_message_id" },
);
if (pendingError) throw pendingError;

console.log(`Seeded ${fixtures.length} classified messages and 1 pending message.`);
console.log(
  "Local-only fixture complete. No provider credentials or secrets were created.",
);
