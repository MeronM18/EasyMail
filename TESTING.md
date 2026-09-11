# Testing

> Phase 8 test harness. Expand coverage in Phase 13.

## Commands

| Command | What it runs |
| --- | --- |
| `npm test` | Unit tests only (always safe in CI) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:rls` | Cross-user RLS isolation tests (needs local Supabase) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Next.js production build |

## Unit tests

Located in `tests/unit/`.

These are pure / schema smoke tests (for example env Zod parsing). They do **not** require Docker, Supabase, or secrets.

```bash
npm test
```

## RLS cross-user isolation tests

Located in `tests/rls/cross-user-isolation.test.ts`.

These explicitly verify:

1. User A cannot `SELECT` User B `mail_accounts` / `messages`.
2. User A cannot `UPDATE` / `DELETE` User B rows.
3. Authenticated clients cannot read `mail_account_secrets`.
4. User A can still read their own `mail_accounts`.

### Prerequisites

1. Docker Desktop (or another Docker engine) available.
2. Local Supabase running with migrations applied:

```bash
npx supabase start
npx supabase db reset
```

3. Env vars from `npx supabase status` (or copy from `.env.example` after filling local keys):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional: `DATABASE_URL` for direct Postgres tooling.

### Run

```bash
# After supabase start + db reset, export keys then:
npm run test:rls
```

If Supabase URL / service role / anon key are missing, the suite is **skipped** (so default CI stays green without Docker). Set `RUN_RLS_TESTS=1` to force failure when env is incomplete.

### CI note

`.github/workflows/ci.yml` runs lint, typecheck, unit tests, and build. The RLS job is present but disabled (`if: false`) until a Docker-capable runner is configured. Enable it when local Supabase can run in CI.

## Environments

| Environment | Purpose |
| --- | --- |
| Local | `next dev` + `supabase start` |
| Staging | Separate Vercel + Supabase project (Phase 9+) |
| Production | Separate Vercel + Supabase project |

Never reuse production OAuth clients or encryption keys in local/CI.
