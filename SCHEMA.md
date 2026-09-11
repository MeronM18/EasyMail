# Schema

> Phase 7 — core data model for EasyMail MVP.  
> Aligns with `ARCHITECTURE.md`, `MVP.md`, `UX.md`, `SECURITY.md`, DEC-009.  
> Authoritative SQL for Phase 8+: `supabase/migrations/20260910220000_initial_schema.sql`.

## Ownership Rule (non-negotiable)

**Can User A ever read, change, reference, or delete User B’s data?**  
**No.** Every row that contains or derives from mailbox data is keyed by `user_id` (= Supabase `auth.users.id`). Row Level Security (RLS) and server queries both enforce `user_id = auth.uid()` (or explicit service-role jobs that always filter by a single `user_id`).

---

## Entity Relationship (logical)

```
auth.users (Supabase Auth)
    │ 1
    ▼
profiles ──────────────────────────────┐
    │ 1                                │
    ▼                                  │
mail_accounts ──1── mail_account_secrets (server-only)
    │ 1
    ▼
messages ──1── message_classifications
    │                │
    │                └── classification_corrections (0..n)
    │
sync_runs (0..n per mail_account)

oauth_states (ephemeral)
```

---

## Tables

### `profiles`

App-level user profile (1:1 with `auth.users`).

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE | Same as auth user |
| `display_name` | `text` | nullable | Optional |
| `last_recap_visit_at` | `timestamptz` | nullable | Powers “since last visit” window |
| `onboarding_completed_at` | `timestamptz` | nullable | Checklist complete marker (optional) |
| `created_at` | `timestamptz` | not null, default now() | |
| `updated_at` | `timestamptz` | not null, default now() | |

**RLS:** `id = auth.uid()` for SELECT/UPDATE; INSERT on signup (trigger).

---

### `mail_accounts`

Connected Gmail/Outlook mailboxes.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → `profiles.id` ON DELETE CASCADE | Owner |
| `provider` | `text` | not null, check ∈ (`google`,`microsoft`) | |
| `provider_account_id` | `text` | not null | Stable provider subject/id |
| `email_address` | `text` | not null | Mailbox address |
| `nickname` | `text` | nullable | School / Personal / Work |
| `scopes_granted` | `text[]` | not null | Audit of granted scopes |
| `status` | `text` | not null, check ∈ (`active`,`needs_reconnect`,`sync_error`,`disconnected`) | UX banners |
| `status_message` | `text` | nullable | Safe, non-sensitive error summary |
| `sync_cursor` | `jsonb` | nullable | Gmail `historyId` / Graph delta token / watermark |
| `last_synced_at` | `timestamptz` | nullable | |
| `last_sync_attempt_at` | `timestamptz` | nullable | |
| `created_at` / `updated_at` | `timestamptz` | not null | |

**Uniques:**  
- `UNIQUE (user_id, provider, provider_account_id)`  
- `UNIQUE (user_id, provider, email_address)`

**RLS:** owner full access to non-secret columns. **No token columns on this table.**

---

### `mail_account_secrets`

OAuth secrets isolated from client-readable tables.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `mail_account_id` | `uuid` | PK, FK → `mail_accounts.id` ON DELETE CASCADE | |
| `user_id` | `uuid` | not null, FK → `profiles.id` ON DELETE CASCADE | Denormalized for defense-in-depth |
| `refresh_token_ciphertext` | `bytea` | nullable | Encrypted; required for background sync |
| `access_token_ciphertext` | `bytea` | nullable | Encrypted |
| `access_token_expires_at` | `timestamptz` | nullable | |
| `token_payload_version` | `int` | not null, default 1 | Crypto/format versioning |
| `updated_at` | `timestamptz` | not null | |

**RLS:** **DENY all** for `anon` and `authenticated`. Access only via **service role** on the server.

---

### `messages`

Ingested mail for classification and triage (rolling window — not a full archive).

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → `profiles.id` ON DELETE CASCADE | |
| `mail_account_id` | `uuid` | not null, FK → `mail_accounts.id` ON DELETE CASCADE | |
| `provider_message_id` | `text` | not null | Gmail id / Graph id |
| `provider_thread_id` | `text` | nullable | |
| `received_at` | `timestamptz` | not null | |
| `from_address` | `text` | not null | |
| `from_name` | `text` | nullable | |
| `subject` | `text` | not null, default '' | |
| `snippet` | `text` | not null, default '' | Short preview for UI |
| `body_text` | `text` | nullable | Plain text (truncated); see retention |
| `body_retained_until` | `timestamptz` | nullable | When body must be scrubbed |
| `web_link` | `text` | nullable | Prefer Graph `webLink`; Gmail constructed URL |
| `is_handled` | `boolean` | not null, default false | EasyMail-local |
| `classification_status` | `text` | not null, check ∈ (`pending`,`classified`,`failed`,`skipped`) | |
| `raw_internal_date` | `timestamptz` | nullable | |
| `created_at` / `updated_at` | `timestamptz` | not null | |

**Uniques:** `UNIQUE (mail_account_id, provider_message_id)`

