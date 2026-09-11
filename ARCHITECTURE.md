# Architecture

> Phase 6 — technical architecture for EasyMail MVP.  
> Supports `MVP.md` and `UX.md`. No production code in this phase.  
> Research references checked 2026-09-10 against Google, Microsoft, and Vercel docs.

## Architecture Goals

- Smallest stack that delivers multi-Gmail + Outlook **classify → recap → triage**
- Least-privilege mail access (read-only; no send/modify scopes in MVP)
- Durable sync/classify jobs (first sync must not silently die)
- Clear ownership boundary for multi-user data (designed now; enforced in Phase 7)
- Avoid full mail-client infrastructure

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Next.js App Router UI)                            │
│  Landing → Auth → Onboarding → Recap → Triage → Settings    │
└─────────────┬───────────────────────────────────────────────┘
              │ HTTPS (session cookies)
┌─────────────▼───────────────────────────────────────────────┐
│  Vercel (Next.js + Fluid Compute Functions)                 │
│  • App routes / Server Actions                              │
│  • OAuth start/callback (Google, Microsoft)                 │
│  • Recap/triage APIs                                        │
│  • Workflows/Cron: sync → classify → recap status           │
└──────┬──────────────┬───────────────────┬───────────────────┘
       │              │                   │
┌──────▼──────┐ ┌─────▼──────────┐ ┌──────▼──────────────┐
│ Supabase    │ │ Gmail API      │ │ Microsoft Graph     │
│ Auth +      │ │ gmail.readonly │ │ Mail.Read           │
│ Postgres    │ │ (+ history sync)│ │ (+ delta / messages)│
└─────────────┘ └────────────────┘ └─────────────────────┘
                      │
              ┌───────▼────────┐
              │ Vercel AI      │
              │ Gateway + AI   │
              │ SDK structured │
              │ classification │
              └────────────────┘
```

---

## Technology Decisions

| Concern | Choice | Why needed | Why selected | Main tradeoff |
| --- | --- | --- | --- | --- |
| **Frontend** | Next.js App Router (React) + TypeScript | Recap-first web UX from `UX.md` | Boring, SSR-friendly, first-class on Vercel; matches app shell + auth cookie patterns | Not a native mobile app (acceptable for MVP; deep links open provider web/apps) |
| **Backend** | Next.js Route Handlers + Server Actions on **Vercel Fluid Compute (Node.js)** | OAuth, sync orchestration, recap reads, corrections | One deployable unit; 300s default function window helps sync batches; avoid separate API server | Long syncs must be **chunked/durable** (workflows), not one giant request |
| **Database** | **Supabase Postgres** | Users, mail accounts, messages metadata, classifications, job state | Auth + Postgres + RLS in one place; good fit for ownership rules in Phase 7 | Couples us to Supabase; fine for MVP scale |
| **App authentication** | **Supabase Auth** (email magic link **or** email/password) | EasyMail user identity separate from mailbox OAuth | Lets one user link **multiple** Gmail + Outlook identities; avoids “Sign in with Google” conflating app user with one mailbox | Slightly more setup than “Sign in with Google only” |
| **Mailbox OAuth** | Google OAuth + Microsoft identity platform (auth code + refresh) | Access school/personal Gmail and work Outlook | Official provider APIs; refresh tokens enable background sync | Google `gmail.readonly` is a **restricted** scope (verification/CASA for public); Microsoft may need admin consent in some tenants |
| **Mail APIs** | **Gmail API** + **Microsoft Graph** | Fetch recent messages for classification | Official, documented sync models (Gmail history; Graph messages/`webLink`) | Two integration codepaths to maintain |
| **AI** | **Vercel AI Gateway** + **AI SDK** structured output (`generateObject` / schema) | Intent classification (+ optional short “why”) | Provider-swappable models, structured JSON for intents, observability; no training on user data by default policies of gateway/providers (still verify in Phase 7/14) | Classification cost + latency; quality must be measured |
| **Recap generation** | **Deterministic recap** from stored classifications (not a free-form LLM essay) | Trustworthy “what needs you” summary | Reduces hallucination vs narrative LLM; cheaper; matches triage data | Less “written by AI” prose; can add optional LLM polish later |
| **Background jobs** | **Vercel Workflows** for sync→classify pipelines; **Vercel Cron** for periodic refresh | First sync + ongoing ingest must survive timeouts/retries | Workflows give durable steps; Cron triggers incremental sync without a worker fleet | Workflows/Queues are newer platform primitives (public docs); keep jobs idempotent |
| **Hosting** | Vercel | Deploy Next.js + functions + cron/workflows | Matches stack; simple preview deploys | Cold start / duration limits → design chunked sync |
| **File storage** | None for MVP | Not storing attachments as product surface | Avoid Blob complexity | Snippets/bodies in DB only as needed for classify/display |
| **Email/SMS/push** | None for MVP | Digests/push are LATER | Stay in-app for founder validation | No proactive push when new mail arrives (Cron lag) |
| **Payments** | None for MVP | Personal validation first (DEC-005) | Zero billing infra | Add later |
| **Analytics** | Optional **Vercel Analytics** only (privacy-light) | Basic traffic if useful | Minimal | No product analytics suite yet |
| **Error monitoring** | **Vercel Observability** + structured server logs; add **Sentry** if noise overwhelms | Catch sync/OAuth/classify failures | Start with platform tools; don’t add two APM products | May need Sentry before beta |

---

## External Dependencies

### Google (Gmail)

- **OAuth scope (MVP):** `https://www.googleapis.com/auth/gmail.readonly`  
  Source: [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes) — **restricted** scope; least privilege for reading message content. Do **not** request `gmail.modify`, `gmail.compose`, or `https://mail.google.com/`.
