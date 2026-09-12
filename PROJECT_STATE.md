# Project State

> This file is the progress source of truth. Agents must update it after meaningful work and before declaring a phase complete.

## Build Status

* **Project initialized:** Yes
* **Current phase:** Phase 11 — Integrations (Google OAuth/sync/classification vertical slice complete, verified end-to-end against a real account, and approved by the product owner; Microsoft Graph not started)
* **Current objective:** (this branch, `ui/design-system-v1`, isolated worktree) Implement EasyMail Design System v1 in controlled passes (A–G); do not merge until Phase 11 backend work on `main` is at a safe checkpoint. Microsoft Graph work continues separately on `main`, untouched by this branch.
* **Next milestone:** Pass B — application shell (app-header, toast provider, breadcrumb/back-nav).
* **Design gate:** Resolved by DEC-014 — EasyMail Design System v1 adopted, primary color and typography finalized (no longer provisional).
* **Last updated:** 2026-09-12 (Design System v1, Pass A — tokens — complete on `ui/design-system-v1`)

### Design System v1 progress (`ui/design-system-v1` branch only)

* Inventory/sourcing/conflict deliverable completed and approved (route inventory, component inventory, shadcn/Aceternity/Magic UI/21st.dev sourcing map, live-verified paid/membership gating for named third-party blocks, accessibility/responsive plans). Full plan on file.
* Two blocking decisions resolved by the product owner: (1) adopt the new brief's tokens as the authoritative v1, recorded as DEC-014, superseding DEC-011/012/013's specific hex values; (2) treat the brief's onboarding-wizard content as reference material for the *existing* Settings connect flow and Recap partial-setup panel, not a new gated route — preserves DEC-007 and `UX.md`'s "no tour walls" rule unchanged.
* `DESIGN_SYSTEM.md` fully rewritten as v1 (final, not provisional): new neutral palette, 4-level foreground hierarchy, updated semantic colors, shadcn-first sourcing rules, explicit Aceternity/Magic UI/21st.dev usage rules, and the permanent consistency rule.
* **Pass A (tokens/typography/primitives) — complete.** `globals.css` rewritten with v1 token values; existing utility class names (`text-text`, `bg-surface-muted`, etc.) kept as aliases onto the new hex values so every screen picks up the new palette immediately without a cascading rename, while canonical v1 names (`--foreground`, `--surface-subtle`, `--danger`, etc.) are defined for later passes to migrate onto. Verified: format, lint, typecheck, 43 unit tests, production build all pass; visually confirmed on landing, sign-in, and authenticated Recap (real data, real connected account) — no regressions, no broken styling.
* Passes B–G (shell, Recap/Triage/detail, Settings/states, auth/onboarding, landing rebuild, responsive/accessibility) not yet started.

## Phase Progress

* [x] Phase 1 — Problem
* [x] Phase 2 — Market
* [x] Phase 3 — Product Definition
* [x] Phase 4 — MVP Scope
* [x] Phase 5 — User Experience
* [x] Phase 6 — Technical Architecture
* [x] Phase 7 — Data & Security Design
* [x] Phase 8 — Project Setup
* [x] Phase 9 — Foundation Build
* [x] Phase 10 — Core Product Build
* [ ] Phase 11 — Integrations
* [ ] Phase 12 — Edge Cases & Reliability
* [ ] Phase 13 — Testing
* [ ] Phase 14 — Security Review
* [ ] Phase 15 — Performance & Observability
* [ ] Phase 16 — Beta Readiness
* [ ] Phase 17 — Beta Feedback
* [ ] Phase 18 — Production Readiness
* [ ] Phase 19 — Distribution & Launch
* [ ] Phase 20 — Measurement
* [ ] Phase 21 — Post-Launch Iteration
* [ ] Phase 22 — Scale

## Current Work

