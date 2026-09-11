# User Experience

> Phase 5 — how the user gets value from entry through repeat use.  
> Scope: MVP only (`MVP.md`). Surface: recap-first attention layer (DEC-004).

## UX Principles

1. **Recap first** — home answers “what needs me?” before any mailbox chrome.
2. **Minimal friction to aha** — connect accounts → sync → recap; no tour walls or feature sprawl.
3. **Partial progress allowed** — user can enter the app with fewer than all accounts, but is clearly guided to finish multi-Gmail + Outlook.
4. **Native mail for depth** — EasyMail decides attention; Gmail/Outlook handle read/reply.
5. **Trust is visible** — classifications are correctable; EasyMail never implies it sent, archived, or unsubscribed.
6. **No silent failure** — auth/sync problems are always visible with a next step.

---

## Primary User Journey (end-to-end)

```
Landing → Sign up → Onboarding (connect accounts)
  → First sync/classify → Home Recap (aha)
  → Triage / item detail → Correct if wrong → Open in native mail
  → Return to EasyMail → Mark handled (optional) → Done
Repeat: Open app → Recap/triage → act → correct → leave
Anytime: Settings → reconnect / disconnect / logout / delete account
```

### Journey steps

| Step | User intent | Outcome |
| --- | --- | --- |
| 1. Entry | Understand what EasyMail is | Clear promise; CTA to start |
| 2. Sign up | Create personal account | Authenticated session |
| 3. Onboarding | Connect school Gmail, personal Gmail, Outlook | Accounts linked; checklist toward MVP activation |
| 4. First sync | Wait without confusion | Progress + “preparing your recap” |
| 5. First recap | Feel caught up across inboxes | Concise debrief + needs-me highlights |
| 6. Act | Handle real items | Open native mail; optional mark handled |
| 7. Correct | Fix bad labels | Intent updated; trust reinforced |
| 8. Repeat | Replace inbox scanning habit | Same home, fresh window |
| 9. Manage | Fix broken links / leave | Reconnect, disconnect, logout, delete |

### Friction rules

- Do **not** require a long questionnaire before OAuth.
- Do **not** force composing email inside EasyMail.
- Do **not** block Home forever if only one account is connected — show partial recap + strong connect banner.
- Do **not** hide “needs reconnect” in a settings-only dead end — surface on Home.

---

## Information Architecture (MVP screens)

1. Landing
2. Sign up / Sign in
3. Onboarding — Connect accounts
4. Home — Recap (default)
5. Triage (intent-filtered list; may be Home sections or a sibling view)
6. Item detail (sheet/page)
7. Settings — Accounts & privacy
8. (System) OAuth provider screens — external

---

## Screen Specifications

### 1. Landing / Entry

**User goal:** Decide to try EasyMail.  
**Inputs:** None.  
**Actions:** Sign up; Sign in.  
**States:** Default.  
**Errors:** N/A.  
**Success:** User starts auth.

**Content (minimal):** Product name; one-line promise (“Know what needs you across Gmail and Outlook — without scanning every inbox”); CTA. No pricing wall for personal MVP.

---

### 2. Sign Up

**User goal:** Create an EasyMail account.  
**Inputs:** Email + password **or** magic link / OAuth-for-app-user (exact auth mechanism → Phase 6); agree to basic privacy note that EasyMail will access connected mailboxes via OAuth.  
**Actions:** Submit; go to Sign in.  
**States:** Idle; submitting; success redirect.  
**Errors:** Invalid email; weak password; account exists; network failure — inline, recoverable.  
**Success:** Session created → Onboarding.

---

### 3. Sign In / Authentication

**User goal:** Return to existing account.  
**Inputs:** Credentials or magic link.  
**Actions:** Sign in; forgot password (if password auth); sign up link.  
**States:** Idle; submitting.  
**Errors:** Wrong credentials; locked/rate limited; network — clear retry.  
**Success:** If no mail accounts → Onboarding; else → Home.

---

### 4. Onboarding — Connect Accounts

**User goal:** Link the inboxes EasyMail will watch.  
**Inputs:** OAuth consent on Google / Microsoft; optional account nickname (School / Personal / Work) after connect (SHOULD HAVE).  
**Actions:**
- Connect Gmail
- Connect another Gmail
- Connect Outlook
- Continue to Home (enabled when ≥1 account connected; recommended when checklist complete)
- Skip for now (only after ≥1 account) → Home with incomplete banner

