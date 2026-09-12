# Design System

> Product-level UI/design constraints for EasyMail. Pairs with `UX.md` (Phase 5
> flows — **not** redesigned by this document) and DEC-011/012/013/014.
>
> **Status: EasyMail Design System v1 — approved and final** (DEC-014). Primary
> color `#1F5FA9` and Geist Sans/Geist Mono are no longer provisional. This
> supersedes the specific token values from the Phase 9/10 provisional system;
> the underlying principles (content-first, restraint, neutral-first) carry
> forward unchanged.
> **Rule:** `UX.md` flows and information architecture are fixed; this document
> governs *how* they look and feel, not *what* the screens do.

---

## 0. How to use this file

- This is the single source of truth for EasyMail's visual identity.
- Every page and component must draw type, color, spacing, radius, borders,
  shadows, icons, and motion from the tokens defined here. No page invents its
  own style.
- When a token is missing for a real need, add it here first, then use it.
- Concrete values below are final v1 defaults. Changing a token is a
  design-system decision (a new DEC entry), not a per-component choice.

---

## 1. Product character

EasyMail should feel: **calm, precise, premium, focused, trustworthy, fast,
intentionally dense, productivity-first, email/content-first.**

It must **not** feel like: a generic AI SaaS dashboard, a vibe-coded Tailwind
site, a crypto app, a neon developer tool, an analytics dashboard, a card grid,
or a flashy AI landing page.

Guiding rules:

1. **Content first.** The UI prioritizes email content and attention hierarchy
   over decoration. The interface should recede; the user's mail is the subject.
2. **Earn every element.** Add whitespace, typography, alignment, and hierarchy
   *before* adding containers, color, or decoration. A border or a card must be
   justified by meaning, not habit.
3. **Restraint is the aesthetic.** Premium comes from precision (alignment,
   consistent spacing, good type) — not from effects.
4. **Calm and trustworthy.** No visual noise, no attention-grabbing motion, no
   "AI magic" theater. Trust is reinforced by clarity, not flourish.
5. **One coherent identity.** Everything looks like it came from the same
   product, even when built from multiple component sources — a user should
   never be able to tell which library a component came from.

### Reference products (conceptual only — never clone)

| Product | Borrow |
| --- | --- |
| **Linear** | Precision, compact vertical rhythm, restrained navigation, keyboard/focus quality, dense information |
| **Superhuman** | Sender→subject→snippet scanning hierarchy, productivity density, list/detail continuity, keyboard-first interaction |
| **Notion Mail** | Calmness, lightweight filtering/views, content-first presentation, reduced chrome |
| **Raycast** | Command search, keyboard shortcuts, compact actions, excellent keyboard navigation |
| **Attio** | Precise filter bars, clean record/list rows, neutral metadata, polished settings/account structure |

Never duplicate proprietary branding, copy, illustrations, or exact layouts from
these or from any component-source site (shadcn/Aceternity/Magic UI/21st.dev).

---

## 2. Prohibited "vibe-coded" patterns

Banned by default — do not ship without an explicit, documented exception:

- Neon-heavy palettes; purple/blue gradients as a default treatment.
- Decorative glow effects; glassmorphism used broadly; excessive gradients.
- Emojis as navigation, functional, or demo-content icons — Lucide only.
- A card wrapped around every section; nested cards (a card inside a card).
- Arbitrary colored sidebars/tabs/accent bars; meaningless colored status dots.
- Oversized rounded rectangles (>12px) or excessive pill-shaped controls.
- Excessive/heavy shadows; random animated backgrounds.
- Excessive dashboard widgets / "widgetized" / KPI-stat-card layouts.
- Generic "AI SaaS" hero styling (giant gradients, beams, shader/WebGL, neon,
  floating 3D objects, orbiting circles, particles, meteors, rainbow buttons,
  aurora text, animated gradient text, gratuitous border-beam effects, smooth
  cursor effects).
- Rainbow-coded categories for email intents (see §4).
- Fake data: invented testimonials, customer logos, star ratings, or metrics
  (users, emails processed, hours saved) that don't come from real product data.