* Phase 8 rollback commit: `d6ca8a0` (`chore: checkpoint completed phase 8 setup`).
* Phase 9 foundation implemented: public landing, auth screens/actions/callback/recovery, cookie-session proxy, protected app shell, settings/logout, typed Supabase clients, ownership-safe data access, shared UI primitives, safe errors, structured logging, config-aware health endpoint.
* Phase 9 visual direction approved by DEC-012; final typography and primary color remain intentionally provisional until the Phase 10 Recap UI review.
* Local Supabase migration, live auth/session verification, and forced cross-user RLS isolation tests passed on 2026-09-11.
* Product owner manually verified the configured localhost UI/auth flow and approved the final Phase 9 review on 2026-09-11.
* Phase 10 checkpoint slice implemented: deterministic Recap from stored classifications, five-intent triage, message detail, audited user correction, partial setup, and empty/loading/error/pending states over the approved user-owned schema. Local-only demo fixtures support review without provider credentials.
* Phase 11 Google slice implemented (uncommitted): PKCE-protected `/api/oauth/google/start` + `/api/oauth/google/callback` (scope `gmail.readonly` only), AES-256-GCM token encryption/storage in `mail_account_secrets`, inline initial sync (14-day/300-message window) via the Gmail REST API, real AI Gateway classification (`generateObject`, default model `anthropic/claude-haiku-4.5`, never overwrites `is_user_override`), and a retention purge job (7-day body scrub, 14-day message delete, oauth_state expiry) exposed at a `CRON_SECRET`-gated `/api/internal/purge`. Settings gained a minimal connect-account entry point and connected-inbox list. All new Google/Microsoft/AI/Cron credentials stay optional in `env.ts`; missing config fails clearly at the integration boundary (`src/lib/integrations/config.ts`) rather than blocking build/lint/typecheck/tests — verified with a completely empty process environment. Microsoft Graph, incremental Cron sync, and full reconnect/disconnect UI are not yet implemented.
* Real end-to-end Google verification on 2026-09-11 against the product owner's actual `meronmatti123@gmail.com`, using their own Google Cloud OAuth client and Vercel AI Gateway key. OAuth consent, PKCE, token exchange/encryption, and reconnect all confirmed working against live services. Found and fixed three real bugs surfaced only by real data/volume (all re-verified: format, lint, typecheck, 43 unit tests, 10 RLS tests, production build all green after each fix):
  1. `gmailFetch` only retried on HTTP 429; Gmail's actual per-user rate limit response is HTTP 403 with body `reason: "rateLimitExceeded"` — now recognized and retried with backoff (`src/lib/integrations/google/gmail-client.ts`).
  2. A sync retry re-fetched (and re-burned Gmail quota on) messages already stored, since `ignoreDuplicates` only skips the DB write, not the API call — sync now skips already-stored `provider_message_id`s before calling Gmail at all (`src/lib/integrations/google/gmail-sync.ts`); a single message's persistent fetch failure also no longer aborts classification of the rest of the batch.
  3. `loadClassifiedMessages`'s `message_classifications` query passed the full message-id list in one `.in()` filter — errors with "URI too long" past roughly 150 real messages. Now batched into chunks of 100, queried in parallel (`src/lib/data/recap.ts`) — this is a Phase 10 data-layer bug Phase 10's own demo fixtures (a handful of messages) never exercised.
