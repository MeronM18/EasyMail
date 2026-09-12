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

---

### DEC-003 — Do not enter as a Gmail-only AI client or speed-focused mail client

**Date:** 2026-09-10
**Status:** Accepted

### Context

Phase 2 found a crowded market of native provider AI, premium clients, and Gmail-only assistants. The initial user's work spans multiple Gmail accounts and Outlook.

### Decision

Do not position or build EasyMail as another Gmail-only AI client or a Superhuman-style keyboard-speed client.

### Why

Either direction would miss the cross-provider problem and compete on mature client features that do not deliver EasyMail's intended advantage.

### Consequences

- Multi-Gmail plus Outlook remains part of the MVP promise.
- Full-client chrome, compose features, and speed-client workflows stay out of scope.

---

### DEC-004 — EasyMail is a recap-first, cross-inbox attention layer

**Date:** 2026-09-10
**Status:** Accepted

### Context

The product needed a clear surface that solved attention triage without requiring the user to replace Gmail or Outlook.

### Decision

EasyMail's primary surface is a concise cross-inbox recap and intent-based triage. Users return to native Gmail or Outlook to read and reply in depth.

### Why

The product's value is knowing what needs attention, not owning the whole email workflow.

### Consequences

- Home is organized around recap and attention hierarchy.
- Compose, rich thread handling, and mailbox replacement remain non-goals.

---

### DEC-005 — Start as a personal/prosumer product below executive-assistant pricing

**Date:** 2026-09-10
**Status:** Accepted

### Context

The initial user has a real but low-to-mild attention problem, while many market alternatives charge executive-tool prices.

### Decision

Validate EasyMail first as a personal product, with a later consumer/prosumer subscription hypothesis priced below executive AI email tools. Exact packaging remains open.

### Why

Founder use offers fast learning without premature billing infrastructure, and the narrower product should not inherit enterprise-assistant economics by default.

### Consequences

- Payments and pricing UI are outside the MVP build.
- Willingness to pay is measured after the product proves trust and attention savings.

---

### DEC-006 — MVP is multi-provider recap and triage with classify-only behavior

**Date:** 2026-09-10
**Status:** Accepted

### Context

Phase 4 required the smallest product that still delivered the cross-inbox aha moment safely.

### Decision

The MVP connects at least two Gmail accounts and one Outlook account, ingests a recent rolling window, classifies mail into five primary intents, builds a cross-inbox recap and triage view, opens items in native mail, and accepts user corrections. It does not draft, send, archive, delete, or execute unsubscribe actions.

### Why

Classification and recap deliver the core value; non-destructive behavior limits the cost of mistakes while trust is being earned.

### Consequences

- A Gmail-only build cannot be called MVP-complete.
- Drafting and destructive automation stay deferred.
- Corrections and visible failure states are essential, not polish.

---

### DEC-007 — Recap-first home with partial account setup

**Date:** 2026-09-10
**Status:** Accepted

### Context

Phase 5 needed to minimize onboarding friction while preserving the activation target of multiple Gmail accounts plus Outlook.

### Decision

Authenticated users land on a recap-first home. They may continue after connecting one mailbox, while a persistent checklist guides them toward two Gmail accounts and one Outlook account.

### Why

Blocking until every account connects creates a dead end; hiding incomplete setup weakens the cross-inbox promise.

### Consequences

- Partial data must be clearly labeled.
- Connection and reconnect problems must remain visible outside Settings.
- `UX.md` is the fixed flow and information-architecture source.

---

### DEC-008 — Use Next.js, Supabase, direct provider APIs, AI Gateway, and durable Vercel jobs

**Date:** 2026-09-10
**Status:** Accepted

### Context

Phase 6 compared the simplest architecture that supports owned multi-account sessions, durable background sync, structured classification, and a standalone product experience.

### Decision

Use Next.js App Router on Vercel, Supabase Auth and Postgres with RLS, direct read-only Gmail API and Microsoft Graph integrations, Vercel AI Gateway for swappable structured classification, and Vercel Workflows/Cron for durable sync. Build recaps deterministically from stored classifications.