If you catch yourself reaching for one of these to make a screen "look
finished," stop and fix hierarchy, spacing, and typography instead.

---

## 3. Typography

**Geist Sans + Geist Mono only.** Already wired via `next/font/google` in
`src/app/layout.tsx` (no separate `geist` package needed). Do not introduce
Inter, Manrope, Satoshi, Poppins, Plus Jakarta Sans, or any other family.

- **Geist Sans** — UI, headlines, body, buttons, forms, navigation, message
  content chrome.
- **Geist Mono** — timestamps where appropriate, keyboard shortcuts, small
  technical identifiers, debug/developer-only displays.

Use **three** weights only: 400 (regular), 500 (medium), 600 (semibold). No
light, no bold/800/900.

### Application scale

| Token | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| `text-page-title` | 26px / 32px | 600 | Page title (one per screen) |
| `text-section` | 15px / 20px | 600 | Section heading (e.g. "Needs you now") |
| `text-subject` | 14px / 20px | 550–600 | Email subject |
| `text-sender` | 13px / 18px | 500 | Sender |
| `text-body` | 14px / 21px | 400 | Default body, list rows, most UI text |
| `text-supporting` | 13px / 18px | 400 | Secondary/supporting copy |
| `text-metadata` | 12px / 16px | 400 | Account tag, time, low-priority meta |
| `text-label` | 11px / 16px | 550 | Small labels |
| `text-button` | 13px / 18px | 500 | Button text |

### Marketing scale

| Token | Size (desktop / tablet / mobile) | Weight |
| --- | --- | --- |
| `text-display` | 52–60px / 38–44px / 34–38px | 600 |
| `text-marketing-h2` | 34–40px | 600 |

Do not use giant 72–96px generic-SaaS headlines. Tight but readable tracking on
display type.

### Rules

- Hierarchy comes from size + weight + color, not from color hues or boxes.
- Avoid excessive uppercase — at most a single restrained uppercase label
  treatment, letter-spacing ≤0.04em.
- Body measure: aim for ~60–80 characters per line for reading blocks (Recap).

---

## 4. Color

Neutral-first. Color communicates meaning; it is not decoration.

### Tokens

```css
--background: #fafafa;
--surface: #ffffff;
--surface-subtle: #f7f7f8;
--surface-hover: #f2f3f5;

--foreground: #18181b;
--foreground-secondary: #52525b;
--foreground-muted: #71717a;
--foreground-faint: #a1a1aa;

--border: #e4e4e7;
--border-strong: #d4d4d8;

--primary: #1f5fa9;
--primary-hover: #194f8e;
--primary-subtle: #edf4fb;

--success: #15803d;
--success-subtle: #f0fdf4;

--warning: #a16207;
--warning-subtle: #fffbeb;

--danger: #b42318;
--danger-subtle: #fef3f2;
```

A dark theme may be added later using the same token names; do not hardcode
colors that would block it.

### Rules

- **No rainbow category system for the five email intents** (needs_reply,
  needs_action, matters, can_ignore, cleanup_candidate). Distinguish intents
  through order, grouping, weight, and labels — not five competing hues.
- Semantic colors (`success`/`warning`/`danger`) are reserved for actual state:
  connection health, destructive actions, save confirmations, errors — never
  intent identity.
- No meaningless colored status dots; a dot must map to a defined semantic
  state (e.g. account connection health).
- No arbitrary colored accent bars on cards/tabs/sidebars.

---

## 5. Spacing & layout

- **Base unit: 4px.** Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Application screens trend toward **compact** spacing; message/list rows
  prioritize scanning density (target ~8–12 visible rows on a normal laptop
  viewport where practical).
- Content max-width for reading surfaces (Recap): ~760–880px.
- Prefer separating sections with spacing, typography, borders, and dividers
  over wrapping each in a card. No widget grids, no metric-tile walls inside
  the authenticated product.

### Recap layout hierarchy (from `UX.md` — do not redesign the flow)

1. **Needs you now** — most prominent.
2. **Also matters** — clearly secondary, capped count.
3. **Safe to skip** — visually quiet, count/one-line.
4. **Cleanup when you have time** — quietest, count/flag only.

