# Decision Log

> Record important product, architecture, security, infrastructure, and engineering decisions here.

Do not record trivial implementation choices.

---

### DEC-001 — Initial target user is the product owner

**Date:** 2026-09-10  
**Status:** Accepted

### Context

Phase 1 required a clear target user before market research or product design.

### Decision

Build initially for the product owner: a college student, mortgage loan officer, and everyday email user managing multiple Gmail accounts (school/personal) and Outlook (work). Broader audiences are out of scope until later phases justify expansion.

### Why

The problem was discovered from lived, multi-inbox usage. Starting with one real user keeps Phase 1–4 grounded and avoids designing for a vague persona.

### Alternatives Considered

- Start with a generalized “busy professional” persona without a specific first user
- Target only students or only loan officers first

### Consequences

- Early validation can be personal and fast
- Market sizing and positioning remain open until Phase 2–3
- Features must still be framed so they can generalize later if the product expands

---

### DEC-002 — Problem is triage/attention across fragmented inboxes, not a single feature request

**Date:** 2026-09-10  
**Status:** Accepted

### Context

Phase 1 exit criteria require starting from a problem, not a feature looking for a problem.

### Decision

Frame the core problem as: fragmented school/work/personal inboxes mixed with low-value mail make it hard to quickly identify importance, replies needed, actionable items, and unwanted mail — so the user spends too much attention managing email.

Desired outcome: minimal inbox management time while still knowing what matters, needs response/action, can be ignored, or should be cleaned up, plus a concise cross-inbox recap.

### Why

Discovery described recurring behavior and frustrations (scan, bury, accumulate, manually extract dates/tasks) rather than prescribing a specific product feature set.

### Alternatives Considered

- Frame primarily as an unsubscribe/cleanup tool
- Frame primarily as a calendar/task extraction tool
- Frame primarily as a multi-account unified inbox

### Consequences

- Classification, prioritization, summarization/recap, and cleanup signals are candidate solution areas — not committed features yet
- Solution shape is deferred to Phase 3–4
- Competitive alternatives will be evaluated in Phase 2 against this problem framing
