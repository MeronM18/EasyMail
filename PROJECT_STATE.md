# Project State

> This file is the progress source of truth. Agents must update it after meaningful work and before declaring a phase complete.

## Build Status

* **Project initialized:** No
* **Current phase:** Phase 1 — Problem
* **Current objective:** Initialize the project and define the target user, core problem, current alternatives, and desired outcome.
* **Next milestone:** Initialize `PROJECT.md` and satisfy the Phase 1 exit criteria in `BUILD_FROM_ZERO.md`.
* **Last updated:** YYYY-MM-DD

## Phase Progress

* [ ] Phase 1 — Problem
* [ ] Phase 2 — Market
* [ ] Phase 3 — Product Definition
* [ ] Phase 4 — MVP Scope
* [ ] Phase 5 — User Experience
* [ ] Phase 6 — Technical Architecture
* [ ] Phase 7 — Data & Security Design
* [ ] Phase 8 — Project Setup
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

* Initialize the project.
* Establish the Phase 1 problem definition.

## Completed Decisions

None yet.

## Open Questions

* Who is the primary target user?
* What painful problem are we solving?
* How frequently does this problem occur?
* How severe is the problem?
* What does the user currently do instead?
* Why are current alternatives insufficient?
* What outcome should the product create?

## Blocking Decisions

None yet.

## Major Risks

None identified yet.

## Deferred / Later

None yet.

## Recent Progress

* BUILD_FROM_ZERO lifecycle installed.
* Agent instructions installed.
* Project has not yet been initialized.

## Next Actions

1. Read `AGENTS.md`.
2. Read `BUILD_FROM_ZERO.md`.
3. Begin Phase 1 — Problem.
4. Ask only the questions necessary to establish the Phase 1 requirements.
5. Populate `PROJECT.md` with established product information.
6. Change **Project initialized** to **Yes** once the project has been meaningfully defined.
7. Verify all Phase 1 exit criteria against `BUILD_FROM_ZERO.md`.
8. Record important decisions in `DECISIONS.md`.
9. Update this file.
10. Advance to Phase 2 only when Phase 1 exit criteria are satisfied.

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
