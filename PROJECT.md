# Project

> This document defines what we are building and why. It should evolve as the product becomes clearer.

## Product Name

EasyMail (working name; not finalized)

## One-Sentence Description

EasyMail is a cross-inbox attention layer that classifies school, work, and personal email by what needs you — and delivers a concise recap — so you stay on top of multiple Gmail and Outlook accounts without scanning every inbox.

## Target User

**Initial user:** the product owner (personal-use first).

A college student, mortgage loan officer, and everyday email user who manages:

- multiple Gmail accounts (school and personal)
- Outlook for work

**Broader archetype (same job):** mixed-life individuals who live across school/work/personal inboxes and want clarity more than a faster email client.

## Problem

Inboxes mix important school, work, financial, personal, Marketplace, promotional, subscription, and junk email. The user must manually scan senders and messages to decide what is important, needs a reply, requires attention, contains a deadline/event/meeting/task, can be ignored, should be deleted, or comes from unwanted senders/subscriptions. Important email gets buried among low-value messages. Unwanted mail and subscriptions accumulate because cleanup is deferred. Dates, tasks, and events in email still require manual recognition and transfer elsewhere.

### Problem statement

A busy user managing multiple school, work, and personal inboxes struggles to quickly identify important emails, required responses, actionable information, and unwanted messages because everything arrives in fragmented inboxes mixed with low-value email. The product should help them spend less time managing email while staying organized, informed, and on top of their responsibilities.

## Desired Outcome

Spend almost no time managing the inbox while still quickly knowing:

- what matters
- what needs a response
- what needs action
- what can be ignored
- what unwanted email can be cleaned up

Also receive a concise email recap/debrief across inboxes without manually scanning everything.

## Current Behavior

- Checks email whenever a notification arrives (multiple times per day).
- **School Gmail:** looks for professor emails, assignments, exam dates, school updates, activities, and events.
- **Personal Gmail:** looks for credit-related email, Facebook/Marketplace activity, and other personal messages.
- **Outlook (work):** looks for active loan updates, daily work updates, client messages, and emails that often need responses.
- Frequently scrolls past junk and old subscriptions instead of permanently cleaning them up, so clutter accumulates.

## Current Alternatives / Workarounds

**Personal workarounds (Phase 1):**

- Manual sender-by-sender and message-by-message scanning across accounts
- Notification-driven checking rather than scheduled triage
- Ignoring or scrolling past low-value mail instead of unsubscribing/deleting
- Manually noticing and transferring deadlines, tasks, and events out of email

**Product landscape (Phase 2):** See `MARKET.md`. Gap we target: trustworthy cross-inbox triage + recap across multiple Gmail accounts and Outlook, without executive-tool pricing or a Gmail-only / full-client switch.

## Frequency

Multiple times throughout the day — essentially whenever an email notification arrives.

## Severity

Low to mild. Primarily an organization, efficiency, attention, and productivity problem — not a severe or crisis-level problem.

## Why This Product Should Exist

The user wants to be more organized, efficient, and on top of school, work, and personal responsibilities, while reducing time and attention spent manually managing email. Native tools stop at blunt importance splits; most AI tools are Gmail-only, full clients, or expensive executive assistants. EasyMail exists to make *knowing what needs you across inboxes* the product — not rewriting how you send mail.

---

## What the Product Is

EasyMail is an **email attention / intelligence layer**:

1. Connects multiple Gmail accounts and Outlook.
2. Classifies incoming mail by **intent** (not just important vs other): matters, needs reply, needs action (deadline/event/task), can ignore, cleanup/unsubscribe candidate.
3. Surfaces a **concise cross-inbox recap/debrief** so the user can feel caught up without opening every inbox.
4. Lets the user drill into the few items that need them, then return to native Gmail/Outlook to read or reply when needed.
5. Learns from corrections so trust can improve over time.

Primary product surface: **recap + triage**, not a full mail composer/client.

## What the Product Is NOT

- Not a full email client replacement (no Superhuman/Shortwave/Spark clone)
- Not Gmail-only
- Not a keyboard-speed power-user mail UI
- Not a full executive assistant (calendar OS, meeting notetaker, SMS butler)
- Not primarily an AI reply-writing product (drafting may come later; it is not the core promise)
- Not primarily a bulk unsubscribe/cleaner (cleanup signals are part of triage, not the whole product)
- Not a shared team inbox / helpdesk tool

## Core Value Proposition

