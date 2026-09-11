# MCP / Connector Evaluation

> Pause document for Phase 7.  
> Source directory: [rdmgator12/awesome-claude-connectors](https://github.com/rdmgator12/awesome-claude-connectors) (catalog capture **2026-08-10**, ~1,627 connectors).  
> Compared against approved Phase 6 architecture (`ARCHITECTURE.md`, DEC-008).  
> **This file does not change** `ARCHITECTURE.md`, `DECISIONS.md`, or `PROJECT_STATE.md`.

## Purpose

Evaluate whether EasyMail should replace or reshape DEC-008’s direct Gmail API + Microsoft Graph integration with Claude Connectors / MCP servers (or a hybrid).

## What Claude Connectors Are

From the awesome list and [Claude Connectors directory docs](https://claude.com/docs/connectors/directory):

- Connectors are **MCP servers** that give **Claude** (claude.ai, Desktop, Mobile, Code, Cowork) tools/data access.
- **Directory** entries are discoverable inside Claude; **Community (`C`)** entries are listed but less deeply vetted than curated ones.
- Auth for remote connectors is typically **OAuth 2.0** (DCR / CIMD / Anthropic-held credentials) per [Claude connector authentication](https://claude.com/docs/connectors/building/authentication).
- They run on **Claude’s connector infrastructure**, not as your own standalone product UI.

That is a different product shape than EasyMail’s approved definition: a **standalone recap-first web app** with its own onboarding, triage, corrections, and sync (Phases 3–6).

---

## Best Relevant Connectors

Filtered to Gmail, Outlook/M365, and email-management entries that could touch EasyMail’s job-to-be-done.

| Connector | Catalog marker | Why relevant | Fit to EasyMail JTBD | Notes |
| --- | --- | --- | --- | --- |
| **[Gmail](https://mail.google.com)** | Curated (no `C`) | Official-style Gmail access in Claude: search, summarize, draft | Partial — triage/summary in **chat**, not cross-inbox EasyMail UX | Provider-specific; Claude-bound |
| **[Microsoft 365](https://www.microsoft.com/microsoft-365)** | Curated | Outlook + SharePoint/OneDrive/Teams | Partial — Outlook access among broader M365 | Enterprise suite connector, not “email attention layer” |
| **[Mailopoly Inbox](https://www.mailopoly.com)** **`C`** | Community | **Closest product overlap**: Gmail + Outlook (+ Apple/Yahoo/IMAP), unified triage, noise filter, **Catch-Up briefings**, tasks | High overlap with recap + multi-provider triage | Competitor-shaped; Claude surface + their product |
| **[Spark](https://sparkmailapp.com)** | Curated | Multi-account Gmail/Outlook client; read/draft/triage via Claude | Medium — client + Claude, not EasyMail brand | Already a Phase 2 alternative |
| **[Superhuman Mail](https://superhuman.com)** | Curated | Drive email/calendar from Claude | Low for EasyMail positioning | Premium client; Phase 2 competitor |
| **[Fyxer](https://fyxer.com)** | Curated | Inbox triage + drafts | Medium problem overlap | Overlay assistant; Phase 2 competitor |
| **[BirdyChat](https://www.birdy.chat)** **`C`** | Community | Read inbox and act (flag reply, draft, archive) | Medium — action-oriented chat | Unclear multi-account; Community |
| **[Mitosis Labs](https://mitosislabs.ai)** **`C`** | Community | Email/calendar/files as searchable **memory** with citations | Adjacent — memory/search, not daily recap product | Different core promise |
| **[Hostinger Mail](https://www.hostinger.com/business-email)** **`C`** | Community | Hostinger-only inbox in Claude | Low | Wrong provider set |
| **[AgentMail](https://agentmail.to)** / **[CarlyEmail](https://carlyemail.com)** **`C`** | Mixed | Agent-owned inboxes (send/receive for agents) | Low | Not the user’s school/work mailboxes |
| **[ExpenseBot](https://www.expensebot.ai)** **`C`** | Community | Gmail receipts → expenses | Low | Narrow vertical |

**Primary takeaways**

1. **Mailopoly** is the strongest MCP-catalog analogue to EasyMail’s Phase 1–3 promise (multi-provider + catch-up briefing).
2. **Gmail + Microsoft 365** together can cover the founder’s providers *inside Claude*, but as two (or more) chat tools—not one EasyMail attention layer with owned UX.
3. **Spark / Superhuman / Fyxer** reinforce Phase 2: market is crowded; MCP mostly **extends existing email products into Claude**, rather than replacing the need for a product backend.

---

## Current Architecture vs MCP Architecture

| Dimension | DEC-008 (current) | MCP-centric alternative |
| --- | --- | --- |
| **Product** | Standalone EasyMail web app | Claude conversation + connector tools |
| **Primary UX** | Recap home + triage + correct + open native (`UX.md`) | Chat prompts / tool calls |
| **Mail access** | App-owned OAuth → Gmail API + Graph | Connector-owned OAuth → vendor or Anthropic-mediated tokens |
| **Data store** | Supabase: messages, intents, corrections, sync cursors | Often live fetch into Claude context; or vendor cloud (unknown per connector) |
| **Classification** | Your AI Gateway + structured intents + corrections | Claude (or vendor AI) ad hoc / vendor triage |
| **Recap** | Deterministic from stored classifications | Prompted summary or vendor “Catch-Up” |
| **Identity** | EasyMail user ≠ mailbox identities | Claude user + per-connector accounts |
| **Jobs** | Workflows + Cron background sync | Generally **on-demand** when Claude runs tools (unless vendor syncs independently) |
| **Distribution** | Your URL / Vercel app | Claude directory / custom connector install |
| **Who owns trust loop** | In-product correct-intent | Chat corrections; weak structured override store unless you build it |

```
DEC-008:
  User → EasyMail → (OAuth) Gmail/Graph → DB → classify → Recap UI

MCP-only:
  User → Claude → Connector MCP → Gmail/Outlook (or vendor unified inbox)
                 ↳ answers live in chat (no EasyMail product)
```

---

## Hybrid Option

Three hybrids are realistic; only one preserves EasyMail’s product definition.

### H1 — Keep DEC-008; add EasyMail MCP later (recommended hybrid shape)

- Build EasyMail as planned (own OAuth, sync, classify, recap UI).
- Later expose an **EasyMail remote MCP server** so Claude can call `get_recap`, `list_needs_reply`, etc. on **already-processed** EasyMail data.
- Claude becomes an optional client; EasyMail remains the system of record.

**Pros:** Matches Phases 3–6; MCP as distribution channel.  
**Cons:** Extra surface after MVP; directory submission needs Team/Enterprise org for remote listing portal.

### H2 — Prototype with Claude + Gmail/M365 (or Mailopoly) before coding sync

- Founder validates “does cross-inbox recap feeling matter?” using existing connectors.
- Does **not** replace DEC-008 for the shipped product.

**Pros:** Cheap learning.  
**Cons:** Validates Claude UX, not EasyMail UX; easy to confuse competitor validation with product build.

### H3 — Replace mail connectors with third-party MCP inside EasyMail backend

- EasyMail server would call external MCP tools instead of Gmail/Graph.
- Generally **poor fit**: MCP is designed for LLM hosts (Claude), not as your production mail SDK; auth, multi-tenant tokens, cron, and RLS get harder; dependency on Claude/vendor uptime and tool schemas.

**Pros:** Possibly less API client code *if* a stable multi-provider MCP existed as a library (it doesn’t, as a first-class EasyMail dependency).  
**Cons:** Wrong abstraction; fragile; weak multi-tenant story.

---

## Security / Privacy

| Topic | DEC-008 | MCP / Claude connectors |
| --- | --- | --- |
| **Data path** | Mail → your servers → classify → UI | Mail → connector vendor and/or Anthropic tool pipeline → Claude context |
| **Google Limited Use / restricted scopes** | You are the app requesting `gmail.readonly`; you own verification/CASA path | Connector vendor (or Anthropic-associated listing) is the OAuth client; policies still apply to whoever stores/transmits Gmail data |
| **Human access to mail** | Your ops policies + Phase 7 controls | Connector vendor staff policies + Anthropic; chat logs may retain sensitive content |
| **Least privilege** | You choose read-only scopes explicitly | Connector may request send/archive/modify (many email connectors advertise draft/send/act) — often **broader** than EasyMail MVP |
| **Corrections & trust** | Structured override in DB | Unstructured chat; hard to audit intent accuracy over time |
| **Community (`C`) risk** | N/A | Less deep Anthropic review; same runtime power once connected ([directory docs](https://claude.com/docs/connectors/directory)) |

**Privacy implication for EasyMail MVP:** shipping “use Claude + Mailopoly/Gmail connector instead of EasyMail” moves sensitive school/work mail into **chat-centric** workflows and **third-party connector** trust boundaries—misaligned with building a dedicated attention layer with explicit non-destructive defaults.

---

## OAuth / Token Handling

| | DEC-008 | MCP connectors |
| --- | --- | --- |
| **Who holds refresh tokens** | EasyMail (encrypted in your DB) | Claude connector auth layer and/or vendor; see Anthropic OAuth modes (DCR/CIMD/Anthropic-held creds) |
| **Multi-mailbox to one app user** | First-class (multiple OAuth links per EasyMail user) | Per Claude user + whatever each connector supports; **not** your onboarding checklist |
| **Background refresh** | Your Cron/Workflows refresh for sync | Claude refreshes for tool calls; not the same as continuous product sync |
| **Revoke / disconnect UX** | Settings in EasyMail (`UX.md`) | Claude Customize → Connectors + vendor account |
| **Admin consent (work Outlook)** | Still possible with Graph | Still possible via M365 connector; plus org **Team connector approval** gates on Claude Team plans |

Building EasyMail **as** a connector still requires your own OAuth to Gmail/Graph (or re-delegating to another vendor)—MCP does not remove restricted-scope obligations if you store Gmail data.

---

## Background Sync

| Need (MVP) | DEC-008 | MCP-only |
| --- | --- | --- |
| Sync while user is offline | Cron + Workflows | **No**, unless the **vendor** runs its own sync (Mailopoly/Spark/Fyxer might; Claude chat does not) |
| First-sync progress UI | Owned | Claude tool latency / vendor UI |
| Idempotent classify queue | Owned | Ad hoc when user asks Claude |
| “Since last visit” recap | Natural with stored data | Requires vendor memory or re-fetch each session |

**Verdict:** MCP-as-Claude-chat cannot replace EasyMail’s background sync model without becoming dependent on a third-party email product’s backend (at which point you are not building EasyMail—you are wrapping them).

---

## Multi-Account Support

EasyMail MVP requires **≥2 Gmail + Outlook** in one recap (DEC-006).

| Approach | Multi-account |
| --- | --- |
| DEC-008 | Designed for it |
| Gmail connector + M365 connector | Two tools; user must mentally merge; no single EasyMail checklist |
| Mailopoly | Catalog claims unified multi-provider — strongest MCP-side multi-account story, but **their** product |
| Spark / Superhuman | Multi-account inside **their** clients |

MCP does not give EasyMail multi-account for free; a competitor connector might.

---

## Standalone EasyMail Compatibility

| Requirement from Phases 3–5 | MCP-only compatible? |
| --- | --- |
| Own brand / recap-first home | No — Claude is the shell |
| Partial setup + persistent connect checklist | No — Claude connector install UX |
| Correct classification in-product | Weak |
| Open in native Gmail/Outlook | Possible via links, but not your flow |
| Non-destructive classify-only MVP | Depends on connector tools (many are write-capable) |
| Personal/prosumer product URL | No — Claude distribution |
| Later expand beyond Claude users | Poor if product *is* a connector only |

**Verdict:** Pure MCP architecture is **not compatible** with the approved product definition without a major Phase 3–5 rewind.

---

## Distribution Limitations

- Primary audience becomes **Claude users** who enable connectors (and, on Team plans, may need **admin approval**).
- Directory listing for *your* remote MCP requires **Team/Enterprise** org + review ([submission docs](https://claude.com/docs/connectors/building/submission)); not a substitute for a public web MVP for the founder.
- Ranking/discoverability is Claude-directory usage-based; you compete with Gmail, M365, Mailopoly, Spark, Superhuman, Fyxer in-catalog.
- Custom connectors work by URL but are not the same as a marketed standalone app.

---

## Development Complexity Saved (Honest)

| Workstream | Saved by going MCP-only? | Reality |
| --- | --- | --- |
| Gmail API client + history sync | Partially | Replaced by depending on Claude/vendor; you lose control |
| Graph client + delta | Partially | Same |
| OAuth token encryption / RLS | Partially | Tokens still exist somewhere; Phase 7 problems move to vendor |
| Recap/triage UI | **Yes** (large) | You also **lose the product** |
| Classification + corrections store | Partially | Quality/trust loop weaker |
| Durable jobs | No (unless vendor) | Background sync still hard or outsourced |
| Google restricted-scope verification | Maybe deferred | Returns if you store Gmail or ship your own connector |
| Competing with Mailopoly/Spark in Claude | New cost | Catalog competition |

**Net:** MCP-only saves **UI + some API glue** by abandoning EasyMail as a product. It does **not** meaningfully save a path to “owned cross-inbox attention layer.” Hybrid H1 adds work later; it does not reduce MVP DEC-008 scope.

---

## Recommendation: Should DEC-008 Remain or Change?

### Recommendation: **DEC-008 should remain** for EasyMail MVP.

**Do not** replace direct Gmail API + Microsoft Graph + Supabase + Workflows/Cron with a Claude-connector-only architecture.

**Reasons (tied to prior decisions):**

1. Phases 3–5 define a **standalone recap-first product**, not a Claude skill pack (DEC-004, DEC-007).
2. MVP needs **owned multi-account sync, structured intents, corrections, and deterministic recap** (DEC-006)—MCP chat does not provide that system of record.
3. Catalog options either **split providers** (Gmail + M365) or **are competitors** (Mailopoly, Spark, Superhuman, Fyxer).
4. Security/privacy posture for school/work mail is clearer when EasyMail is the OAuth app with read-only scopes and non-destructive defaults—not when mail flows through chat + third-party connectors by default.
5. Complexity “saved” is mostly the product itself.

### Optional follow-ups (not DEC-008 changes)

- Track **Mailopoly** as a Phase 2/3 competitive risk (Claude-distributed catch-up briefing).
- Consider **H2** informal founder experiments in Claude for personal curiosity only—not as architecture.
- Consider **H1** (EasyMail MCP) only as a **post-MVP** distribution channel once the web app works.
- Reject **H3** (MCP as mail SDK inside EasyMail).

### What this means for paused Phase 7

- Resume Phase 7 **schema/security design on top of DEC-008** unless you explicitly choose to reopen Phase 3/6 product shape.
- No architecture amendment required from this evaluation alone.

---

## Sources

- [awesome-claude-connectors](https://github.com/rdmgator12/awesome-claude-connectors) README + `data/connectors.json` (meta: last updated August 10, 2026)
- [Claude Connectors directory](https://claude.com/docs/connectors/directory)
- [Submitting connectors](https://claude.com/docs/connectors/building/submission)
- [Connector authentication](https://claude.com/docs/connectors/building/authentication)
- EasyMail: `ARCHITECTURE.md`, `MVP.md`, `UX.md`, DEC-003–008

---

## Review Checkpoint

**Stop here.** Awaiting product-owner review before continuing Phase 7 or amending DEC-008.