**RLS:** `user_id = auth.uid()` for SELECT/UPDATE. INSERT primarily via service role during sync.

**Do not store:** attachments, full HTML MIME, raw provider JSON dumps long-term.

---

### `message_classifications`

Current effective classification for a message.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `message_id` | `uuid` | PK, FK → `messages.id` ON DELETE CASCADE | |
| `user_id` | `uuid` | not null, FK → `profiles.id` ON DELETE CASCADE | |
| `model_intent` | `text` | not null, check ∈ intent enum | Last AI suggestion |
| `effective_intent` | `text` | not null, check ∈ intent enum | What UI uses |
| `reason` | `text` | nullable | Short “why” |
| `action_signal` | `text` | nullable | Deadline/event/task phrase if any |
| `is_user_override` | `boolean` | not null, default false | If true, AI must not clobber |
| `model_id` | `text` | nullable | e.g. `provider/model` string |
| `classified_at` | `timestamptz` | not null | |
| `updated_at` | `timestamptz` | not null | |

**Intent enum:** `needs_reply` | `needs_action` | `matters` | `can_ignore` | `cleanup_candidate`

**Override policy:** If `is_user_override = true`, reclassify jobs must not change `effective_intent` unless user clears override.

**Integrity:** Trigger enforces `user_id` matches parent `messages.user_id`.

---

### `classification_corrections`

Append-only audit for trust/eval.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK | |
| `message_id` | `uuid` | not null, FK → `messages.id` ON DELETE CASCADE | |
| `from_intent` | `text` | not null | |
| `to_intent` | `text` | not null | |
| `created_at` | `timestamptz` | not null, default now() | |

**RLS:** owner SELECT/INSERT; no UPDATE/DELETE from clients.

---

### `sync_runs`

Job observability (first sync + incremental).

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK | |
| `mail_account_id` | `uuid` | not null, FK → `mail_accounts.id` ON DELETE CASCADE | |
| `trigger` | `text` | check ∈ (`onboarding`,`cron`,`manual`) | |
| `status` | `text` | check ∈ (`queued`,`running`,`succeeded`,`failed`,`partial`) | |
| `stats` | `jsonb` | nullable | counts (no bodies) |
| `error_summary` | `text` | nullable | Safe summary |
| `started_at` / `finished_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | not null | |

**Uniques / concurrency:** at most one `queued|running` sync per `mail_account_id` (partial unique index).

**RLS:** owner SELECT; writes via service role.

---

### `oauth_states`

CSRF/state for mailbox OAuth (ephemeral).

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `state` | `text` | PK | Random unguessable |
| `user_id` | `uuid` | not null, FK | |
| `provider` | `text` | not null | |
| `code_verifier` | `text` | nullable | If PKCE used |
| `expires_at` | `timestamptz` | not null | ≤ 10 minutes |
| `created_at` | `timestamptz` | not null | |

**RLS:** deny client access; service role only.

---

## Integrity Constraints (critical)

1. All mail-derived tables include `user_id` NOT NULL + FK cascade.  
2. `messages` unique per `(mail_account_id, provider_message_id)`.  
3. `mail_accounts` unique per user+provider+provider_account_id.  
4. Intent columns constrained to enum.  
5. Secrets table inaccessible to JWT roles.  
6. One active sync run per account.  
7. FK cascades ensure disconnect/delete removes dependent mail data.  
8. `message_classifications.user_id` must match parent `messages.user_id` (DB trigger).

---

## Retention Defaults (MVP)

| Data | Retention |
| --- | --- |
| Message metadata + snippet + classification | **14 days** from `received_at`, then hard-delete |
| `body_text` | Keep ≤ **7 days** from ingest; then scrub to NULL |
| Sync window fetch | Roughly last **14 days** or last **N≈300** messages per account |
| `oauth_states` | Expire ≤ 10 minutes |
| `sync_runs` | Keep **30 days** |
| `classification_corrections` | Keep while message exists |
| Attachments | **Never stored** |

---

## Recap Read Model

No separate `recaps` table for MVP. Recap is **computed** from `messages` ⨝ `message_classifications` filtered by `user_id`, time window, and `is_handled` when used.

---

## Authorization Matrix (data layer)

| Actor | Can access |
| --- | --- |
| Browser (anon) | Nothing in app tables |
| Browser (authenticated JWT) | Own `profiles`, `mail_accounts` (no secrets), `messages`, classifications, corrections, own `sync_runs` |
| Vercel server (user session) | Same as user via RLS; never returns token fields |
| Vercel server (service role) | Secrets + sync/classify for a **specified** `user_id` / `mail_account_id` only |
| AI provider | Transient prompt payload only; not a data store of record |

---

## Migration Notes (Phase 8+)

- Enable RLS on all app tables immediately.  
- Create `mail_account_secrets` with grants only to `service_role`.  
- Signup trigger: create `profiles` row on `auth.users` insert.  
- Schedule purge cron for body scrub + 14-day message delete + oauth_state cleanup (build phases).  
- Automated RLS tests: `npm run test:rls` (see `TESTING.md`).
