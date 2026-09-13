# Project State

> This file is the progress source of truth. Agents must update it after meaningful work and before declaring a phase complete.

## Build Status

* **Project initialized:** Yes
* **Current phase:** Phase 12 — Edge Cases & Reliability (**Complete.** An 8-item reliability audit (G1–G8) was approved, implemented on `feature/phase-12-reliability`, and approved by the product owner on unit-test-level evidence — see Phase 12 Reliability Checkpoint below. Exit criteria are demonstrated via unit tests of the extracted decision logic; none of G1–G8 has been exercised against its real triggering condition, and that remains explicitly unverified.)
* **Current objective:** Rotate the local-dev Microsoft OAuth client secret logged during Phase 11 setup, then begin the deferred incremental Cron sync + full Settings reconnect/disconnect UI work before Phase 13.
* **Next milestone:** Incremental Cron sync + full Settings reconnect/disconnect UI for both providers (deferred out of both Phase 11 and Phase 12), then Phase 13 — Testing.
* **Design gate:** Resolved by DEC-013. The authenticated product visual direction is approved; Geist Sans and `#1F5FA9` remain explicitly provisional.
* **Last updated:** 2026-09-13 (Phase 12 approved by the product owner and merged to `main`; `feature/phase-12-reliability` merged via fast-forward and pushed to `origin/main`)

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
* [x] Phase 11 — Integrations
* [x] Phase 12 — Edge Cases & Reliability
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

None. Both the Google and Microsoft/Outlook Phase 11 vertical slices are complete, live-verified end-to-end against real accounts, and approved by the product owner (final approval 2026-09-13). `feature/phase-11-outlook` was merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13 (`main` HEAD `ff3eccc`). Phase 12 (G1–G8 reliability fixes) is approved by the product owner on unit-test-level evidence and merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13.

## Major Risks

* **Google restricted scope (`gmail.readonly`):** blocks broad public use until verification; testing mode OK for founder.
* **Microsoft admin consent:** may block some work mailboxes.
* **Sync durability / API rate limits:** must chunk and backoff.
* **AI misclassification:** still core product risk; corrections + deterministic recap mitigate.
* **Token storage:** high-value secrets — AES-256-GCM + service-role-only table required in build.
* **Deep link fragility:** use Graph `webLink` / best-effort Gmail URLs + UX fallbacks.
* **Mailopoly competitive overlap:** same JTBD; hold stay-native / intent / classify-only wedge (DEC-010).
* **Local-dev Microsoft client secret exposure:** the Azure App Registration's client secret was typed into chat during Phase 11 setup (2026-09-12); treat it as logged and rotate it before any shared or non-local use.

## Deferred / Later

* Gmail Pub/Sub push sync, LLM narrative recaps, payments, push digests, native apps
* EasyMail-as-MCP server (optional H1 from `MCP_EVALUATION.md`)
* Incremental Cron-driven sync for both providers; full Settings reconnect/disconnect UI
* Rich email-body rendering beyond link cleanup (e.g. structured layout, image handling) — explicitly deferred past Phase 11 per product-owner instruction

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
* Merged `feature/phase-11-outlook` to `main` via fast-forward and pushed to `origin/main` on 2026-09-13 after final product-owner approval.
* Performed and got approval for a Phase 12 reliability audit of the existing Gmail/Outlook integrations (8 findings, G1–G8, no P0s), then implemented all 8 fixes on `feature/phase-12-reliability` in 7 logical checkpoints, adding 40 new unit tests for the extracted decision logic. Full suite (108 unit tests, 10 RLS tests, build) passes. Not live-verified.
* Product owner approved Phase 12 on 2026-09-13 based on the existing unit-test-level evidence (no scoped live-verification pass requested). Reverified the full suite immediately before merge: format, lint, typecheck, 108 unit tests, 10 forced local RLS tests, production build, and `git diff --check` all pass. Confirmed the branch diff is limited to the documented Phase 12 files (integration/sync/classification logic, their new unit tests, and `PROJECT_STATE.md`) — no schema, UI, or unrelated scope. `feature/phase-12-reliability` merged to `main` via fast-forward and pushed to `origin/main`.

## Phase 12 Reliability Checkpoint (branch: `feature/phase-12-reliability`, merged to `main`)

