# EasyMail

Cross-inbox attention layer for Gmail and Outlook — recap-first triage, not a mail client.

Process: follow `BUILD_FROM_ZERO.md`. Progress: `PROJECT_STATE.md`.

## Stack (DEC-008)

- Next.js App Router + TypeScript on Vercel
- Supabase Auth + Postgres (RLS)
- Vitest (unit + RLS isolation)
- Tailwind CSS

## Prerequisites

- Node.js 22+
- npm
- Docker (optional, required for local Supabase + RLS tests)

## Setup

```bash
npm install
cp .env.example .env.local
# Fill .env.local with local/dev values only — never commit secrets
```

### Local Supabase (optional but recommended)

```bash
npx supabase start
npx supabase status   # copy API URL, anon key, service role key into .env.local
npx supabase db reset # applies migrations in supabase/migrations
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js local server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier write |
| `npm test` | Unit tests |
| `npm run test:rls` | RLS cross-user isolation tests |
| `npm run supabase:start` | Start local Supabase |
| `npm run supabase:reset` | Reset DB + reapply migrations |

See `TESTING.md` for test details.

## Project docs

- `PROJECT.md` — product definition
- `MVP.md` — MVP scope
- `ARCHITECTURE.md` — system design
- `SCHEMA.md` — data model
- `SECURITY.md` — authz / secrets / retention
- `DECISIONS.md` — decision log
- `ROADMAP.md` — milestones

## Phase status

Phase 8 — Project Setup is the coding entry point. Do not implement auth UI, OAuth, sync, classify, or recap until Phase 9+.

## Secrets

- Real secrets live only in `.env.local` / Vercel env / Supabase dashboard.
- `.env*` is gitignored except `.env.example`.
- `mail_account_secrets` and `oauth_states` are service-role only (see migration + `SECURITY.md`).