Prominence via size, weight, color, spacing — never colored containers.

---

## 6. Radius, borders, shadows

### Radius

| Use | Value |
| --- | --- |
| Small controls, badges | 5–6px |
| Inputs, buttons | 6px |
| Panels, dialogs, sheets | 8px |
| Marketing feature containers | max 10–12px |

No 20–32px pill-everything; avoid oversized rounded rectangles.

### Borders

Border-first design. Default separation is a 1px hairline (`--border`); use
`--border-strong` only when a hairline reads too weak.

### Shadows

Almost none. Border first, always. Restrained shadows only for: dropdown
menus, popovers, dialogs, floating overlays. No glows, no colored shadows, no
shadow-as-decoration on static content.

---

## 7. Icons

- **Lucide only** for functional product icons — one visual size/stroke
  system across the app. No emojis as functional icons, ever (including in
  any imported demo content — replace before shipping).
- Sizes: 14–16px compact UI, 16–18px buttons/actions, 20px rare larger
  contexts. Icons inherit `currentColor`.
- An official provider logo (Gmail/Outlook) is the one exception to
  Lucide-only, since those are brand marks, not functional icons.
- If a needed icon does not exist in Lucide, mark it `ASSET_REQUIRED` (§10);
  do not improvise with emoji or a second icon set.

---

## 8. Component strategy & sources

**shadcn/ui is the primary, default foundation.** `components.json` is already
configured (style `new-york`, baseColor `neutral`, Tailwind v4 CSS-variable
mode) — install missing primitives via `npx shadcn add <name>` rather than
hand-recreating upstream code, then normalize every one to the tokens above.

### shadcn/ui primitives (foundation layer)

Button, Input, Label, Select, Tabs, Badge, Separator, Tooltip, Dropdown Menu,
Dialog, Alert Dialog, Sheet, Popover, Command, Skeleton, Alert, Sonner,
Accordion, Checkbox, Radio Group, Form, Scroll Area, Avatar, Collapsible,
Breadcrumb. Sidebar only if EasyMail eventually adopts a sidebar (not
currently planned — the existing top navigation is preferred; see below).

### 21st.dev — composition/reference only

Use for **pattern reference**, not code: command-palette interaction
contracts, sidebar/responsive-nav mechanics, empty-state copy structure,
settings-row composition. Do not assume free CLI access — 21st's free tier is
2 component copies/day site-wide; unlimited CLI installs require paid
membership. Build the pattern directly with shadcn + EasyMail tokens instead
of importing 21st code, unless a specific case makes importing clearly worth
paying for.

### Magic UI — sparing, restyled motion only

**Approved:** Blur Fade (landing/onboarding entrance, ~0.3–0.45s, 4–8px
offset, small blur), Animated List (landing product-demo sequence — Lucide
icons, never the emoji demo content), Bento Grid (marketing feature section
only — never inside Recap/Triage/Settings/message lists), Number Ticker
(landing only, only with real product metrics — never invented numbers).

**Rejected:** Neon Gradient Card, Meteors, Particles, Rainbow Button, Aurora
Text, Animated Gradient Text, Warp Background, Orbiting Circles, excessive
Border Beam, Smooth Cursor.

Requires the `motion` package (current name for `framer-motion`) — only add it
when actually implementing Blur Fade/Animated List, not speculatively.

### Aceternity UI — landing/auth structural reference only

Use for structure and micro-interaction reference on marketing/auth surfaces,
restyled fully to EasyMail tokens — never its default visual identity
(gradients, shader/WebGL auth splits, floating dock navigation).

Access note: Aceternity's free tier is ~200 individual `/components/*`; its
`/blocks/*` collection (including Navbar blocks and "Hero Section With Tabs")
is largely gated behind a one-time paid All-Access purchase. Default to
building the *pattern* directly with shadcn + Lucide rather than assuming a
specific named block is free — verify access before depending on one.

### Rules (all sources)

- shadcn provides the default visual language; Aceternity/Magic UI/21st are
  **not** the default look and are used selectively, restyled.