* **Audit:** An 8-item reliability audit of the existing Phase 11 integrations (Gmail/Outlook OAuth, sync, classification, correction, retention) was performed against `BUILD_FROM_ZERO.md`'s Phase 12 definition and approved by the product owner before any code changed. No P0 issues were found. Full findings are in this session's transcript; summarized fixes below.
* **G5 — Stale sync-run recovery (P1, must-fix).** A `sync_runs` row stuck `queued`/`running` because its process was killed/timed out (rather than throwing a caught exception) previously blocked all future syncs for that account forever, via the DB's one-active-run-per-account unique index. `startSyncRun` now reaps any run stuck past a conservative 10-minute threshold (2x Vercel's 300s function ceiling) before inserting, marking it `failed` with an accurate `error_summary`. The staleness decision (`isSyncRunStale`, `src/lib/integrations/sync-staleness.ts`) is pure and unit-tested; the reap itself is best-effort and never weakens the unique index.
* **G4 — Revoked/invalid OAuth grant detection (P1, must-fix).** `refreshGoogleAccessToken`/`refreshMicrosoftAccessToken` previously threw the same generic error for any refresh failure. Both now detect the RFC 6749 `error: "invalid_grant"` response both providers use for an expired/revoked refresh token (`src/lib/integrations/oauth-errors.ts`, unit-tested) and the sync layer sets `mail_accounts.status = "needs_reconnect"` with an accurate message only for that specific, permanent case — a transient failure still gets the generic `sync_error` path. No new UI: the existing "Connect Google/Outlook account" button already re-upserts and refreshes tokens on repeat use, so it doubles as the reconnect action.
* **G1 — Empty inbox is a successful sync (P1, must-fix).** Both `syncGmailAccount` and `syncMicrosoftAccount` previously decided success from `stored > 0 || classified > 0 || alreadyStored.size > 0`, which is false for a legitimately empty result (a quiet inbox), mislabeling a working sync as `sync_error`. Replaced with `decideSyncOutcome` (`src/lib/integrations/sync-outcome.ts`, unit-tested, shared by both providers), which decides status purely from actual fetch/classify failure counts. Also removed the "It will retry automatically" claim from all sync failure messages — no automatic retry mechanism exists yet, so that claim was false; the `needs_reconnect` message now names the real recovery action instead.
* **G3 — Bounded transient AI classification retry (P1, must-fix).** `classifyOne` now retries a genuinely transient failure (AI SDK `APICallError.isRetryable` — rate limiting, 5xx — or a network-level `TypeError`) up to 3 attempts with small bounded backoff, via a new generic `retryTransient` utility (`src/lib/retry.ts`, unit-tested). A malformed/invalid structured-output response (`NoObjectGeneratedError`) is never blindly retried — the existing truncate-and-re-validate repair path is preserved exactly (`src/lib/integrations/classify-errors.ts`, unit-tested).
* **G2 — Failed classifications excluded from pendingCount (P1, must-fix).** Per product-owner decision, no new "couldn't classify" UI this phase. `pendingCount` now counts only `classification_status = "pending"` (`countPendingMessages`, `src/lib/recap.ts`, unit-tested) instead of also counting any message with no classification row — which previously included permanently `failed` messages that will never be reclassified, silently and permanently inflating the "pending" badge.
* **G6 — Duplicate OAuth completion no longer reports false failure (P2, should-fix).** `startSyncRun` now throws a distinct `SyncAlreadyInProgressError` (`src/lib/integrations/sync-errors.ts`, unit-tested) instead of a generic error for the DB's concurrency conflict. Both OAuth callback routes catch this specifically: if the account was already connected/upserted and the only issue is that a different sync for it is legitimately already running (e.g. a near-simultaneous double-connect), the callback still reports success. Any other sync failure still propagates unchanged.
* **G7 — Restrained AI classification pacing (P2, should-fix).** `classifyPendingMessages` now waits 100ms between messages that actually call the AI Gateway (skipped for override short-circuits and after the last message), reducing how easily a large batch bursts into rate limiting.
* **G8 — Best-effort sync failure cleanup (P2, should-fix).** Extracted `recordSyncFailure` (`src/lib/integrations/sync-failure-cleanup.ts`), used by both providers' outer catch blocks: a secondary DB failure while recording a sync's failure outcome is now logged rather than an unhandled rejection, and never replaces the original error that's still reported to the caller.
* **Files changed:** 7 new pure/testable modules (`sync-staleness.ts`, `oauth-errors.ts`, `sync-outcome.ts`, `retry.ts`, `classify-errors.ts`, `sync-errors.ts`, `sync-failure-cleanup.ts`); modified `sync-runs.ts`, `classify.ts`, `gmail-sync.ts`, `graph-sync.ts`, `google/oauth.ts`, `microsoft/oauth.ts`, `data/recap.ts`, `lib/recap.ts`, and both OAuth callback routes (only their post-connect sync handling).
* **Testing approach:** this codebase's `server-only` marker genuinely throws when imported outside Next.js's bundler (confirmed empirically), so every fix's decision logic was extracted into a plain, non-server-only module and unit-tested directly — matching the existing `message-parser.ts`/`retention.ts` pattern — rather than attempting to mock the DB/network orchestration in `gmail-sync.ts`/`graph-sync.ts` themselves (which, consistent with existing project practice, have no direct unit tests and are verified live instead).
* **Verification:** format, lint, typecheck, **108 unit tests** (up from 68 — 40 new, covering every G1–G8 decision), **10 forced local RLS tests** (unchanged — no schema/policy changes), production build, and `git diff --check` (working tree and full branch diff) all pass.
* **Not live-verified:** none of G1–G8 has been exercised against its real triggering condition (an actual killed/stale sync process, an actual revoked token, an actual empty real inbox, an actual transient AI Gateway failure, an actual double-connect race, an actual secondary DB failure). Several of these are impractical or unsafe to reproduce live on demand (deliberately killing a serverless function mid-run, revoking a real production token just to test). Unit tests demonstrate the decision logic is correct in isolation; they do not demonstrate the full failure-to-recovery path the way Phase 11's live verification did.
* **Not in scope (explicitly deferred, per product-owner constraints):** Cron/incremental sync, disconnect/revoke UI, any new product feature, the 5-account soft cap and other abuse controls (Phase 14), and any new observability/metrics (Phase 15).
* **Status:** Implemented, unit-tested, and self-verified. Approved by the product owner on 2026-09-13 on unit-test-level evidence (no scoped live-verification pass was requested). Merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13.