- **APIs:** `messages.list`, `messages.get` (prefer metadata + body text/snippet as needed), `history.list` for partial sync ([sync guide](https://developers.google.com/gmail/api/guides/sync)).
- **Compliance note:** Public apps storing/transmitting restricted-scope data require Google OAuth verification and may require security assessment (CASA). **Founder/testing** can use OAuth consent **Testing** mode with allowlisted test users before verification.
- **Deep link (best effort):** Gmail web URL patterns using account + message id; always keep UX fallback (`UX.md`).

### Microsoft (Outlook / Microsoft 365)

- **OAuth (delegated):** `Mail.Read`, `offline_access`, `User.Read`  
  Source: [Microsoft Graph auth on behalf of a user](https://learn.microsoft.com/en-us/graph/auth-v2-user).  
  `Mail.Read` = read signed-in user’s mailbox only; no send. `offline_access` = refresh token for background sync.
- **APIs:** `GET /me/messages` (and delta where practical); store Graph **`webLink`** when present for “Open in Outlook”.
- **Tenant risk:** Some work accounts may require admin consent; surface clear reconnect/error UX.

### Vercel AI Gateway

- Structured classification JSON: primary intent enum + short reason + optional deadline/action text.
- Model choice is **swappable** via `provider/model` string (start with a cost-efficient chat model that supports structured outputs; pin in config, not scattered code).

### Supabase

- Auth sessions (cookie-based SSR with `@supabase/ssr` patterns).
- Postgres for app data; service role only on server for token crypto and jobs.

---

## System Components

1. **Web app** — Recap, triage, onboarding, settings UI  
2. **Auth service** — Supabase Auth for EasyMail users  
3. **Mailbox connector** — OAuth + token refresh for Google/Microsoft  
4. **Ingest/sync worker** — Workflow steps: list recent messages → upsert → enqueue classify  
5. **Classifier** — AI Gateway structured classify per message (batched)  
6. **Recap builder** — Deterministic assembly from classified rows + time window  
7. **Data store** — Postgres (accounts, messages, labels, corrections, sync cursors, job runs)  
8. **Secrets** — Env vars on Vercel; app-level encryption key for refresh tokens (details Phase 7)

---

## Major Data / Request Flows

### A. Sign up / sign in

1. User authenticates via Supabase Auth.  
2. Session cookie established for Next.js SSR.  
3. If no mail accounts → Onboarding; else → Home Recap.

### B. Connect Gmail / Outlook

1. Logged-in user starts OAuth (state bound to EasyMail `user_id` + provider + CSRF nonce).  
2. Provider consent (read-only scopes).  
3. Callback exchanges code → access + refresh tokens.  
4. Server stores encrypted tokens + mailbox email + provider account id.  
5. Triggers **initial sync workflow** for that account.  
6. UI shows syncing → partial/complete recap.

### C. Initial / incremental sync

1. **Full sync (first time):** fetch rolling window (e.g. last 7–14 days or N most recent messages — exact N in Phase 7/build).  
2. Persist message metadata + body text/snippet needed for classification (not unbounded archive).  
3. Store sync cursor (`historyId` for Gmail; delta/token or timestamp for Graph).  
4. **Incremental:** Cron or manual “Sync now” runs partial sync; on Gmail history 404 → full sync fallback (per Google sync docs).  
5. New/changed messages marked `classification_status=pending`.

### D. Classify

1. Workflow/worker picks pending messages (batch, rate-limited).  
2. Calls AI Gateway with schema:  
   `intent ∈ {needs_reply, needs_action, matters, can_ignore, cleanup_candidate}`  
   + `reason` (short) + optional `action_signal`.  
3. Writes classification; respects **user corrections** as override (never auto-clobber correction without policy — Phase 7).  
4. Idempotent on `message_id`.

### E. Recap + triage (read path)

1. Client requests Home with time window (`since_last_visit` | `today` | `24h`).  
2. Server loads classified messages for user’s accounts in window.  
3. Builds deterministic recap sections per `UX.md`.  
4. Triage filters by intent/account.

### F. Correct intent

1. User sets new intent.  
2. Server stores override + correction event (for learning/eval later).  
3. Recap/triage reflect immediately.

### G. Open in native mail

1. Prefer provider `webLink` / constructed Gmail URL.  
2. On failure → UX fallback instructions.

### H. Disconnect / logout / delete

1. Disconnect: revoke token where supported; delete encrypted tokens; remove or tombstone that account’s messages from EasyMail views.  
2. Logout: end Supabase session.  
3. Delete account: remove EasyMail user data (Phase 7 retention rules); provider mail untouched.

---

## Deployment Model

| Environment | Purpose |
| --- | --- |
| **Local** | `next dev` + local/Supabase project; OAuth redirect URIs for localhost |
| **Preview** | Vercel preview deployments for branches (optional for personal MVP) |
| **Production** | Vercel production project; Supabase production project; Google/Microsoft prod OAuth clients |

**Runtime:** Node.js on Fluid Compute (not Edge-by-default).  
**Config:** env vars for Supabase, Google client, Microsoft client, AI Gateway key, token encryption secret.  
**Cron:** e.g. every 10–15 minutes → enqueue incremental sync for accounts due.  
**No** separate Kubernetes, Redis cluster, or email-sending infrastructure in MVP.

---

## Security & Scale Requirements (architecture-level)

Accounted for now; detailed schema/policies in Phase 7:

| Requirement | Architectural response |
| --- | --- |
| User A must not read User B mail | All mail rows keyed by `user_id`; RLS + server checks |
| Least privilege | Read-only Gmail/Graph scopes only |
| Token theft impact | Encrypt refresh tokens; server-only access; revoke on disconnect |
| Restricted Gmail scope | Testing mode for founder; plan verification before public |
| Sync timeouts | Chunked Workflows; idempotent steps |
| AI cost blowups | Batch limits; rolling window; deterministic recap |
| No destructive mail actions | No write/send scopes; no mailbox mutation APIs in MVP |
| Logging | Do not log full email bodies or tokens |
| Rate limits | Per-user sync/classify caps; backoff on 429 |

**Scale:** Personal/founder first. Design for multi-user correctness, not hypothetical millions of mailboxes. No premature sharding/queues beyond Workflows/Cron.

---

## Explicit Non-Architecture (MVP)

- Custom IMAP sync engine  
- Full local mail replica / search index like a client  
- Real-time Gmail push (Pub/Sub) — optional later; Cron sufficient for MVP  
- Separate microservice per provider  
- Training custom models  
- Desktop/mobile native shells  

---

## Open Architecture Follow-ups (Phase 7+)

- Exact tables, encryption scheme, retention TTLs  
- Whether to store full body vs snippet+headers only after classify  
- Correction → future prompt/few-shot strategy  
- Google verification timeline if inviting others beyond test users  
- Whether Microsoft work tenant admin consent blocks founder Outlook (mitigate with UX + personal test if needed)

---

## Phase 6 Exit Check (internal)

- Architecture supports MVP multi-provider recap/triage: **yes**  
- No unnecessary infra (no payments, push, Redis, microservices): **yes**  
- Known security/scale (least privilege, ownership, restricted scopes, durable sync): **accounted for**
