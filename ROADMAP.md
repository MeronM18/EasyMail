# Roadmap

> High-level milestones for the product. BUILD_FROM_ZERO.md defines the lifecycle; this file tracks project-specific milestones.

## Current Milestone

Phase 8 — Project Setup (complete; awaiting approval to start Phase 9)

## Now

- Hold for product-owner approval
- On approval: Phase 9 — Foundation Build

## Next

- Foundation build (app shell, auth, DB/session patterns)
- Core product + integrations per `MVP.md`

## Later

Testing, security review, beta, launch — after build phases.

## Completed

- Phase 1 — Problem
- Phase 2 — Market (`MARKET.md`; Mailopoly primary competitor update 2026-09-10)
- Phase 3 — Product Definition (`PROJECT.md`; stay-native attention-layer wedge vs Mailopoly)
- Phase 4 — MVP Scope (`MVP.md`; Mailopoly-class unified inbox/EA explicit non-goal)
- Phase 5 — User Experience (`UX.md`)
- Phase 6 — Technical Architecture (`ARCHITECTURE.md`, DEC-008): Next.js/Vercel, Supabase, Gmail+Graph read-only, AI Gateway classify, deterministic recap, Workflows/Cron — **unchanged after Mailopoly/MCP reviews**
- Phase 7 — Data & Security Design (`SCHEMA.md`, `SECURITY.md`, DEC-009): user-owned RLS model, isolated encrypted tokens, retention, rate limits; DEC-010 competitive differentiation recorded
- Phase 8 — Project Setup: Next.js/TS tooling, env schema, Vitest, Supabase migration + RLS test harness (`npm run test:rls`), CI, secrets hygiene; lint/typecheck/unit/build verified