## Phase 11 Google Checkpoint

* **Google OAuth — Complete.** PKCE-protected `/api/oauth/google/start` + `/api/oauth/google/callback`, single-use `oauth_states` CSRF row, `gmail.readonly` scope only. Verified with a real Google Cloud OAuth client and a real Google account, including the Testing-mode unverified-app consent screen and a full reconnect (re-authorization).
* **Token storage — Complete.** AES-256-GCM encryption (`src/lib/crypto/token-cipher.ts`), stored in `mail_account_secrets` as a Postgres bytea hex literal. RLS-verified deny-all for `authenticated`/`anon`; an RLS test round-trips a real encrypted token through a live Postgres row.
* **Gmail sync — Complete.** Real inline sync via the Gmail REST API (14-day/300-message window). Verified against a real inbox: 300 real messages fetched and stored correctly (subjects, senders, bodies, retention deadlines). Two real bugs found via real data volume and fixed: Gmail's 403-coded rate-limit response wasn't recognized as retryable, and a sync retry re-fetched (re-burning quota on) messages already stored — both fixed and re-verified.
* **Production AI classification — Complete.** Real Vercel AI Gateway calls (`generateObject`, model `anthropic/claude-haiku-4.5`) against the product owner's own paid-credit Gateway account. Verified against all 300 real synced messages: 300/300 classified, 0 failures, sensible real-world intent distribution. A schema near-miss (model's `reason` field occasionally exceeding 160 chars — a known structured-output limitation, not a schema/architecture issue) is repaired via truncation + re-validation against the unchanged schema rather than discarding the classification.
* **Real end-to-end verification — Complete.** Full loop verified with real data: OAuth → encrypted token storage → Gmail sync → AI classification → stored classifications → Recap/Triage rendering → user correction. A manual correction was confirmed to survive a live reclassification pass (`is_user_override`/`effective_intent` untouched, `model_intent` unchanged) — the override-protection constraint holds against a real model, not just in tests.
* **Boundary check:** No compose/draft/send/archive/delete/unsubscribe, no Microsoft/Graph code, no destructive automation. Read-only `gmail.readonly` scope only.
* **Microsoft — Not started.**
* **Status:** Approved by the product owner. Retention purge (7-day body scrub, 14-day message delete, oauth_state expiry) is implemented and manually verified but not yet wired to a schedule — Cron wiring is planned alongside Microsoft's incremental sync. Disconnect UI and full reconnect/disconnect UX are not yet implemented.

## Phase 11 Microsoft/Outlook Checkpoint (branch: `feature/phase-11-outlook`, not yet merged)

