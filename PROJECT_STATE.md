# Project State

> This file is the progress source of truth. Agents must update it after meaningful work and before declaring a phase complete.

## Build Status

* **Project initialized:** Yes
* **Current phase:** Phase 10 — Core Product Build (complete; checkpoint committed)
* **Current objective:** Begin Phase 11 — Integrations under separate authorization.
* **Next milestone:** Scope and authorize Phase 11 provider OAuth/sync work; do not begin it implicitly.
* **Design gate:** Resolved by DEC-013. The authenticated product visual direction is approved; Geist Sans and `#1F5FA9` remain explicitly provisional.
* **Last updated:** 2026-09-11 (Phase 10 checkpoint commit)

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
* Phase 11 integration functionality remains absent: no provider OAuth routes, Gmail/Graph API wiring, background sync, production classifier, drafting, or mailbox mutation was introduced.

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

None. Phase 10 is complete and committed. Phase 11 requires separate authorization before work begins.

## Major Risks

* **Google restricted scope (`gmail.readonly`):** blocks broad public use until verification; testing mode OK for founder.
* **Microsoft admin consent:** may block some work mailboxes.
* **Sync durability / API rate limits:** must chunk and backoff.
* **AI misclassification:** still core product risk; corrections + deterministic recap mitigate.
* **Token storage:** high-value secrets — AES-256-GCM + service-role-only table required in build.
* **Deep link fragility:** use Graph `webLink` / best-effort Gmail URLs + UX fallbacks.
* **Mailopoly competitive overlap:** same JTBD; hold stay-native / intent / classify-only wedge (DEC-010).

## Deferred / Later

* Gmail Pub/Sub push sync, LLM narrative recaps, payments, push digests, native apps
* EasyMail-as-MCP server (optional H1 from `MCP_EVALUATION.md`)
* Gmail/Outlook OAuth flows, provider sync/API wiring, and production classification → Phase 11

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

1. Scope Phase 11 — Integrations (Gmail/Outlook OAuth, provider sync, production classifier) per `BUILD_FROM_ZERO.md`.
2. Obtain explicit authorization before beginning Phase 11 implementation.
3. Re-read the Phase 11 section of `BUILD_FROM_ZERO.md` before starting that work.

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