### Why

This stack supports the MVP with one web application and database while retaining control of the product, data model, correction loop, and offline processing.

### Consequences

- Node.js is the default runtime; no microservices, Redis, Kubernetes, or custom IMAP engine.
- MCP may become a post-MVP distribution surface, but does not replace the application backend.
- Provider jobs must be chunked and idempotent when built.

---

### DEC-009 — Enforce user-owned data, isolated encrypted tokens, and short retention

**Date:** 2026-09-10
**Status:** Accepted

### Context

Email content and OAuth credentials are sensitive, and a multi-user system must structurally prevent cross-user access.

### Decision

Every mail-derived row is owned by a Supabase user and protected by RLS plus server-side ownership checks. OAuth tokens live in a client-inaccessible table encrypted with AES-256-GCM. Message bodies are retained for no more than seven days, message metadata for fourteen days, user overrides are never silently clobbered, dependent data cascades on deletion, and sync/classification are rate limited.

### Why

Defense in depth, data minimization, and explicit integrity rules reduce the impact of application mistakes or data exposure.

### Consequences

- Service-role access is server-only and always scoped to an explicit owner/account.
- Attachments, raw provider payloads, and long-lived full bodies are not stored.
- Cross-user isolation and secret-table denial require automated verification.

---

### DEC-010 — Differentiate from Mailopoly through a stay-native, narrow attention layer

**Date:** 2026-09-10
**Status:** Accepted

### Context

The Mailopoly review identified a shipped product with close overlap in multi-provider triage, catch-up, tasks, drafting, cleanup, and assistant features.

### Decision

Keep EasyMail focused on recap-first, stay-native, correctable, classify-only attention management. A Mailopoly-class unified inbox, executive assistant, drafting suite, channel hub, or cleanup executor is an explicit MVP non-goal.

### Why

The narrower wedge is the clearest way to test whether structured attention clarity is valuable without duplicating a broad existing suite.

### Consequences

- Competitive scope pressure must not expand the MVP.
- A personal Mailopoly trial remains useful validation, but does not alter DEC-008 by itself.

---

### DEC-011 — Govern all UI with the EasyMail design system

**Date:** 2026-09-10
**Status:** Accepted

### Context

The product needed a coherent visual system before frontend work began, with explicit protection against generic AI-SaaS styling.

### Decision

`DESIGN_SYSTEM.md` governs typography, color, spacing, layout, radii, borders, shadows, icons, components, motion, and prohibited patterns. The interface is neutral, calm, content-first, and restrained. Geist Sans and primary blue `#1F5FA9` are provisional until the first real-UI visual review.

### Why

Consistent tokens and restrained hierarchy support trust while allowing the product owner to evaluate the identity before it is propagated broadly.

### Consequences

- Shared primitives use shadcn-style patterns and Lucide icons.
- Phase 5 flows remain unchanged by visual styling.
- A visual review is required once representative foundation UI exists.

---

### DEC-012 — Phase 9 visual direction approved; final identity deferred to Recap UI

**Date:** 2026-09-11
**Status:** Accepted

### Context

Phase 9 built representative foundation UI (landing, authentication, signed-in shell). The product owner reviewed the direction after an earlier pass was rejected as too generic.

### Decision

Approve the overall Phase 9 visual language — restrained, content-first, token-driven, expressed through EasyMail's cross-inbox attention/recap concepts rather than generic SaaS treatment. Preserve this direction and the governing `DESIGN_SYSTEM.md` constraints. Geist Sans and primary blue `#1F5FA9` remain **provisional** and are explicitly **not** final brand decisions. Do not spend further Phase 9 time polishing the landing page. The next major visual review occurs when the authenticated product/Recap UI (Phase 10) provides enough context to evaluate final typography, color, density, and component language.

### Why

The foundation now demonstrates the intended restraint and product-specific identity, so the direction can be locked while leaving the concrete brand choices (font, primary color) open until the richer Recap surface exists to judge them.