**States:**
- Empty (no accounts)
- Partial (some connected)
- Complete checklist (≥2 Gmail + 1 Outlook) — “You’re ready”
- Connecting (OAuth in progress)
- Syncing first mail after each successful connect

**Errors:**
- OAuth denied / cancelled → stay on onboarding with explanation and retry
- Wrong account type / permission missing → explain required mail read scope in plain language; retry
- Duplicate account → “Already connected”
- Provider outage → retry later; do not fake success

**Success:** Account appears in checklist with email address + provider; user can proceed toward first recap.

**Checklist copy (MVP activation target):**
1. School Gmail  
2. Personal Gmail  
3. Work Outlook  

User may rename; labels are suggestions.

**Dead-end prevention:** Always show which accounts are connected and a primary retry CTA on failure. Never strand after OAuth popup closes with no feedback.

---

### 5. First Sync / Classify (blocking overlay or full-page)

**User goal:** Understand the wait; not abandon.  
**Inputs:** None.  
**Actions:** Wait; cancel only if safe (returns to Home/onboarding with “sync incomplete”).  
**States:** Fetching mail; classifying; generating recap; done.  
**Errors:** Sync failed for one account → continue with others + banner naming the failed account; total failure → retry.  
**Success:** Navigate to Home Recap with data.

**Copy tone:** “Pulling recent mail and sorting what needs you…” — not “training AI” jargon.

---

### 6. Home — Recap (core screen)

**User goal:** Feel caught up; see what needs attention across accounts.  
**Inputs:** Time window control (simple): e.g. Since last visit (default) | Today | Last 24 hours.  
**Actions:**
- Read recap summary
- Jump to a highlighted item
- Switch to Triage / filter chips
- Refresh / Sync now (SHOULD HAVE)
- Open Settings
- Dismiss or act on connect/reconnect banners

**Recap structure (MVP):**
1. **Needs you now** — short bullets for *needs reply* + *needs action* (account tag on each)
2. **Also matters** — brief *matters* items (capped)
3. **Safe to skip** — count or one-line for *can ignore*
4. **Cleanup when you have time** — count of *cleanup candidates* (flag only; no execute button that claims unsubscribe)

**States:**
- Loading recap
- Ready
- Stale (last sync age shown) + refresh
- Partial accounts (banner: connect remaining)
- Account needs reconnect (persistent banner)
- Empty window (“Nothing new in this window — try a wider range or sync”)
- All clear (“You’re caught up for this window”)

**Errors:** Recap generation failed → show triage list fallback + retry; never blank page without CTA.

**Success:** User knows top items without opening three native inboxes (aha).

---

### 7. Triage List

**User goal:** Browse classified messages by intent across accounts.  
**Inputs:** Intent filter (All needs me | Needs reply | Needs action | Matters | Can ignore | Cleanup); optional account filter.  
**Actions:** Open item; change intent (correct); open in native mail; mark handled (SHOULD HAVE).  
**States:** Loading; list; empty for filter; filtered zero results.  
**Errors:** Load failure → retry.  
**Success:** User finds/handles the right subset quickly.

**List row shows:** Intent; account nickname/address; sender; subject; short snippet or why; time.

**Ordering default:** Needs reply → Needs action → Matters → Cleanup → Can ignore (within “All needs me,” exclude ignore/cleanup or put them behind other filters).

---

### 8. Item Detail

**User goal:** Confirm why this was surfaced; decide next step.  
**Inputs:** None required.  
**Actions:**
- Change classification (correct)
- Open in Gmail / Outlook
- Mark handled (SHOULD HAVE)
- Back to recap/triage

**States:** Loading; ready; opening external link.  
**Errors:** Deep link failed → show copyable web URL or “open provider inbox and search subject”; never dead-end.  
**Success:** User either corrects, opens native mail, or dismisses as handled.

**Must show:** Full intent; account; sender; subject; snippet/why; explicit note: “EasyMail does not send or delete email for you.”

**Must not show:** Rich compose, reply editor, unsubscribe-execute primary CTA.

---

### 9. Correct Classification