* **Authorization:** Product owner explicitly authorized starting Microsoft Graph work in-session on 2026-09-12, superseding the prior "Blocking Decisions" gate for this branch only. `main` is untouched.
* **Microsoft OAuth — Complete, live-verified.** PKCE-protected `/api/oauth/microsoft/start` + `/api/oauth/microsoft/callback`, reusing the same single-use `oauth_states` CSRF row (already provider-generic). Scopes: `offline_access User.Read Mail.Read` only — no `Mail.ReadWrite`, no `Mail.Send`, no application (app-only) permissions. `src/lib/integrations/microsoft/oauth.ts`. Verified 2026-09-13 with a real Azure App Registration and the product owner's real personal Microsoft account (`meronmatti123@outlook.com`), including the real Microsoft consent screen.
* **Token storage — Complete, live-verified.** Same AES-256-GCM cipher (`src/lib/crypto/token-cipher.ts`), same `mail_account_secrets` table and RLS deny-all policy as Google (`mail_accounts.provider` already allowed `'microsoft'` in the Phase 7 schema — no migration needed). Confirmed a real encrypted refresh token was stored (presence/format/length checked only — never decrypted or displayed).
* **Outlook sync — Complete, live-verified.** `src/lib/integrations/microsoft/graph-sync.ts` mirrors `gmail-sync.ts`: same 14-day/300-message bounded window, same idempotent `(mail_account_id, provider_message_id)` upsert, same already-stored skip-before-fetch guard, same `sync_runs` overlap protection. Uses Graph's `Prefer: outlook.body-content-type="text"` header so message bodies arrive as plain text server-side (no HTML-stripping code needed, unlike Gmail's MIME parsing). Verified against the real account: 1 `sync_runs` row (`succeeded`), 3 real messages fetched/stored/classified, 0 failures, `received_at` range entirely inside the 14-day window.
* **Classification — Reused unchanged, live-verified.** `classifyPendingMessages` is keyed by `mail_account_id`/`user_id`, not provider — no Microsoft-specific classification code was needed or written. All 3 real Outlook messages classified successfully via the real AI Gateway path.
* **User correction override — Verified against a real Outlook message.** Corrected "Welcome to your Azure free account" from the model's `matters` to `needs_action` through the real UI. Confirmed: a `classification_corrections` audit row was written (`from_intent: matters`, `to_intent: needs_action`); `message_classifications.is_user_override = true`; `model_intent` unchanged at `matters`; `effective_intent = needs_action`; Recap/Triage/message-detail all read `effective_intent`, so the corrected value is what renders everywhere (confirmed in `src/lib/data/recap.ts`).
* **Gmail regression check — Passed.** Both real Google accounts unaffected: `meronmatti123@gmail.com` still 300/300 messages classified; `matti2@oakland.edu` still 119/119 stored messages classified (its one earlier partial-sync/1-fetch-failure predates any Microsoft code running live, and is unrelated). Confirmed via `git show` that `src/lib/integrations/google/**` and `oauth-state.ts` were not touched by the Microsoft commit; the only shared-file change affecting Google's own copy was a cosmetic shared-error-string edit.
* **Message-detail overflow fix — Committed** (`29c64c6 fix: constrain long message content in detail view`). Long unbroken SafeLink-style URLs no longer bleed the message body into the fixed-width correction sidebar at any width; root cause was a missing `min-w-0` on the grid content column plus `overflow-wrap: anywhere` needed for unbroken tokens. Visually confirmed by the product owner at 1440/1280/768/375.
* **Email link-rendering fix — Committed** (`1ec5cae fix: render email links cleanly in message detail`). Message bodies now render long tracking/SafeLink URLs as short, clickable, hostname-labeled links (`src/lib/message-body.ts`) instead of raw wall-of-text URLs — real href preserved, no `dangerouslySetInnerHTML`, stored `messages.body_text` confirmed byte-for-byte unchanged (SHA-256 + `updated_at` check). Visually confirmed by the product owner. Further rich email-rendering work is explicitly deferred past Phase 11.
* **Boundary check:** No compose/draft/send/move/delete/unsubscribe, no mailbox-mutation Graph calls, no destructive automation. Read-only `Mail.Read` scope only.
* **Settings UI:** Added a second "Connect Outlook account" button and a `connected=microsoft` status banner beside the existing Google ones. No layout/design change beyond that.
* **Full verification suite (final, post message-rendering fix):** format, lint, typecheck, **68 unit tests** (up from 43 before this branch), **10 forced local RLS tests** (unchanged — no policy changes were needed for Microsoft or either fix), and a production build all pass; `git diff --check` clean.
* **Not yet done:** Disconnect UI, incremental Cron sync, and `revokeMicrosoftToken` (implemented as a documented no-op — Microsoft has no public per-refresh-token revoke endpoint) remain unused pending later reconnect/disconnect UX work, matching Google's current state. Further rich email-body rendering (beyond link cleanup) is deferred as a separate future UX enhancement, not Phase 11 scope.
* **Status:** Live-verified against a real Microsoft/Outlook account and approved by the product owner on 2026-09-13. Merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13 (final commit `ff3eccc`, which also includes the Phase 11 closeout doc commit).