**Know what needs you across all your inboxes in one short recap — then ignore the rest with confidence.**

Core value is **attention clarity and trust**, not “more email features.” Features (labels, summaries, cleanup hints) only matter insofar as they deliver that clarity.

## Core Promise

Open EasyMail and quickly understand what matters, what needs a response or action, and what can wait or be cleaned up — across school, personal, and work email — without manually scanning each inbox.

## Primary Use Case

After notifications pile up (or at the start of a day/block), the user opens EasyMail, reads a cross-inbox recap and prioritized “needs me” list spanning school Gmail, personal Gmail, and work Outlook, acts only on the few items that require them (often by jumping to the native client for reply), marks/corrects anything wrong, and returns to life without doom-scrolling three inboxes.

## Why the User Chooses This Product

- Works across **multiple Gmail + Outlook** (mixed-life reality)
- Explains **why** something needs attention (reply, deadline, ignore, cleanup) — beyond Important/Other
- Delivers a **recap** so “feeling caught up” does not require scanning
- Stays beside existing mail apps — **no forced client switch**
- Aimed at personal mixed-life use, not $30–50/mo executive email OS positioning

## Why They Return (retention)

- Habit shift: check EasyMail recap instead of every notification → every raw inbox
- Ongoing arrival of new classified mail and updated briefs
- Corrections improve personalization/trust
- Reduces anxiety of “did I miss something important across accounts?”

## Aha Moment

The first time EasyMail’s recap correctly highlights the few things that actually need the user (e.g. a professor deadline + a client email needing reply), correctly downranks noise, and the user realizes they feel caught up **without** opening and scanning all three inboxes.

## Repeat-Use Loop

1. Accounts stay connected; new mail is classified in the background.
2. User opens EasyMail (or views a scheduled/on-demand recap) when they would otherwise scan inboxes.
3. User reviews: needs reply / needs action / matters / ignore / cleanup.
4. User handles the few real items (often in native Gmail/Outlook).
5. User corrects mistakes → system learns.
6. Trust rises → user opens EasyMail first next time → less raw-inbox scanning.

## Long-Term Vision

Become the trusted **attention layer** for people living across fragmented personal, school, and work email: the default place to learn what needs them, with optional later expansion into safer cleanup workflows, task/deadline handoff, and light assistive drafting — still without becoming a full mail client or enterprise shared-inbox suite.

**Architecture implications (avoid traps):**

- Design for **multi-provider account linking** (Gmail + Outlook) as a core capability, not an afterthought.
- Treat **classification, user corrections, and recap generation** as the system center — not a full IMAP/client UI.
- Prefer **non-destructive, human-in-the-loop** actions (especially anything that archives, unsubscribes, or sends).
- Do not couple the product to a single provider’s client APIs as if we own the inbox UI.
- Expect evaluation/quality measurement for classification (trust is the product).

## Non-Goals

Detailed MVP non-goals → Phase 4. Directionally excluded from the product definition above (full client, EA suite, team inbox, drafting-as-core).

## Business Model Hypothesis

- **Near term:** personal product for the founder; validate that recap + intent triage reduces manual scanning.
- **Later:** consumer / prosumer subscription for mixed-life multi-inbox individuals, positioned **below** executive AI email tools (hypothesis: free tier for limited accounts/recaps; paid roughly mid-teens $/mo or less for full multi-account — exact pricing TBD).
- **Not** targeting enterprise shared inboxes or seat-based team collaboration as the primary model.

## Key Assumption (Phase 1)

If the system can classify and summarize emails accurately enough, the user will trust its prioritization enough to reduce how often they manually inspect their inboxes.

## Facts / Assumptions / Unknowns

### Facts

- Initial product is for the product owner.
- User has multiple Gmail accounts plus Outlook for work.
- Pain is frequent (notification-driven) and low-to-mild in severity.
- Market is crowded; differentiation is cross-inbox intent + recap, not another full client (see `MARKET.md`, DEC-003/004).

### Assumptions

- Accurate classification/summarization earns trust and reduces manual inspection.
- Recap-first surface beats “yet another inbox UI” for this user’s desired outcome.
- Personal willingness to pay exists at below-executive price points once trust is proven (unvalidated).

### Unknowns (defer)

- Exact MVP feature cut and provider sequencing (Phase 4)
- UX flows, empty states, correction UX (Phase 5)
- Tech stack and AI provider choices (Phase 6+)
- Precise pricing and packaging (post-validation)