**User goal:** Fix a wrong label so future trust improves.  
**Inputs:** New primary intent from the five MVP labels.  
**Actions:** Save correction; cancel.  
**States:** Picker open; saving; saved.  
**Errors:** Save failed → retry; keep previous intent visible.  
**Success:** Item moves to new bucket; brief confirmation (“Updated — thanks, that helps”).

Accessible from list row and detail. One tap/few taps max.

---

### 10. Open in Native Mail

**User goal:** Read or reply in the real client.  
**Inputs:** None.  
**Actions:** Tap Open in Gmail / Open in Outlook.  
**States:** Launching external app/tab.  
**Errors:** Cannot deep-link → fallback instructions.  
**Success:** Provider UI opens on/near the message; user returns to EasyMail when ready.

---

### 11. Settings — Accounts & Privacy

**User goal:** Manage connections and leave safely.  
**Inputs:** Nickname edits (SHOULD HAVE).  
**Actions:**
- Connect another account
- Reconnect account (re-OAuth)
- Disconnect account (confirm)
- Sync now
- Log out
- Delete EasyMail account (confirm; explains mail stays at Google/Microsoft, EasyMail data removed)

**States:** Account list with health (OK / Needs reconnect / Sync error); confirming destructive actions.  
**Errors:** Disconnect/delete failure → explain and retry; never claim success falsely.  
**Success:** Accounts reflect reality; user can exit product cleanly.

**Privacy reminders:** OAuth access; classify-only; no auto-send/auto-archive/unsubscribe execution in MVP.

---

## Empty, Loading, and Error Catalog

| Situation | Where shown | User next step |
| --- | --- | --- |
| No accounts connected | Onboarding / Home gate | Connect Gmail or Outlook |
| Only one provider/account | Home banner | Connect remaining checklist items |
| Sync in progress | Home + overlay first time | Wait; see which account is syncing |
| Sync failed (one account) | Banner + Settings health | Reconnect / retry that account |
| All accounts need reconnect | Blocking home banner | Reconnect CTAs |
| No messages in window | Recap + Triage empty | Widen window or sync |
| All caught up | Recap success empty | Done; or check cleanup later |
| Classification still running | Triage skeleton / “Sorting…” | Wait or refresh |
| OAuth denied | Onboarding/Settings | Retry with reason |
| Recap failed | Home | Retry; triage fallback |
| Deep link failed | Item detail | Fallback open instructions |
| Network offline | Global toast/banner | Retry when online |

---

## Repeat-Usage UX

- Default landing after login: **Home Recap** with “since last visit” when possible.
- Show **last updated** time; one-tap refresh.
- Handled items drop out of “needs me” (if mark-handled ships); otherwise user relies on native read state over time — Phase 6/7 may use read/seen signals later; MVP UX should not depend on perfect read sync.
- Corrections remain easy forever (not onboarding-only).

---

## Account Deletion & Logout

| Action | Effect |
| --- | --- |
| Log out | Ends EasyMail session; mail accounts remain connected for next login |
| Disconnect account | Revokes/stops sync for that mailbox; removes its items from recap/triage |
| Delete EasyMail account | Deletes EasyMail user data; user should understand provider mail is untouched; tokens discarded |

Confirm copy must avoid panic (“This will not delete your Gmail/Outlook mail”).

---

## Out of UX Scope (MVP)

- Compose/reply UI
- Unsubscribe execution flows
- Push notification redesign of OS email alerts
- Team sharing, admin, billing screens
- Long interactive product tours
- Calendar scheduling UI

---

## UX Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| User quits during first sync | Clear progress; partial results; retry per account |
| User connects only Gmail and thinks product is “done” | Persistent checklist until Outlook + second Gmail |
| Deep links fail on mobile/desktop mix | Fallback instructions always available |
| User distrusts AI after one miss | Ultra-easy correction + “we don’t act on mail for you” |
| Recap too long → becomes another inbox | Hard caps on “also matters”; counts for ignore/cleanup |

---

## Phase 5 Exit Check (internal)

- Primary journey complete: yes
- Major dead ends addressed: yes (OAuth fail, sync fail, deep link fail, empty windows, reconnect)
- Empty/loading/error considered: yes
- Value with minimal friction: signup → connect → recap; no client replacement required
