# Design System

> Product-level UI/design constraints for EasyMail. Authored before Phase 9
> (Foundation Build) to gate all frontend implementation. Pairs with `UX.md`
> (Phase 5 flows — **not** to be redesigned) and DEC-011.
>
> **Status:** Draft — awaiting product-owner approval.
> **Rule:** Do not begin substantial frontend styling until this document is
> approved. `UX.md` flows and information architecture are fixed; this document
> governs *how* they look and feel, not *what* the screens do.

---

## 0. How to use this file

- This is the single source of truth for EasyMail's visual identity.
- Every page and component must draw type, color, spacing, radius, borders,
  shadows, icons, and motion from the tokens defined here. No page invents its
  own style.
- When a token is missing for a real need, add it here first, then use it.
- Concrete values below (fonts, hex, radii, durations) are the **approved
  defaults**. Changing a token is a design-system decision, not a per-component
  choice.

---

## 1. Visual principles

EasyMail should feel: **clean, calm, premium, intentional, productivity-focused,
trustworthy, lightweight.** Closer to a mature productivity tool than an AI demo.

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
   product, even when built from multiple component sources.

---

## 2. Prohibited "vibe-coded" patterns

These are banned by default. They read as generic AI-generated SaaS and
undermine the calm/premium/trustworthy goal. Do not ship them without an
explicit, documented design-system exception.

- Neon-heavy color palettes.
- Purple/blue gradients as a default treatment.
- Decorative glow effects.
- Glassmorphism used broadly.
- Excessive gradients (gradients are off by default).
- Emojis as navigation or UI icons.
- A card wrapped around every section.
- Nested cards (a card inside a card).
- Arbitrary colored sidebars/tabs/accent bars on components.
- Meaningless colored status dots.
- Oversized rounded rectangles everywhere.
- Excessive pill-shaped controls.
- Excessive/heavy shadows.
- Random animated backgrounds.
- Excessive dashboard widgets / "widgetized" layouts.
- Generic "AI SaaS" hero styling.
- Rainbow-coded categories for email intents (see §5).

If you catch yourself reaching for one of these to make a screen "look
finished," stop and fix hierarchy, spacing, and typography instead.

---

## 3. Typography

Typography carries most of the visual hierarchy. Get this right before adding any
other treatment.

### Font family

- **Primary (UI + body):** **Geist Sans** — a high-quality, modern, highly
  readable sans-serif that reads premium and neutral (not "default AI"). Aligns
  with the Next.js/Vercel stack (`next/font`, zero layout shift).
  - Fallback stack: `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif`.
- **Monospace (limited):** **Geist Mono** — only for technical/tabular contexts
  where alignment matters (e.g. IDs, timestamps in dense tables). Not for body.
- **Alternative if Geist is rejected:** Inter (same rules apply). Do **not** mix
  more than one primary sans across the app.

Only one primary sans-serif. No decorative/display fonts. No unrelated second
font.

### Type scale

Restrained scale. Do not exceed the largest step in-app; oversized display type
is a prohibited pattern.

| Token | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| `text-display` | 30px / 36px | 600 | Landing hero headline only |
| `text-h1` | 24px / 32px | 600 | Page title (one per screen) |
| `text-h2` | 20px / 28px | 600 | Recap section headers (e.g. "Needs you now") |
| `text-h3` | 16px / 24px | 600 | Sub-section / card title |
| `text-body` | 14px / 22px | 400 | Default body, list rows, most UI text |
| `text-body-strong` | 14px / 22px | 500 | Emphasis inside body (sender, subject) |
| `text-small` | 13px / 20px | 400 | Secondary metadata (account tag, time) |
| `text-caption` | 12px / 16px | 400/500 | Low-priority meta, counts, hints |

### Weights

Use **three** weights only: 400 (regular), 500 (medium), 600 (semibold). No
light, no bold/800/900.

### Typography rules

- Hierarchy comes from size + weight + color (neutral shades), not from color
  hues or boxes.
- Avoid excessive uppercase. At most, small labels may use a single
  restrained uppercase treatment (`text-caption`, letter-spacing ≤ 0.04em).
- Avoid excessive letter spacing. Default tracking; only tiny caps labels adjust.
- Body measure: aim for ~60–80 characters per line for reading blocks (recap).

---

## 4. Color

Start primarily **neutral**. Color communicates meaning; it is not decoration.

### Palette structure

- **Neutrals** — surfaces, text, borders (the bulk of the UI).
- **One primary brand color** — primary actions, focus, active nav.
- **One optional accent** — used sparingly for a single highlight moment.
- **Semantic colors** — only for real states: error, warning, success, info.