### Consequences

- Foundation surfaces keep their current tokens; no broad restyle in Phase 9.
- Geist Sans and `#1F5FA9` stay provisional; changing them is a later design-system decision, not a per-component choice.
- The Phase 9 visual-review gate is resolved; the remaining Phase 9 gate is live Supabase auth/session and RLS verification in a capable environment.


---

### DEC-013 — Approve the Phase 10 authenticated product visual direction

**Date:** 2026-09-11
**Status:** Accepted

### Context

Phase 10 introduced representative authenticated Recap, triage, message-detail, and classification-correction surfaces. The product owner reviewed the initial structure and a focused density/hierarchy refinement.

### Decision

Approve the restrained, neutral-first authenticated product direction and its recap-first information hierarchy. Preserve the governing `DESIGN_SYSTEM.md`, the shared neutral intent-label language, and the distinction between intent and inbox filtering. Retain keyboard-visible focus and sufficient control widths. Geist Sans and primary blue `#1F5FA9` remain provisional and are not finalized by this approval.

### Why

The authenticated product now communicates EasyMail's attention-layer value with enough density and clarity while avoiding full-email-client patterns or generic card-heavy dashboard styling.

### Consequences

- Phase 10 needs no further visual redesign before its final approval.
- Future changes preserve the approved information hierarchy unless a new product decision is recorded.
- Typography and primary brand color remain open decisions; individual components must not diverge from the current shared tokens.
- Phase 11 provider integration remains separately gated.

---

### DEC-014 — Adopt EasyMail Design System v1, superseding provisional Phase 9/10 token values

**Date:** 2026-09-12
**Status:** Accepted

### Context

The product owner commissioned a full UI/UX design-system standardization pass (isolated in the `ui/design-system-v1` worktree/branch) covering typography, color tokens, spacing, radius, shadows, icons, component sourcing (shadcn/ui as foundation; Aceternity UI, Magic UI, and 21st.dev as restyled reference/composition only), and a complete landing/auth/onboarding/authenticated-app component inventory. The provisional tokens from DEC-011/012/013 (warm-stone neutral scale, 3-level text hierarchy, specific warning/success hex values) do not match the new specification's neutral palette (cool-zinc scale), 4-level foreground hierarchy, and updated semantic hex values.

### Decision

Adopt the new Design System v1 token set as the single source of truth, superseding the specific hex/naming choices from DEC-011/012/013 (their structural principles — content-first, restraint, neutral-first, border-first separation, no rainbow intent colors — carry forward unchanged). Primary brand color `#1F5FA9` is finalized (no longer provisional). Geist Sans + Geist Mono are finalized as the typographic system (no longer provisional). `DESIGN_SYSTEM.md` is rewritten to document v1 as authoritative. The onboarding, connect-inbox, and sync-state visual content from the new specification are adopted as reference material for the *existing* Settings connect flow and Recap partial-setup panel — not as a new gated onboarding route — preserving DEC-007's recap-first landing and `UX.md`'s "no tour walls" friction rule unchanged.

### Why

A single, explicit token replacement avoids two systems (the codebase's "v0" and the new brief's "v1") both being called authoritative at once. Locking primary color and typography now (rather than leaving them provisional through another phase) gives the design-system pass a stable target. Keeping the onboarding UX flow unchanged avoids an undiscussed product/routing change riding in on what was scoped as a visual pass.

### Consequences

- `globals.css`, `DESIGN_SYSTEM.md`, and every shadcn/custom component must be normalized to the new token values; no component may keep the old hex values.
- Existing UX.md flows and DEC-007's recap-first landing are unchanged; no new onboarding route is introduced by this pass.
- Component sourcing follows the new specification's shadcn-first strategy; Aceternity/Magic UI/21st.dev components are used as restyled reference only unless a specific block is later purchased/licensed and explicitly re-approved.
- This work proceeds in the isolated `ui/design-system-v1` worktree/branch and does not merge until explicitly approved, per the product owner's standing instruction not to overwrite active Phase 11 backend work.