* Result (initial pass): 300 real Gmail messages synced and stored correctly; Recap/Triage render correctly against real data (0 classified — correctly excluded and counted as pending). AI classification was blocked at this point: every attempt failed with Vercel AI Gateway's own error, "Free tier requests on this model are rate-limited. Upgrade to paid credits" — confirmed non-transient (0 successes across 90+ seconds of continuous retries).
* Product owner added $15 paid credit to the Vercel AI Gateway account on 2026-09-11/12. Re-investigated rather than swapping models: confirmed via the Gateway's own `/v1/credits` endpoint that the configured `AI_GATEWAY_API_KEY` correctly resolves to the funded account/team (balance "15", totalUsed "0") and that `anthropic/claude-haiku-4.5` is a normal paid model with no free-tier restriction — a direct isolated `generateObject` call against it succeeded immediately. No configuration bug existed; the account genuinely had no credit during the first pass.
* Found and fixed one more real bug this pass: the model's `reason` field occasionally exceeds the 160-character schema limit (provider structured-output enforces the intent enum but not free-text length at the token level) — `generateObject` throws `NoObjectGeneratedError` and the classification was discarded. `classify.ts` now catches that specific error, truncates `reason`/`actionSignal` to 160 chars, and re-validates against the *same, unchanged* zod schema before giving up — a resilience fix, not a schema or architecture change. Verified via a temporary, deleted-after-use diagnostic route: an 8-message batch went from 4/8 → 5/8 → 10/10 succeeding after the fix.
* Classified all 300 real messages via the real `classifyPendingMessages` code path: 300/300 succeeded, 0 failures. Real intent distribution: needs_reply 9, needs_action 22, matters 39, can_ignore 17, cleanup_candidate 213. Recap and Triage now render real classified messages with correct reasoning text, correct account attribution, and correct timestamps. Manually corrected one message's classification through the real UI, then re-ran classification on it — `is_user_override`/`effective_intent` were confirmed untouched (`model_intent` still showed the original model suggestion), proving the override-protection constraint holds against a live model.
* Full suite re-verified after every fix in this pass: format, lint, typecheck, 43 unit tests, 10 RLS tests, production build all green. The temporary diagnostic route used to run controlled small batches was deleted after use — not part of the product's route surface.
* Remaining before Microsoft: disconnect UI still not implemented (deferred to a later step, per plan); incremental Cron sync and full reconnect/disconnect UX are the next Google-side work, likely folded into the Microsoft step per the original order.

## Completed Decisions

* DEC-001 — Initial target user is the product owner.
* DEC-002 — Problem framed as triage/attention across fragmented inboxes.
* DEC-003 — Do not enter as a Gmail-only AI client or Superhuman-style speed client.
* DEC-004 — EasyMail is a recap-first cross-inbox attention layer, not a mail client.
* DEC-005 — Business model hypothesis: personal/prosumer, below executive AI email pricing.
* DEC-006 — MVP = multi-Gmail + Outlook recap/triage; classify-only (no drafting or destructive automation).
* DEC-007 — Home is Recap-first; partial account setup allowed with persistent completion checklist.
* DEC-008 — Stack: Next.js/Vercel + Supabase + Gmail/Graph read-only + AI Gateway + Workflows/Cron; deterministic recap. **Preserved.**
* DEC-009 — User-owned schema; isolated AES-256-GCM tokens; body ≤7d / messages ≤14d; overrides not clobbered; cascade delete; rate limits. **Preserved.**
* DEC-010 — Mailopoly primary competitor; stay-native attention layer; Mailopoly-class unified inbox/EA is MVP non-goal. **Preserved.**
* DEC-011 — Approved UI/design constraints (`DESIGN_SYSTEM.md`); Geist + `#1F5FA9` provisional pending visual design review.
* DEC-012 — Phase 9 visual direction approved; final identity deferred to the authenticated Recap UI.
* DEC-013 — Phase 10 authenticated product visual direction approved; Geist Sans and `#1F5FA9` remain provisional.

## Open Questions

* Google OAuth verification/CASA timeline before non-test users
* Whether work Outlook tenant requires admin consent for the founder’s mailbox
* Model pin string for classification (choose at implementation; keep swappable)
* Lightweight personal classification quality tracking during founder use
* Precise pricing/packaging (after validation)
* Personal Mailopoly trial score vs EasyMail MVP success criteria (recommended)
* When to enable CI RLS job (needs Docker-capable runner)

## Blocking Decisions

None. The Google OAuth/sync/classification vertical slice is complete, verified end-to-end against a real account, and approved by the product owner. Microsoft Graph work requires separate authorization before it begins.

## Major Risks