### Neutral scale (default light theme)

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#FFFFFF` | App background |
| `--surface` | `#FAFAF9` | Subtle raised/section surface (use rarely) |
| `--surface-muted` | `#F4F4F5` | Hover/selected row, quiet fill |
| `--border` | `#E7E5E4` | Hairline borders, dividers |
| `--border-strong` | `#D6D3D1` | Emphasized separation |
| `--text` | `#1C1917` | Primary text (near-black ink, not pure #000) |
| `--text-muted` | `#57534E` | Secondary text |
| `--text-subtle` | `#8A857F` | Tertiary/low-priority text, placeholders |

A dark theme may be added later using the same token names; do not hardcode
colors that would block it.

### Brand + accent

| Token | Value | Use |
| --- | --- | --- |
| `--primary` | `#1F5FA9` (calm, slightly muted deep blue) | Primary buttons, focus ring, active nav, links |
| `--primary-foreground` | `#FFFFFF` | Text/icon on primary |
| `--primary-hover` | `#1A5292` | Primary hover state |
| `--accent` | `#0E7C6B` (restrained teal) — optional | One highlight moment max; not a second theme color |

Deep, flat, slightly desaturated — never neon, never a gradient. The primary is
a single solid color, not a purple/blue gradient.

### Semantic colors (state only)

| Token | Value | Meaning |
| --- | --- | --- |
| `--error` | `#B42318` | Failures: sync failed, OAuth denied, delete errors |
| `--warning` | `#B54708` | Needs attention: account needs reconnect, stale |
| `--success` | `#067647` | Confirmations: connected, correction saved |
| `--info` | `#175CD3` | Neutral informational notices |

Each has a matching subtle background/foreground pair for badges/banners
(e.g. `--error-bg`, `--error-fg`), to be added as needed — always low-saturation.

### Color rules

- Neutral by default; color must earn its place by carrying meaning.
- No rainbow category system for the five email intents (needs_reply,
  needs_action, matters, can_ignore, cleanup_candidate). Distinguish intents
  through **order, grouping, weight, and labels** (per `UX.md` recap sections),
  not five competing hues. Semantic color may mark *state* (e.g. an error), not
  intent identity. Introducing intent color coding requires usability evidence
  and a design-system update.
- No meaningless colored status dots. A dot/indicator must map to a defined
  semantic state.
- No arbitrary colored accent bars on cards/tabs/sidebars.

---

## 5. Spacing & layout grid

- **Base unit: 4px.** All spacing is a multiple of 4.
- Scale tokens: `space-1`=4, `space-2`=8, `space-3`=12, `space-4`=16,
  `space-5`=20, `space-6`=24, `space-8`=32, `space-10`=40, `space-12`=48,
  `space-16`=64.
- Content max-width for reading surfaces (Recap): ~760–880px. Do not stretch
  reading content full-bleed.
- Prefer separating sections with **spacing, typography, borders, and dividers**
  rather than wrapping each in a card.
- Do **not** treat EasyMail like an analytics dashboard. No widget grids, no
  metric-tile walls.

### Recap layout hierarchy (from `UX.md`, do not redesign the flow)

The Recap screen must have a clear reading hierarchy — important first,
secondary next, low-priority visually quieter:

1. **Needs you now** — most prominent: `text-h2` header, full-weight rows.
2. **Also matters** — clearly secondary: same structure, quieter, capped count.
3. **Safe to skip** — visually quiet: count / one-line, muted text.
4. **Cleanup when you have time** — quietest: count/flag only, `text-subtle`.

Prominence is achieved via size, weight, color, and spacing — not via colored
containers.

---

## 6. Radius, borders, shadows

### Radius

Restrained and consistent. No oversized rounded rectangles.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 4px | Inputs, small controls, badges |
| `--radius-md` | 6px | Buttons, menus, list rows (default) |
| `--radius-lg` | 8px | Cards, dialogs, sheets |
| `--radius-full` | 9999px | Only avatars and true toggles — not general controls |

Do not overuse pill (`--radius-full`) shapes for buttons/chips by default; a chip
may use `--radius-sm`/`md`.

### Borders

- Default separation is a **1px hairline** in `--border`. Borders are the primary
  way to separate content, preferred over shadows.
- Use `--border-strong` only when a hairline reads too weak.

### Shadows

Minimal and functional — signal elevation for genuinely floating layers only.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-sm` | `0 1px 2px rgba(28,25,23,0.06)` | Subtle lift (rarely; prefer border) |
| `--shadow-md` | `0 4px 12px rgba(28,25,23,0.08)` | Dropdowns, popovers, menus |
| `--shadow-lg` | `0 12px 32px rgba(28,25,23,0.12)` | Dialogs, sheets/drawers |

No glows, no colored shadows, no shadow-as-decoration on static content.

---

## 7. Icons

- **One icon library: Lucide.** (`lucide-react`.) One consistent set across the
  entire app.
- Default size 16px or 20px; stroke width 1.75–2 (match Lucide default).
- Icons inherit `currentColor` and take `--text-muted` unless interactive.
- **No emojis as functional/navigation icons**, ever.
- If a needed icon does not exist in Lucide, see §10 (mark `ASSET_REQUIRED`);
  do not improvise with emoji or a second icon set.

---

## 8. Component strategy & sources

**shadcn/ui is the primary component foundation** and provides most primitives:
buttons, dialogs, dropdowns, inputs, sheets, tabs, tooltips, menus, skeletons,
tables, popovers, toasts, etc. Built on Radix + Tailwind, so it inherits the
tokens above cleanly.

### Approved sources

| Source | Role |
| --- | --- |
| **shadcn/ui** | Default foundation for all primitives. |
| **Aceternity UI** | Selective, restyled — occasional marketing/landing moment only. |
| **Magic UI** | Selective, restyled — subtle microinteraction/effect only. |
| **Uiverse** | Selective, restyled — reference/snippet, never dropped in as-is. |
| Other reputable React/Tailwind sources | Only when justified and restyled. |

### Rules

- shadcn provides the default visual language; Aceternity/Magic UI/Uiverse are
  **not** the default look and are used selectively.
- Do **not** combine components from different sources without restyling them
  into the single EasyMail design system (tokens in this file).
- Never drop a component in unchanged just because it looks impressive.
- Every component must serve the user flow in `UX.md`.
- Prefer subtle microinteractions over decorative animation.
- No component may introduce off-system colors, radii, shadows, fonts, or icon
  sets. Restyle to tokens first.

### Interaction states (define once, apply everywhere)

Every interactive element must define: default, hover, active/pressed, focus
(visible focus ring using `--primary`), disabled, and loading. Focus states must
be visible and consistent (keyboard accessibility).

---

## 9. Motion

Motion explains state changes or improves interaction — it is never decoration.

### Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 120ms | Hover/press feedback, small toggles |
| `--motion-base` | 200ms | Expand/collapse, tab/content change |
| `--motion-slow` | 280ms | Dialog/sheet/drawer enter/exit |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default easing |

Respect `prefers-reduced-motion`: reduce or disable non-essential motion.

### Allowed

- Subtle hover feedback.
- Expand/collapse (recap sections, item detail).
- Loading transitions / skeletons.
- Drawer/dialog/sheet transitions.
- Classification-correction confirmation feedback.

### Prohibited

- Perpetual/looping animations.
- Glowing elements.
- Floating blobs.
- Animated gradient backgrounds.
- Any animation whose only purpose is to look "AI-powered."

---

## 10. Images & custom visual assets (`ASSET_REQUIRED`)

Do **not** generate placeholder AI artwork inside Cursor.

If EasyMail needs any of the following, mark it in code/docs as
`ASSET_REQUIRED` with a short description of what is needed, and leave a neutral
placeholder (e.g. empty state built from type + Lucide icon):

- Illustrations
- Custom hero artwork
- Product imagery
- Branded graphics (logo, wordmark)
- Icons not available in Lucide

The product owner creates these separately (ChatGPT, Gemini, Higgsfield, or
other tools) and provides final files. Track outstanding items in a running list:

| ID | Where used | Description | Status |
| --- | --- | --- | --- |
| _ASSET-001_ | Landing hero | (to be defined when landing is built) | Open |

Add rows as real needs arise; do not pre-generate.

---

## 11. Reference vs. copying

Component sites are **inspiration and implementation resources, not designs to
copy wholesale.** EasyMail has one coherent visual identity defined by this file.
Anything borrowed must be re-expressed in EasyMail tokens and must earn its place
in a real user flow.

---

## 12. Pre-Phase-9 gate

- `DESIGN_SYSTEM.md` exists and defines: visual principles, typography, colors,
  spacing, radius, borders/shadows, icon system, component-source rules, motion
  rules, and prohibited vibe-coded patterns. ✅ (this document)
- **Do not redesign Phase 5 UX flows** (`UX.md`). This document governs look and
  feel only.
- **Do not begin substantial frontend styling** until this design system is
  documented **and approved** by the product owner.
- Foundation implications for Phase 8/9 (setup + shared UI primitives):
  - Add Tailwind theme tokens mapping to the variables above.
  - Install and configure shadcn/ui to consume these tokens.
  - Wire `next/font` for Geist Sans (+ Geist Mono where needed).
  - Add `lucide-react` as the single icon set.
  These are foundation tasks, executed in their proper phase — not now.

---

## Change log

- 2026-09-10 — Initial draft created before Phase 9 per product-owner UI/design
  constraints (DEC-011). Awaiting approval.