- Never drop a component in unchanged. For every borrowed component: install
  through its official source, then (1) remove demo content, (2) remove demo
  colors, (3) remove demo fonts, (4) remove demo radii, (5) remove demo
  shadows, (6) remove decorative animation not appropriate to EasyMail,
  (7) replace icons with Lucide, (8) apply EasyMail tokens.
- Every component must serve a real user flow in `UX.md`.
- Every interactive element defines: default, hover, active/pressed, focus
  (visible ring using `--primary`), disabled, loading.

---

## 9. Motion

Motion explains state changes or improves interaction — never decoration.

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 120ms | Hover/press feedback, small toggles |
| `--motion-base` | 200ms | Expand/collapse, tab/content change |
| `--motion-slow` | 280ms | Dialog/sheet/drawer enter/exit |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default easing |

Respect `prefers-reduced-motion` (already handled globally in `globals.css`) —
extend the same guard to any Magic UI component added, since those use their
own animation props, not just CSS transitions.

**Allowed:** subtle hover feedback, expand/collapse, loading transitions/
skeletons, drawer/dialog/sheet transitions, correction-confirmation feedback,
the approved Magic UI set above.

**Prohibited:** perpetual/looping animations, glowing elements, floating
blobs, animated gradient backgrounds, any animation whose only purpose is to
look "AI-powered."

---

## 10. Images & custom visual assets (`ASSET_REQUIRED`)

Do not generate placeholder AI artwork. If EasyMail needs illustrations,
custom hero artwork, product imagery, branded graphics, or icons unavailable
in Lucide, mark it `ASSET_REQUIRED` with a short description and leave a
neutral placeholder (type + Lucide icon). The product owner supplies final
files separately.

| ID | Where used | Description | Status |
| --- | --- | --- | --- |
| _ASSET-001_ | Landing hero | (to be defined when landing is rebuilt) | Open |

---

## 11. Reference vs. copying

Component sites are inspiration and implementation resources, not designs to
copy wholesale. EasyMail has one coherent visual identity defined by this
file. Anything borrowed must be re-expressed in EasyMail tokens and must earn
its place in a real user flow.

---

## 12. Permanent EasyMail rule

> Preserve EasyMail Design System v1. Do not introduce new typography,
> colors, radius systems, icon families, surface styles, animation language,
> or third-party visual conventions unless explicitly approved. Third-party
> components must be normalized to EasyMail tokens before use.

Every future UI task begins with the paragraph above. Concretely, no agent may
introduce a new font, primary color, icon system, radius system, shadow
language, card language, or animation language without explicit product-owner
approval and a recorded decision (DEC entry). This applies equally to:

- Geist Sans + Geist Mono
- `#1F5FA9` primary
- The neutral-first surface/foreground scale in §4
- Lucide functional icons
- The 4px spacing system
- The 6px standard radius
- Border-first separation, minimal shadow
- Restrained motion (§9)
- Compact productivity density
- Neutral intent treatments (no rainbow-coded intents)

---

## 13. Change log

- 2026-09-10 — Initial draft created before Phase 9 per product-owner UI/design
  constraints (DEC-011).
- 2026-09-10 — Approved for Phase 9. Geist Sans and `#1F5FA9` remain provisional
  until the first real-UI visual review.
- 2026-09-11 — Phase 9 visual direction approved (DEC-012). Geist Sans and
  `#1F5FA9` stay provisional; next visual review deferred to the authenticated
  Recap UI (Phase 10). No further Phase 9 landing polish.
- 2026-09-11 — Phase 10 authenticated product visual direction approved
  (DEC-013). Typography/primary color remain provisional.
- 2026-09-12 — **EasyMail Design System v1 adopted (DEC-014)**, superseding all
  provisional token values above. Primary color and typography finalized.
  Full rewrite: new neutral palette, 4-level foreground hierarchy, updated
  semantic colors, shadcn-first component sourcing strategy, and explicit
  Aceternity/Magic UI/21st.dev usage and access rules. Built in the isolated
  `ui/design-system-v1` worktree/branch per standing instruction not to
  overwrite active Phase 11 backend work.
