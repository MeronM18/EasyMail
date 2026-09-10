# Project Agent Instructions

## Mandatory startup sequence

Before doing any substantive work in this repository:

1.  Read `BUILD_FROM_ZERO.md`.
2.  Read `PROJECT_STATE.md`.
3.  Determine the current build phase.
4.  Re-read the section of `BUILD_FROM_ZERO.md` for that phase.
5.  Check whether the requested task is appropriate for the current
    phase.
6.  Review any relevant project documents referenced by the current
    phase.

## During work

-   Follow `BUILD_FROM_ZERO.md` as the process source of truth.
-   Follow `PROJECT_STATE.md` as the progress source of truth.
-   Do not rely on memory of `BUILD_FROM_ZERO.md`; re-read relevant
    sections.
-   Do not skip prerequisite phases without explicitly documenting why.
-   Do not mark a phase complete unless its exit criteria are satisfied.
-   Distinguish facts, assumptions, unknowns, and decisions.
-   Ask the product owner only questions that materially change product
    or architecture decisions.
-   Prefer focused, reviewable changes over unrelated refactors.
-   Verify work with appropriate tests/checks instead of assuming it
    works.

## Before finishing a substantive task

1.  Re-read the relevant section of `BUILD_FROM_ZERO.md`.
2.  Cross-check the work against:
    -   current phase requirements
    -   current phase exit criteria
    -   feature Definition of Done, when applicable
    -   project Definition of Done, when applicable
3.  Update `PROJECT_STATE.md` with meaningful progress, decisions,
    risks, blockers, and next steps.
4.  Do not claim completion if required verification has not been
    performed.

## Sources of truth

-   `BUILD_FROM_ZERO.md` = process source of truth.
-   `PROJECT_STATE.md` = progress source of truth.
-   Project-specific documents such as `PROJECT.md`, `ROADMAP.md`,
    `ARCHITECTURE.md`, `DECISIONS.md`, `SCHEMA.md`, `SECURITY.md`,
    `TESTING.md`, and `LAUNCH.md` = detailed project knowledge.

If instructions conflict, flag the conflict rather than silently
choosing an interpretation.