* **Google restricted scope (`gmail.readonly`):** blocks broad public use until verification; testing mode OK for founder.
* **Microsoft admin consent:** may block some work mailboxes.
* **Sync durability / API rate limits:** must chunk and backoff.
* **AI misclassification:** still core product risk; corrections + deterministic recap mitigate.
* **Token storage:** high-value secrets — AES-256-GCM + service-role-only table required in build.
* **Deep link fragility:** use Graph `webLink` / best-effort Gmail URLs + UX fallbacks.
* **Mailopoly competitive overlap:** same JTBD; hold stay-native / intent / classify-only wedge (DEC-010).
* **Auth session race (observed, unconfirmed):** during UI dev-server testing on `ui/design-system-v1` (2026-09-11/12), a one-time `AppError` ("We could not load your workspace.") was thrown from `loadAccountsAndProfile` (`src/lib/data/recap.ts:97`) immediately after a sign-out → sign-in cycle; the very next request and all subsequent `/app`, `/app/triage`, `/app/settings` requests succeeded normally for the rest of the session. Replaying the exact same `profiles`/`mail_accounts` queries directly against the local PostgREST API for the affected user succeeded cleanly, ruling out a schema/RLS/data cause. `recap.ts` and the auth/session code have zero diff on `ui/design-system-v1` (UI-only branch), so this is pre-existing Phase 10/11 behavior, not introduced by the Design System work — likely a stale-cookie/prefetch timing edge around sign-out. Not reproduced on demand; needs a dedicated investigation on `main` before it can be called fixed.
  Recurred during Pass D verification (2026-09-12), immediately after sign-in this time (not sign-out): the in-app error boundary's `reset()` ("Try again") did **not** recover it — retrying stayed on the same error — but a full page navigation to `/app` did recover cleanly. This narrows the likely cause toward a stale RSC/client-cache read on soft reset rather than a genuinely broken session, but still was not deliberately reproduced or fixed. No backend/auth/session code was touched to investigate further, since that is out of scope for a UI pass.

## Deferred / Later

* Gmail Pub/Sub push sync, LLM narrative recaps, payments, push digests, native apps
* EasyMail-as-MCP server (optional H1 from `MCP_EVALUATION.md`)
* Outlook/Microsoft Graph OAuth flow, sync, and classification wiring; incremental Cron-driven sync for both providers; full Settings reconnect/disconnect UI

## Recent Progress

* Created clean Phase 8 rollback commit `d6ca8a0` before Phase 9 changes.
* Restored complete DEC-003 through DEC-011 records in `DECISIONS.md` from the approved governing documents; decisions remain unchanged.
* Added DESIGN_SYSTEM token mapping, shadcn-style Button/Input/Alert primitives, Lucide icons, and responsive landing/auth/app-shell surfaces.
* Added email/password signup/sign-in, confirmation callback, password recovery/update, logout, per-request Supabase SSR clients, cookie refresh proxy, verified-user DAL pattern, safe redirect/error handling, structured logs, and health response convention.
* Recorded the first visual-review outcome and revised only Phase 9 surfaces: tightened the landing composition, replaced the generic benefits checklist with an editorial EasyMail attention brief, removed card styling from auth, aligned shell language to recap/attention concepts, and hid Next.js development chrome in review previews.
* DEC-012 approved the revised Phase 9 visual direction while deferring final font and primary-color choices to the authenticated Recap UI.
* Verified on 2026-09-11: format check, lint, typecheck, 11 unit tests, and a successful Next.js 16.3.4 production build using the live local Supabase environment.
* Reset the local Supabase database from the committed migration and passed the permanent `verify:phase9` system check: signup/sign-in, automatic profile creation, recovery-email delivery, SSR session cookie, authenticated protected route, owner/cross-user/anonymous isolation, and service-role-only secret isolation.
* Forced `RUN_RLS_TESTS=1 npm run test:rls`; all four cross-user RLS tests passed with no skips.
* Exercised the rendered production server-action forms over HTTP: signup established a session, `/app` returned 200, logout invalidated access and restored the guard redirect, and re-login restored authenticated access.
* Audited the source boundary and found no accidental Phase 10 implementation.
* Began Phase 10 after explicit product-owner authorization and preserved all Phase 1–9 decisions.
* Added an authenticated, Recap-first product slice backed by stored user-owned messages and effective classifications, with five-intent triage, account filters, message detail, and loading/empty/error/pending/setup states.
* Added an atomic owner-scoped classification-correction RPC that writes the immutable correction audit and override together; direct authenticated classification/audit writes are revoked.
* Added deterministic recap unit coverage, local-only review fixtures, and expanded RLS coverage. Checkpoint verification passes: formatting, lint, typecheck, 15 unit tests, 7 forced local RLS tests, and production build.
* Refined the approved Phase 10 visual direction without changing the UX model: stronger active navigation, denser message hierarchy, one neutral icon-and-label intent language, separated intent/inbox filters, and a message-first detail with a dedicated correction trust area. Geist Sans and `#1F5FA9` remain provisional.
* Implemented successful-load recap visit tracking with a 30-minute refresh-stable server-side window and atomic compare-and-set RPC. Default Recap advances it only after data loads; triage, detail, settings, and alternate windows do not.
* Reverified the refined checkpoint: formatting, lint, typecheck, 17 unit tests, 8 forced local RLS tests, production build, authenticated browser routes, Recap-only visit advancement, and persisted correction behavior.
* Product owner approved the Phase 10 visual direction and requested only two closeout fixes: the EasyMail brand link now uses a rounded design-system keyboard focus ring, and the correction control/column is wide enough for every full intent label.
* Final interactive verification submitted the actual correction server action, persisted one owner override and one immutable audit row, and verified the complete recap-visit lifecycle including refresh stability and 30-minute expiry rollover. The run exposed and fixed a Next.js runtime-only action-module export violation.
* Final Phase 10 suite passes: format, lint, typecheck, 17 unit tests, 8 forced local RLS tests, production build, authenticated interaction checks, and diff inspection.
* Product owner gave final Phase 10 approval on 2026-09-11. Closeout diff/status review found no accidental files, secrets, debug artifacts, or Phase 11 scope; `.env.local`, `node_modules`, `.next`, and local Supabase data remain untracked; `git diff --check` passed. Created the Phase 10 checkpoint commit.

