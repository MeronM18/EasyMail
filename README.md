# Software Starter Template

Reusable AI-assisted software development template for starting new software, SaaS, AI, web, mobile, and technology projects.

This repository provides a shared operating system for coding agents such as Claude Code, Cursor, and Codex.

## How It Works

The project follows the lifecycle defined in:

`BUILD_FROM_ZERO.md`

Project progress is tracked in:

`PROJECT_STATE.md`

Important project context is stored in:

- `PROJECT.md` — what we are building and why
- `ROADMAP.md` — project milestones
- `DECISIONS.md` — important decisions and reasoning
- `BACKLOG.md` — deferred ideas and features

Agent-specific instructions:

- `AGENTS.md` — shared agent instructions / Codex
- `CLAUDE.md` — Claude Code instructions
- `.cursor/rules/build-process.mdc` — Cursor project rule

## Starting a New Project

1. Click **Use this template** on GitHub.
2. Create a new repository.
3. Clone the new repository.
4. Open the project in Cursor, Claude Code, Codex, or another coding agent.
5. Tell the agent:

> We are starting this project from scratch. Read all repository instructions and project state files first. Follow BUILD_FROM_ZERO.md, determine the earliest incomplete phase, and begin there. Do not skip prerequisites or start implementation until the required preceding phases and exit criteria are satisfied. Keep PROJECT_STATE.md updated as we progress.

The agent should:

1. Read the repository instructions.
2. Read `BUILD_FROM_ZERO.md`.
3. Read `PROJECT_STATE.md`.
4. Determine the current phase.
5. Work through the lifecycle one phase at a time.
6. Update project state as progress is made.

## Development Lifecycle

1. Problem
2. Market
3. Product Definition
4. MVP Scope
5. User Experience
6. Technical Architecture
7. Data & Security Design
8. Project Setup
9. Foundation Build
10. Core Product Build
11. Integrations
12. Edge Cases & Reliability
13. Testing
14. Security Review
15. Performance & Observability
16. Beta Readiness
17. Beta Feedback
18. Production Readiness
19. Distribution & Launch
20. Measurement
21. Post-Launch Iteration
22. Scale

## Principle

The objective is not to maximize code output.

The objective is to make the next correct product decision, implement it safely, verify it, and continue until the product is ready for real users.
