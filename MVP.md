# MVP Scope

> Phase 4 — smallest version worth shipping. Builds on Phases 1–3 (`PROJECT.md`, `MARKET.md`, DEC-001–005).

## MVP One-Liner

Connect school Gmail, personal Gmail, and work Outlook → get a cross-inbox **intent triage** and **concise recap** → handle only what needs you (usually in native mail) → correct mistakes so trust can improve.

## MVP Boundary Principle

If a feature does not directly support **activation**, **core value (attention clarity)**, **essential trust/safety**, or **essential operations**, it is out of MVP.

---

## MUST HAVE

| Feature | Why it exists | Supports |
| --- | --- | --- |
| Sign up / sign in (single personal user) | Need an owned session to attach accounts and preferences | Activation, ops |
| Connect **multiple Gmail** accounts via OAuth | School + personal are core to the target user’s life | Activation, core value |
| Connect **Outlook** via OAuth | Work mail is required for the cross-inbox promise and aha moment | Activation, core value |
| Ingest recent mail (rolling window, not full archive) | Classification/recap need current messages without boiling the ocean | Core value, ops |
| **Intent classification** into at least: *needs reply*, *needs action* (deadline/event/task signal), *matters*, *can ignore*, *cleanup candidate* | Differentiator vs Important/Other; matches Phase 1 desired outcomes | Core value |
| **Cross-inbox recap** (on-demand for a clear time window, e.g. today / since last visit) | Primary product surface; delivers “feel caught up” | Core value, activation (aha) |
| Cross-inbox **triage list** with account source visible | Lets user act on “needs me” items without scanning raw inboxes | Core value |
| Enough message context to decide (sender, subject, account, short snippet / reason) | Trust requires understanding *why* something was surfaced | Core value, trust |
| **Open in native Gmail/Outlook** (deep link / open message) | Product is not a mail client; reply/read happens in place | Core value, ops |
| **Correct classification** (user overrides intent) | Mislabeling is the #1 market failure mode; corrections are essential trust | Trust |
| Account disconnect + logout | User control over access; essential safety/ops | Trust/safety, ops |
| Auth/sync error visibility (reconnect, failed sync, empty states) | Broken silent sync destroys trust | Trust/safety, ops |
| Non-destructive defaults (no auto-send; no auto-archive/unsubscribe execution) | Safety: EasyMail advises; it does not silently change mailboxes in MVP | Trust/safety |

### Intent labels (MVP meanings)

- **Needs reply** — expects a response from the user
- **Needs action** — contains a deadline, event, meeting, assignment, or concrete task for the user (surface the signal; do not require calendar writeback in MVP)
- **Matters** — important awareness / FYI that should not be buried, but may not need reply
- **Can ignore** — low-value noise safe to skip for now
- **Cleanup candidate** — subscription/promo/unwanted sender worth unsubscribing or deleting later (flag only)

A message may primarily sit in one bucket for MVP simplicity (single primary intent), even if richer multi-label comes later.

---

## SHOULD HAVE (include if low cost; not required to call MVP “done”)

| Feature | Why |
| --- | --- |
| Short per-item “why” explanation from the classifier | Speeds trust; helps corrections |
| Mark handled / dismissed in EasyMail (local only; does not alter provider mailbox) | Supports repeat loop without forcing archive in Gmail/Outlook |
| Manual “sync now” / refresh | User control when mail feels stale |
| Simple account nicknames (School / Personal / Work) | Clarity in recap/triage |
| Basic correction history or count (for personal quality learning) | Supports trust iteration for founder validation |

---

## LATER (V2+ backlog)

- AI reply drafting in user’s voice
- Follow-up / “waiting on reply” tracker
- Scheduled push or emailed daily digest
- Mobile-native app / smart notification replacement
- Execute unsubscribe or bulk delete (with confirmations)
- Auto-archive of ignore-class mail (only after trust proven)
- Calendar or task-app writeback for deadlines/events
- Full historical inbox cleanup
- Multi-label intents, VIP rules, custom categories
- Team/shared inbox features
- Billing/subscriptions packaging UI (after value proven)

---

## DO NOT BUILD YET

- Full email client (compose, rich thread UI, keyboard-speed inbox)
- Gmail-only product that ships as “done”
- Superhuman-style speed client craft as the MVP bet
- Full executive assistant (calendar OS, meeting notes, SMS)
- Auto-send of any email
- Silent destructive mailbox changes
- Enterprise shared inbox / helpdesk
- CRM integrations
- Meeting notetaker bundle

---

## Non-Goals (MVP)

- Replacing Gmail or Outlook as the place you read/send mail
- Achieving perfect classification on day one (must be correctable and visibly imperfect-safe)
- Solving all historical clutter in one pass
- Monetization, teams, or public launch polish beyond founder validation needs
- Matching alfred_’s full EA scope or SaneBox’s full filter suite

---

## Provider Sequencing Decision

**MVP is not complete until both multiple Gmail accounts and Outlook work for the primary user.**

Rationale: Phase 3 aha moment and differentiation require school + personal + work. A Gmail-only “MVP” would fail the product’s own promise (DEC-003/004).

Engineering may implement one provider path first during build phases, but **exit from Core Product Build / Integrations for MVP value** requires both providers connected and included in the same recap/triage.

---

## Automation Aggressiveness Decision

**MVP classifies and recommends only.**

- Cleanup candidates are **flags**, not executed unsubscribes/deletes
- No auto-archive of “can ignore”
- No AI auto-replies or drafts in MVP

Rationale: trust is the product; market complaints center on mislabeling and surprise actions. Earn trust before automation.

---

## MVP Success Criteria

MVP succeeds for the initial user when all of the following are true:

1. **Activation:** Connects ≥2 Gmail accounts and 1 Outlook account successfully.
2. **Aha:** Can open EasyMail and, from recap + triage alone, identify real “needs reply” and “needs action” items across accounts without first scanning all three native inboxes.
3. **Core value:** Subjectively spends less time/attention manually scanning inboxes for at least several days (self-reported), while still catching important school/work items.
4. **Trust:** Can correct a wrong classification in-product; feels safe that EasyMail will not send mail or silently destroy mail.
5. **Operations:** Can disconnect an account and recover from a reconnect/sync failure without being stuck.
6. **Boundary held:** No full client, drafting, or destructive automation shipped as required MVP work.

---

## Out of Scope Metrics (track later, not MVP gates)

- Paid conversion
- Team retention
- Classification precision/recall at scale (start a lightweight personal eval habit; formal eval corpus is Phase 13+)