## Phase 11 Google Checkpoint

* **Google OAuth — Complete.** PKCE-protected `/api/oauth/google/start` + `/api/oauth/google/callback`, single-use `oauth_states` CSRF row, `gmail.readonly` scope only. Verified with a real Google Cloud OAuth client and a real Google account, including the Testing-mode unverified-app consent screen and a full reconnect (re-authorization).
* **Token storage — Complete.** AES-256-GCM encryption (`src/lib/crypto/token-cipher.ts`), stored in `mail_account_secrets` as a Postgres bytea hex literal. RLS-verified deny-all for `authenticated`/`anon`; an RLS test round-trips a real encrypted token through a live Postgres row.
* **Gmail sync — Complete.** Real inline sync via the Gmail REST API (14-day/300-message window). Verified against a real inbox: 300 real messages fetched and stored correctly (subjects, senders, bodies, retention deadlines). Two real bugs found via real data volume and fixed: Gmail's 403-coded rate-limit response wasn't recognized as retryable, and a sync retry re-fetched (re-burning quota on) messages already stored — both fixed and re-verified.
* **Production AI classification — Complete.** Real Vercel AI Gateway calls (`generateObject`, model `anthropic/claude-haiku-4.5`) against the product owner's own paid-credit Gateway account. Verified against all 300 real synced messages: 300/300 classified, 0 failures, sensible real-world intent distribution. A schema near-miss (model's `reason` field occasionally exceeding 160 chars — a known structured-output limitation, not a schema/architecture issue) is repaired via truncation + re-validation against the unchanged schema rather than discarding the classification.
* **Real end-to-end verification — Complete.** Full loop verified with real data: OAuth → encrypted token storage → Gmail sync → AI classification → stored classifications → Recap/Triage rendering → user correction. A manual correction was confirmed to survive a live reclassification pass (`is_user_override`/`effective_intent` untouched, `model_intent` unchanged) — the override-protection constraint holds against a real model, not just in tests.
* **Boundary check:** No compose/draft/send/archive/delete/unsubscribe, no Microsoft/Graph code, no destructive automation. Read-only `gmail.readonly` scope only.
* **Microsoft — Not started.**
* **Status:** Approved by the product owner. Retention purge (7-day body scrub, 14-day message delete, oauth_state expiry) is implemented and manually verified but not yet wired to a schedule — Cron wiring is planned alongside Microsoft's incremental sync. Disconnect UI and full reconnect/disconnect UX are not yet implemented.