## Phase 12 Exit Review

* **Expected failures recover cleanly — Pass.** Empty inboxes no longer misreport as `sync_error` (G1); transient AI Gateway failures now retry with bounded backoff instead of failing the message outright (G3); a killed/timed-out sync process's stuck `sync_runs` row is reaped instead of blocking all future syncs forever (G5); a secondary DB failure while recording a sync failure is now logged rather than an unhandled rejection, and never masks the original error (G8).
* **Users are not permanently locked by normal errors — Pass.** The stale-run reap (G5) removes the only mechanism that could permanently block an account's syncs. A revoked/invalid OAuth grant is now distinguished from a transient failure and surfaces `needs_reconnect` with an accurate message and a working recovery path — the existing connect button (G4).
* **Duplicate operations do not corrupt data — Pass.** Existing idempotent per-account sync (unique `(mail_account_id, provider_message_id)`, already-stored skip-before-fetch, `sync_runs` overlap protection) is unchanged and still holds. A duplicate/near-simultaneous OAuth completion now reports the correct outcome instead of a false failure (G6) without weakening that protection.
* **Verification — Pass, with a stated limit.** Format, lint, typecheck, 108 unit tests, 10 forced local RLS tests, production build, and `git diff --check` all pass (reverified 2026-09-13 immediately before merge). Exit criteria are demonstrated via unit tests of the extracted decision logic only — none of G1–G8 has been exercised against its real triggering condition (an actual killed sync process, an actual revoked token, an actual empty real inbox, an actual transient AI Gateway failure, an actual double-connect race, an actual secondary DB failure). This gap was disclosed to the product owner, who approved on the unit-test-level evidence rather than requesting a scoped live-verification pass first.
* **Not in scope, explicitly deferred (unchanged by this phase):** full disconnect/revoke UI, incremental/Cron sync, the 5-account soft cap and other abuse controls, any new observability/metrics, and a new "couldn't classify" UI state for permanently-failed messages.
* **Overall — Complete.** All Phase 12 exit criteria (`BUILD_FROM_ZERO.md`) are satisfied on the stated evidence. The product owner gave final Phase 12 approval on 2026-09-13. Merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13.

## Phase 11 Exit Review

* **Integration works — Pass.** Both Google and Microsoft slices verified end-to-end against real accounts: OAuth consent → encrypted token storage → sync → AI classification → Recap/Triage rendering → user correction, including override-protection holding against a live reclassification pass for both providers.
* **Failure/reconnect behavior is known — Pass.** Both providers retry/backoff on their real throttling signals (Gmail's 403 `rateLimitExceeded`; Graph's 429/`Retry-After` and 5xx); `sync_runs` records `succeeded`/`partial`/`failed` outcomes; a full Google reconnect was exercised. Disconnect UI is explicitly deferred for both providers (documented, not a Phase 11 blocker per DEC-009/SECURITY.md scope).
* **Credentials are handled securely — Pass.** AES-256-GCM at rest for both providers, service-role-only access path, PKCE + single-use CSRF `oauth_states` row, least-privilege scopes only (`gmail.readonly`; `Mail.Read`/`offline_access`/`User.Read` — no ReadWrite/Send/app-only), no raw token or message-body logging in application code.
* **Duplicate actions are controlled — Pass.** Idempotent per-account sync via the `(mail_account_id, provider_message_id)` unique constraint plus an already-stored skip-before-fetch guard; `sync_runs`' partial unique index prevents overlapping syncs for the same account.
* **Overall — Complete.** All Phase 11 exit criteria are satisfied for both providers. The product owner gave final Phase 11 approval on 2026-09-13, including the message-detail layout and link-rendering fixes surfaced during live verification. Merged to `main` via fast-forward and pushed to `origin/main` on 2026-09-13.

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

1. Rotate the local-dev Microsoft OAuth client secret that was transcribed into chat during Phase 11 setup — treat it as logged and not safe to reuse beyond this local verification.
2. Incremental Cron sync and full Settings reconnect/disconnect UI for both providers (deferred out of both Phase 11 and Phase 12, unchanged from the prior plan).
3. Begin Phase 13 — Testing only after explicit authorization, re-reading that phase's section in `BUILD_FROM_ZERO.md` first.

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
