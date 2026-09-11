# Security

> Phase 7 — authentication, authorization, secrets, retention, abuse controls.  
> Complements `SCHEMA.md` and `ARCHITECTURE.md`.  
> Implemented path: `supabase/migrations/20260910220000_initial_schema.sql` + `tests/rls/`.  
> Research anchors: [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), Microsoft Graph delegated `Mail.Read`, Supabase RLS patterns.

## Cross-User Access Question

> Can User A ever read, change, reference, or delete User B’s data?

**Answer: No — structurally prevented.**

- Every sensitive table includes `user_id` FK to the owning EasyMail user.  
- RLS policies: `(select auth.uid()) = user_id` (or `id`) with `TO authenticated`.  
- `mail_account_secrets` / `oauth_states`: **no** policies granting `authenticated` or `anon`; grants revoked.  
- Service-role jobs must query with explicit `user_id` / `mail_account_id` predicates.  
- API/Server Actions resolve the session user first; IDs in requests are authorized as owned by that user before mutation.  
- Automated verification path: `npm run test:rls` (`tests/rls/cross-user-isolation.test.ts`).

---

## Authentication

| Concern | Design |
| --- | --- |
| App login | Supabase Auth email/password; confirmation and password recovery callbacks implemented in Phase 9 |
| Session | Cookie-based SSR via `@supabase/ssr`; refreshed in Next.js Proxy and verified with `auth.getUser()` near protected data access |
| Mailbox linking | Separate OAuth (Google / Microsoft); not used as sole app identity |
| CSRF for mailbox OAuth | One-time `oauth_states` row bound to `user_id`, ≤10 min TTL, PKCE recommended |

---

## Authorization Rules

1. Must be logged in to connect mail, view recap/triage, correct intent, sync, disconnect.  
2. Mail account operations require ownership of `mail_accounts.id`.  
3. Message/classification operations require ownership of `messages.user_id`.  
4. No shared mailboxes / delegated team access in MVP.  
5. No admin backdoor UI in MVP. Human reading of user email content is **prohibited** except: user viewing their own data in-product; security incident investigation with documented need; legal requirement — aligned with Google **Limited Use**.
6. Protected Server Components and the data-access layer verify the Supabase user; data functions derive ownership from that verified session instead of request-supplied user IDs.

---

## OAuth Scopes (least privilege)

| Provider | Scopes | Forbidden in MVP |
| --- | --- | --- |
| Google | `https://www.googleapis.com/auth/gmail.readonly` | `gmail.modify`, `gmail.compose`, `gmail.send`, `https://mail.google.com/` |
| Microsoft | `Mail.Read`, `offline_access`, `User.Read` | `Mail.ReadWrite`, `Mail.Send`, application (app-only) mailbox permissions |

`gmail.readonly` is a **restricted** scope. Storing/transmitting this data on servers implies Google OAuth verification and likely **CASA** before public access. Founder use: OAuth consent **Testing** + allowlisted test users.

---

## Token Encryption & Access

### Encryption

- Algorithm: **AES-256-GCM** (application-level).  
- Key: `TOKEN_ENCRYPTION_KEY` (32-byte secret) in Vercel/Supabase env — **never** in the DB, client, or git.  
- Store: ciphertext in `mail_account_secrets`.  
- `token_payload_version` allows key rotation / format upgrades.  

### Access path

1. Only server workflows/route handlers with **service role** read `mail_account_secrets`.  
2. Decrypt in memory → call Gmail/Graph → discard plaintext.  
3. Never send tokens to the browser, logs, analytics, or AI prompts.  
4. On disconnect/delete: delete secrets row; attempt provider token revocation where supported.

---

## Sensitive Email Content Handling

| Data | Handling |
| --- | --- |
| Subject, from, snippet | Stored for UI + classify; user-owned; purged with retention |
| `body_text` | Truncated plain text only; **scrubbed within 7 days** |
| HTML / attachments | **Not stored** |
| Classifications / reasons | Derived data; same ownership + purge rules |
| AI prompts | Send minimum fields; no tokens |
| Logs | Message ids + account ids OK; **no** bodies/tokens |
| Limited Use | Use only for user-facing recap/triage/classify; no ads, no sale, no transfer except allowed exceptions |

---

## Retention & Deletion

### Automated retention

See `SCHEMA.md`: **14-day** message keep; **7-day** body keep; oauth state TTL; sync_run 30-day.

### Disconnect mailbox

1. Revoke provider token (best effort).  
2. Delete `mail_account_secrets` for that account.  
3. Delete `mail_accounts` row → CASCADE messages, classifications, corrections, sync_runs.  
4. Provider mailbox **unchanged**.

### Logout

- End Supabase session only. Mail links remain for next login.

### Delete EasyMail account (user request)

1. Confirm UX copy: does **not** delete Gmail/Outlook mail.  
2. Revoke all provider tokens (best effort).  
3. Delete all EasyMail data for `user_id` + Auth user.  
4. Confirm completion to user.

---

## Rate Limits & Abuse Controls

| Abuse / risk | Control |
| --- | --- |
| Sync storms | Max **1** in-flight sync per `mail_account_id`; manual sync cooldown **120s**/user; cron every **10–15 min** |
| Classify cost explosion | Batch size cap; max classifies/hour/user |
| OAuth CSRF / replay | Single-use state; short TTL; bind `user_id` |
| IDOR on message/account ids | Ownership check every request + RLS |
| Prompt injection via email | Treat email as untrusted text; structured output schema |
| Provider 429 | Exponential backoff; mark `sync_error` / retry later |
| Multi-account abuse | Soft cap ≤ **5** mail accounts/user for MVP |

---

## Transport & Platform Security

- HTTPS only (Vercel).  
- Secrets in env: `SUPABASE_SERVICE_ROLE_KEY`, `TOKEN_ENCRYPTION_KEY`, Google/Microsoft client secrets, `AI_GATEWAY_API_KEY`.  
- Never commit `.env`.  
- Prefer secure cookies (`Secure`, `HttpOnly`, `SameSite`).  
- Separate Google/Microsoft OAuth clients per environment (local/prod).

---

## Threat Model (MVP summary)

| Threat | Mitigation |
| --- | --- |
| Stolen DB backup | Tokens encrypted; bodies short-lived |
| Stolen session cookie | HTTPS + cookie flags; short session; re-auth for destructive delete |
| Stolen service role key | Catastrophic — protect env; rotate; least machines with access |
| User A guesses User B UUIDs | RLS + ownership checks |
| Malicious email content | Untrusted input; schema-constrained AI out |
| Insider reads mail | Policy + no admin UI; Limited Use |
| Over-scoped OAuth | Read-only scopes only |

---

## Compliance Posture (founder → public)

1. **Now (founder/testing):** Google OAuth Testing mode; allowlisted users; implement delete/disconnect; encrypt tokens; RLS.  
2. **Before public Gmail users:** Privacy policy (Limited Use disclosures); OAuth verification; prepare CASA if required.  
3. **Ongoing:** Delete-on-request remains a hard feature.

---

## Phase 7 Exit Check (internal)

- Core schema understood (`SCHEMA.md`): yes  
- Ownership explicit: yes  
- Authorization designed: yes  
- Sensitive data handling defined: yes  
- Critical integrity constraints exist: yes