## Phase 10 Visual Checkpoint

* **Implemented:** Authenticated Recap, window selection, five-intent triage/account filtering, message detail, deterministic stored-classification grouping, atomic correction/override auditing, partial-account and pending-classification notices, and empty/loading/error states.
* **Data source:** Approved user-owned schema through verified Supabase sessions and RLS; no client-supplied user identity.
* **Review data:** `scripts/seed-phase10-demo.mjs` is local-host restricted and creates no provider credentials or secret rows.
* **Verification:** Format, lint, typecheck, 17 unit tests, 8 forced local RLS tests, authenticated browser checks, and the Next.js production build pass on 2026-09-11.
* **Boundary check:** No OAuth, provider API, sync worker, production model classification, compose/draft/send/archive/delete/unsubscribe, or destructive automation.
* **Status:** Approved by the product owner. The two requested closeout fixes are implemented and verified. Typography and primary color remain provisional.

## Phase 10 Exit Review

* **Core user can obtain promised value — Pass.** An authenticated user can obtain a deterministic cross-inbox Recap from stored classifications, filter all five intent views and accounts, inspect message context, and correct a classification without mutating the underlying mailbox.
* **Acceptance criteria pass — Pass.** Authenticated shell, Recap-first home, five-intent triage, user-owned data access, detail, correction/audit flow, empty/loading/error/pending/partial-setup states, deterministic grouping, and refresh-stable visit tracking are implemented. No Phase 11 provider integration or destructive mail action is present.
* **Critical flows are tested — Pass.** Pure recap/window logic has unit coverage; owner/cross-user correction and visit idempotence have forced local RLS coverage; authenticated browser verification exercises the real correction server action, audit creation, keyboard focus, control width, Recap-only timestamp advancement, refresh stability, and 30-minute rollover. Format, lint, typecheck, all tests, production build, and diff checks pass.
* **Overall — Complete.** Technical Phase 10 exit criteria are satisfied and the product owner gave final approval on 2026-09-11. The Phase 10 checkpoint commit (`feat: checkpoint completed phase 10 core product`) has been created. Phase 11 has not begun.

## Phase 9 Exit Review

* **Foundation works end-to-end — Pass.** Production build, public/auth/protected routing, live local auth, session cookies, password-recovery delivery, database migration, health handling, and app shell were exercised successfully.
* **Authentication/ownership rules are verified — Pass.** Live signup/sign-in/session/logout behavior passed; forced RLS tests prove owner access, cross-user read/write isolation, anonymous isolation, and service-role-only secret isolation.
* **Core development patterns are established — Pass.** Typed environment and Supabase clients, per-request SSR auth, DAL ownership checks, shared UI primitives, structured logging, safe error/redirect conventions, migrations, unit tests, RLS tests, and the permanent live verifier are present and working.
* **Overall — Complete.** All Phase 9 technical exit criteria were satisfied and the product owner approved the final review on 2026-09-11. At that checkpoint, Phase 10 had not begun.

## Next Actions

1. Create the Phase 11 Google checkpoint commit (`feat: checkpoint phase 11 google integration`) — closeout in progress.
2. Obtain explicit authorization before beginning Microsoft Graph implementation or any UI redesign work.
3. Re-read the Phase 11 section of `BUILD_FROM_ZERO.md` before starting Microsoft work.

## State Management Rules

Agents must:

* Read this file before beginning substantive work.
* Treat the current phase as the default boundary for new work.
* Re-read the corresponding phase in `BUILD_FROM_ZERO.md` before working.
* Update this file after meaningful progress.
* Keep completed phases checked.
* Keep the current objective and next milestone accurate.
* Record material decisions in `DECISIONS.md`.
* Move deferred ideas to `BACKLOG.md` instead of expanding scope automatically.
* Never mark a phase complete without verifying its exit criteria.
* Never advance the current phase simply because code or documentation was created.
* Preserve unresolved questions, blockers, and risks until they are actually resolved.
