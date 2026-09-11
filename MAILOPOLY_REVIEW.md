# Mailopoly Competitive Teardown

> Focused review before resuming Phase 7.  
> Research date: 2026-09-10.  
> Sources: [mailopoly.com](https://www.mailopoly.com), [/mcp](https://www.mailopoly.com/mcp/), [/security](https://www.mailopoly.com/security/), [/privacy](https://www.mailopoly.com/privacy/), [/news](https://www.mailopoly.com/news/), Google Play / App Store listings, third-party summaries (RightAIChoice, AI With Me).  
> Compared to EasyMail: `PROJECT.md`, `MVP.md`, `UX.md`, `MARKET.md`, `ARCHITECTURE.md`.  
> **Does not modify** `DECISIONS.md`, `ARCHITECTURE.md`, `PROJECT_STATE.md`, or other locked decisions.

---

## Executive answer

Mailopoly is a **real, shipped, multi-provider AI email suite** that overlaps EasyMail’s problem statement heavily: many inboxes, buried priorities, need to know what matters / needs reply / needs action, and a way to “catch up” without scanning everything.

It is **both** a standalone product (web + mobile) **and** a Claude/ChatGPT MCP connector.

For **your personal problem alone**, Mailopoly is close enough that **you should trial it** (Duo/Unlimited for multi-Gmail + Outlook) before assuming EasyMail must be built. Building EasyMail would **largely duplicate the problem-solving layer** unless you deliberately keep a sharper wedge: **attention layer beside native clients**, **structured intents + corrections**, **classify-only / non-destructive defaults**, and **not** becoming another unified AI inbox + EA + drafts + channels suite.

---

## What exactly does Mailopoly do?

Mailopoly markets itself as an **AI email suite that sits on top of accounts you already use** (not a greenfield mailbox migration).

### Core product surfaces

| Feature | What it does |
| --- | --- |
| **Unified inbox** | Connect Gmail, Outlook/Hotmail, Yahoo, iCloud, IMAP (+ optional `@mly.life` address) into one place |
| **Cleanbox** | AI separates “what matters” from noise from day one; no manual rules; one-tap preference teaching; priority notifications |
| **Extraction** | Pulls invoice amounts, bookings, dates/times, meetings, deliveries, attachments, tasks/actions without opening every mail |
| **AI drafts** | Multiple reply suggestions “in your voice”; edit or send |
| **Poly** | In-app AI life assistant: ask what’s due, summarize threads, draft replies, life-admin Q&A |
| **My Day** | Auto-populated task/planner list from inbox (bills, events, deliveries, replies owed); add your own |
| **Catch-Up** | Marketing/MCP describe catching up on **Cleanbox** / summarising the personal non-promotional feed; third-party writeups also mention Catch-Up for low-priority mail |
| **Unsubscribe / cleanup** | Bulk unsubscribe; noise handling (claims noise not deleted, remains searchable) |
| **PolyBox** | Attachments from all inboxes in one library |
| **Get a Code** | Live fetch of verification codes from connected mailboxes |
| **Business channels (Pro/Business)** | Slack, Teams, WhatsApp, Instagram, Messenger, TikTok, X — same inbox/Cleanbox/My Day/Poly model |
| **MCP** | One connection so Claude/ChatGPT/other MCP clients can search all connected inboxes, My Day, drafts/send (scoped), etc. |

### Positioning

- “Most of your inbox is noise” + live demo framing (e.g. 180→7 / 60→12 anecdotes on homepage).
- Zero setup / zero migration.
- Built for busy personal + side-hustle + multi-account life — close to EasyMail’s mixed-life archetype.
- Expanding beyond email into a **multi-channel attention OS**.

### Pricing (directional; confirm on site)

Third-party 2026 summaries commonly list personal email plans roughly:

| Plan | ~Monthly | Accounts (reported) |
| --- | --- | --- |
| Single | ~$6.99 (~$4.89 annual) | 1 email |
| Duo | ~$8.99 (~$6.29 annual) | 2 email |
| Unlimited | ~$11.99 (~$8.39 annual) | ~5 email |
| Pro / Business | higher (~$18–25+ founding/renew) | multi-channel / team |

- **7-day free trial** widely advertised (often “no card”).
- MCP included in plans (not a separate fee); business channels depend on Pro/Business.

### Security / privacy (vendor claims + policy)

- Google **CASA Tier 2** (TAC Security) — [security page](https://www.mailopoly.com/security/).
- Also claims **SOC 2 Type II** in some marketing/third-party pages (verify current badge yourself).
- OAuth for Google/Microsoft (no password); IMAP may store encrypted passwords (AES-256) — [privacy](https://www.mailopoly.com/privacy/).
- Email content processed by **multiple third-party LLMs** (policy lists Google Gemini, Atlas Cloud, Fireworks, Anthropic, OpenAI, xAI) under DPAs; claims **no training** on customer data.
- Storage primarily **AWS Sydney (Australia)**; AI processing may be US/other.
- Disconnect: credentials deleted; **imported messages can remain** until account delete.
- Account delete: content/derived data erased within **30 days**.
- **AI processing is mandatory** for the service (no meaningful “AI off” mode if you connect mail).

### Claude connector / MCP

- Listed in Claude Connectors Directory and ChatGPT Apps directory ([news](https://www.mailopoly.com/news/), [mcp](https://www.mailopoly.com/mcp/)).
- Endpoint example: `https://fastapi.prod.aws.mailopoly.com/mcp-server/` (streamable HTTP + OAuth 2.1).
- One Mailopoly login → assistant sees **all connected accounts** (and Pro channels).
- Separate grants: read vs change vs send; send is confirm-first; tool calls audit-logged; revoke in Settings → Security → Connected AI assistants.
- MCP can: search/read, Cleanbox catch-up, My Day/tasks, bills/deliveries, drafts, send if permitted.

**Product shape:** **Primarily standalone** (web/iOS/Android) **with MCP as a first-class expansion**, not an MCP-only toy.

---

## How similar is it to EasyMail?

| EasyMail (planned) | Mailopoly (shipped) | Similarity |
| --- | --- | --- |
| Multi Gmail + Outlook | Multi-provider incl. Gmail + Outlook + more | **Very high** |
| Know what matters / needs reply / action / ignore / cleanup | Cleanbox + extraction + My Day + unsubscribe | **High** |
| Concise cross-inbox recap | Catch-Up / Cleanbox summary + Poly Q&A + My Day | **High intent, medium mechanism** |
| Stay organized across school/work/personal | Explicit multi-life / side-hustle positioning | **Very high** |
| Attention layer, **not** full client | Unified inbox + drafts + send + tasks + channels | **Low** (opposite product form) |
| Classify-only, non-destructive MVP | Filtering + drafts + send + unsubscribe + channel replies | **Low** |
| Open in native Gmail/Outlook | Live inside Mailopoly (MCP can reply via Mailopoly) | **Low** |
| Personal/prosumer price below exec tools | ~$7–12 email plans | **Aligned** |

**Bottom line:** Same **job-to-be-done**, different **product form**. Mailopoly is closer to “AI unified inbox + life EA.” EasyMail is planned as “cross-inbox attention/recap layer beside native mail.”

---

## What Mailopoly already does better than our planned MVP

1. **Exists and ships** — apps, OAuth, sync, mobile, localization (31 languages claimed).
2. **Broader provider coverage** — Yahoo/iCloud/IMAP, not only Gmail+Outlook.
3. **Security maturity for Gmail restricted scopes** — CASA Tier 2 already claimed (EasyMail would still face this for public Gmail).
4. **Day-one Cleanbox** without building classify pipeline from scratch.
5. **My Day / task extraction** — EasyMail MVP only *surfaces* needs-action signals, no task system.
6. **Drafting + send** — out of EasyMail MVP by design; Mailopoly has it.
7. **Bulk unsubscribe / noise handling** — EasyMail MVP is flag-only.
8. **MCP distribution** — Claude/ChatGPT already wired.
9. **Price for multi-account** — Unlimited ~$12 may cover founder’s 3 accounts cheaper than many Phase 2 comps.
10. **Onboarding polish** — “zero setup,” multi-account testimonials, live demo marketing.

---

## What EasyMail plans to do differently / better

1. **Not a mail client** (DEC-004) — native Gmail/Outlook remain where you read/reply; EasyMail is the attention layer.
2. **Explicit intent taxonomy** — needs reply / needs action / matters / can ignore / cleanup candidate (`MVP.md`), not only important-vs-noise.
3. **Recap-first home** (`UX.md`, DEC-007) — structured debrief as the primary surface, not a unified chronological inbox.
4. **Classify-only / non-destructive MVP** (DEC-006) — no auto-send, no auto-archive, no unsubscribe execution until trust earned.
5. **Corrections as a first-class trust loop** — market lesson from Fyxer/SaneBox; EasyMail centers override UX.
6. **Narrower scope** — avoid EA + drafts + multi-channel sprawl until core triage/recap works.
7. **Owned system of record** for classifications/corrections/eval — build-for-product and learning, not only consume a vendor.
8. **Potentially clearer work-mail posture** for a loan-officer Outlook account — still OAuth risk either way, but EasyMail can stay read-only and stay-native by policy.

These are **planned** advantages. None are proven against Mailopoly in use yet.

---

## Does Mailopoly already solve your personal problem well enough that building EasyMail mostly duplicates it?

**For the personal outcome (“spend less time scanning; know what needs me across school/personal/work”): largely yes — Mailopoly targets that job.**

If the goal is only **solve Meron’s inbox**, building EasyMail from scratch would **mostly duplicate** an existing paid product’s value, unless after a real trial you find:

- Cleanbox too blunt vs intent labels you need,
- you refuse to live in a third-party inbox UI,
- work Outlook / compliance / AI-subprocessor list is unacceptable,
- or you specifically want a recap-only, classify-only, native-client-preserving tool.

**Recommendation before Phase 8 coding:** run a **7-day Mailopoly trial** with school Gmail + personal Gmail + work Outlook (if IT allows). Score it against EasyMail MVP success criteria in `MVP.md`. That empirical gate is more important than more docs.

Building remains justified if the goal includes **owning a differentiated product**, learning the stack, or a wedge Mailopoly doesn’t prioritize (stay-native attention layer). It is weaker if the goal is solely personal relief.

---

## Complaints, limitations, missing features, UX gaps

Public independent review volume is **thin** (young product; App Store often “not enough ratings”). Gaps below mix **documented policy/product facts** and **reasonable risk inferences**:

| Gap / risk | Evidence type |
| --- | --- |
| **Must trust a third party with full mailbox content** | Privacy: processes email content + attachments |
| **Many AI subprocessors** (Gemini, OpenAI, Anthropic, xAI, etc.) | Privacy policy named list |
| **AI is mandatory** — no “connect without AI processing” | Privacy: service cannot be provided without AI |
| **No free forever tier** — trial then paid | Pricing summaries |
| **Disconnect leaves imported mail in Mailopoly** until account delete | Privacy |
| **Data residency Australia (+ US AI)** — may matter for work/school | Privacy |
| **Corporate Outlook / M365 admin consent** may block work mail | Industry-wide; not Mailopoly-specific |
| **Product sprawl** (channels, X, Agent Switchboard) — complexity / scope risk | News |
| **IMAP password storage** if not OAuth | Privacy (encrypted, but higher sensitivity) |
| **Sparse long-term accuracy evidence** | Few independent reviews |
| **Unified-inbox switching cost** — new daily habit vs native apps | Product form |
| **Send-capable surface** — higher blast radius than EasyMail MVP | MCP/app features |

Homepage testimonials praise notifications quality, multi-account setup, and control — treat as marketing, not proof.

---

## Is Catch-Up essentially the same as EasyMail’s recap?

**Same job family, not the same feature.**

| | EasyMail recap (planned) | Mailopoly Catch-Up / related |
| --- | --- | --- |
| Purpose | Feel caught up across accounts without scanning | Catch up on filtered/Cleanbox (and/or low-priority) mail; also Poly Q&A + My Day |
| Shape | Structured sections: needs reply, needs action, matters, ignore counts, cleanup counts | Summary of Cleanbox / non-promotional feed; assistant can summarise |
| Primary UI | Default **home** of the product | One capability among Cleanbox, My Day, Poly, unified inbox |
| Determinism | Planned deterministic from classifications | AI-assisted / assistant-driven |

Mailopoly’s **combination** of Cleanbox + My Day + Poly “what did I miss?” is what actually maps to EasyMail’s desired outcome—not Catch-Up alone.

---

## How does multi-inbox work?

1. Connect multiple provider accounts (OAuth or IMAP).
2. Messages appear in a **unified inbox**; Cleanbox filters noise across them.
3. Search/MCP can query **all accounts in one pass** or target one account.
4. Replies can be sent **from the appropriate connected identity**.
5. My Day aggregates tasks/commitments **across** accounts (and Pro channels).
6. MCP: **one Mailopoly connection** exposes every linked inbox to Claude/ChatGPT.

This matches EasyMail’s multi-account *need*, but implements it as **one inbox product**, whereas EasyMail plans **one attention layer** over native inboxes.

---

## Standalone, Claude connector, or both?

**Both — primarily standalone.**

- Standalone: web + Android + iOS, billing, Cleanbox, Poly, My Day.
- Connector: Claude directory + ChatGPT app + generic MCP endpoint.
- Vendor framing: use **Poly in-app** and **MCP in Claude/ChatGPT** together.

---

## Could you simply use Mailopoly instead of building EasyMail?

**Yes, as a personal tool — with caveats.**

**Use Mailopoly if:** you want relief now; accept a unified AI inbox; IT allows Outlook OAuth; you’re fine with AI subprocessors and AU storage; ~$9–12/mo is OK.

**Don’t stop at “subscribe forever” without checking:** work-mail policy (mortgage/loan context), whether you hate leaving Gmail/Outlook UIs, and whether Cleanbox’s binary-ish “matters vs noise” is enough vs explicit reply/action/cleanup intents.

**Build EasyMail if:** after trial, the stay-native + intent-recap + classify-only wedge still feels necessary; or you are building a product, not only solving personal mail.

---

## What to learn without copying

1. **Multi-account pricing that doesn’t punish 3 mailboxes** — EasyMail’s later pricing hypothesis should stay below exec tools; Mailopoly shows ~$12 Unlimited is believable.
2. **“Understood, not just fetched”** — triage/extraction before assistant access (their MCP pitch) matches EasyMail’s classify-then-recap idea.
3. **One-tap preference teaching** — lightweight correction UX works as marketing and product.
4. **Security as unlock** — CASA Tier 2 is table-stakes for serious Gmail products; plan early if public.
5. **Don’t sprawl early** — their channels/X/agent network show gravity toward “everything inbox”; EasyMail’s DEC-003/004/006 exist to resist that.
6. **Catch-up + tasks beat raw lists** — My Day + briefings reinforce Phase 3 aha; keep recap primary, consider tasks only later.
7. **MCP as distribution after core** — validates MCP_EVALUATION H1 (EasyMail MCP later), not MCP-only architecture.

---

## Should Phases 2–6 be amended because of this?

**Suggested amendments (for your approval later — not applied in this file):**

| Phase / doc | Suggested change | Must change now? |
| --- | --- | --- |
| **Phase 2 / `MARKET.md`** | Add **Mailopoly as a primary direct competitor** (missing/underweighted vs SaneBox/alfred_/Fyxer) | **Yes, when you allow doc updates** — material gap |
| **Phase 3 / `PROJECT.md`** | Sharpen “why choose EasyMail” vs **unified AI inbox suites** (Mailopoly/Spark): stay-native attention layer | Recommended |
| **Phase 4 / `MVP.md`** | Keep boundary; add explicit non-goal: “do not build Mailopoly-class unified client + Poly EA” | Recommended clarity |
| **Phase 5 / `UX.md`** | Optional note: differentiate recap home from Cleanbox unified inbox | Optional |
| **Phase 6 / `ARCHITECTURE.md` / DEC-008** | **No change required** to stack because of Mailopoly; MCP_EVAL still holds | No |
| **Process** | Add **personal Mailopoly trial** as a gate before Phase 8 implementation | Strongly recommended |

**Do not** abandon EasyMail’s product definition solely because Mailopoly exists—unless a trial shows the personal problem is fully solved and you only cared about personal relief.

**Do** treat Mailopoly as the **closest live competitor** to the EasyMail JTBD, closer than alfred_ or SaneBox on multi-provider + catch-up narrative.

---

## Side-by-side snapshot

| | EasyMail (plan) | Mailopoly (shipped) |
| --- | --- | --- |
| Form | Attention / recap layer | AI unified inbox + EA |
| Providers (MVP) | Multi-Gmail + Outlook | Gmail, Outlook, Yahoo, iCloud, IMAP, … |
| Primary UX | Recap + triage | Cleanbox + My Day + Poly (+ inbox) |
| Draft/send | Out of MVP | Core |
| Cleanup execution | Flag only (MVP) | Unsubscribe / noise handling |
| Native clients | Stay there | Replace daily habit |
| MCP | Possible later | Live now |
| Security posture | Designed, not shipped | CASA Tier 2 claimed |
| Price | TBD / below exec | ~$7–12 email plans |
| Status | Docs through Phase 6 | Live product |

---

## Review checkpoint

**Stop here.** No decision files modified.

Please decide next:

1. Trial Mailopoly personally and report back, and/or  
2. Approve MARKET/PROJECT/MVP doc amendments listing Mailopoly, and/or  
3. Resume Phase 7 on DEC-008 unchanged, and/or  
4. Reopen product definition if you conclude “just use Mailopoly.”
