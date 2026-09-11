# Project State

> This file is the progress source of truth. Agents must update it after meaningful work and before declaring a phase complete.

## Build Status

* **Project initialized:** Yes
* **Current phase:** Phase 8 — Project Setup (complete; awaiting approval to start Phase 9)
* **Current objective:** Hold for product-owner approval before beginning Phase 9 — Foundation Build.
* **Next milestone:** Phase 9 — Foundation Build (app shell, auth, DB/session patterns). No product features (recap/OAuth/sync/classify) until then.
* **Design gate:** `DESIGN_SYSTEM.md` (DEC-011) **approved** as governing UI constraints. Geist Sans + `#1F5FA9` provisional pending first visual design review; visual review required before finalizing UI identity. No substantial frontend styling before Phase 9. Phase 5 UX flows (`UX.md`) fixed.
* **Last updated:** 2026-09-10

## Phase Progress

* [x] Phase 1 — Problem
* [x] Phase 2 — Market
* [x] Phase 3 — Product Definition
* [x] Phase 4 — MVP Scope
* [x] Phase 5 — User Experience
* [x] Phase 6 — Technical Architecture
* [x] Phase 7 — Data & Security Design
* [x] Phase 8 — Project Setup
* [ ] Phase 9 — Foundation Build
* [ ] Phase 10 — Core Product Build
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

* Phase 8 tooling complete: Next.js App Router + TypeScript, ESLint/Prettier, Vitest, Supabase CLI + initial migration, env schema, CI.
* RLS cross-user isolation tests under `tests/rls/` (require Docker + `supabase start`; skip when env unavailable).
* Waiting for approval to begin Phase 9 — Foundation Build.

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

## Open Questions

* Google OAuth verification/CASA timeline before non-test users
* Whether work Outlook tenant requires admin consent for the founder’s mailbox
* Model pin string for classification (choose at implementation; keep swappable)
* Lightweight personal classification quality tracking during founder use
* Precise pricing/packaging (after validation)
* Personal Mailopoly trial score vs EasyMail MVP success criteria (recommended)
* When to enable CI RLS job (needs Docker-capable runner)

## Blocking Decisions

None for Phase 8. Do not start Phase 9 until the product owner approves.

## Major Risks

* **Google restricted scope (`gmail.readonly`):** blocks broad public use until verification; testing mode OK for founder.
* **Microsoft admin consent:** may block some work mailboxes.
* **Sync durability / API rate limits:** must chunk and backoff.
* **AI misclassification:** still core product risk; corrections + deterministic recap mitigate.
* **Token storage:** high-value secrets — AES-256-GCM + service-role-only table required in build.
* **Deep link fragility:** use Graph `webLink` / best-effort Gmail URLs + UX fallbacks.
* **Mailopoly competitive overlap:** same JTBD; hold stay-native / intent / classify-only wedge (DEC-010).
* **Local Docker:** may be unavailable — RLS live run needs Docker + `supabase start`.

## Deferred / Later

* Gmail Pub/Sub push sync, LLM narrative recaps, payments, push digests, native apps
* EasyMail-as-MCP server (optional H1 from `MCP_EVALUATION.md`)
* Auth UI, OAuth flows, sync, classify, recap → Phase 9+

## Recent Progress

* Phase 8 scaffold: Next.js 16 + TypeScript + Tailwind + ESLint/Prettier; Zod env; Supabase client stubs; `.env.example`; `.gitignore`.
* Initial migration with RLS (`(select auth.uid())`), profile trigger, secrets/oauth revoke, partial unique sync index, classification user-match trigger.
* Unit tests + RLS cross-user isolation suite (`npm run test:rls`); CI workflow; `TESTING.md`.
* Verified: `lint`, `typecheck`, `test`, `build` exit 0. RLS skipped without local Supabase.
* Restored full `SCHEMA.md` / `SECURITY.md` after transient I/O damage during recovery.
* DEC-008 / DEC-009 / DEC-010 unchanged.

## Next Actions

1. Product owner reviews Phase 8 exit-criteria check.
2. On approval only: begin Phase 9 — Foundation Build.
3. On a Docker-capable machine: `npx supabase start && npx supabase db reset && npm run test:rls`.

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
