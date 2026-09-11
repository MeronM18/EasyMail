# Testing

> Phase 8 test harness. Expand coverage in Phase 13.

## Commands

| Command | What it runs |
| --- | --- |
| `npm test` | Unit tests only (always safe in CI) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:rls` | Cross-user RLS isolation tests (needs local Supabase) |
| `npm run verify:phase9` | Live auth/session and ownership system check (needs local Supabase, Mailpit, and the production app server) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Next.js production build |

## Unit tests

Located in `tests/unit/`.

These are pure / schema smoke tests (for example env Zod parsing). They do **not** require Docker, Supabase, or secrets.

Phase 9 unit coverage also verifies safe auth redirects, controlled auth-error mapping, credential validation, and safe application-error normalization.

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
5. Owners can correct their own classification through the atomic RPC.
6. User A cannot correct User B's classification.
7. Authenticated clients cannot bypass correction auditing with direct table updates.
8. A successful default Recap visit advances one refresh-stable window atomically and duplicate calls are no-ops.

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

## Phase 9 live system verifier

`scripts/verify-phase9.mjs` is retained as permanent manual integration coverage. It complements the focused RLS suite by checking live Supabase signup/sign-in, automatic profile creation, recovery-email delivery through Mailpit, SSR session cookies, authenticated access to the production `/app` route, owner access, cross-user and anonymous isolation, and service-role-only secret isolation. It creates disposable users and removes them in a `finally` block.

Run it only after the local Supabase stack, migrated database, and EasyMail production server are running. Export the local Supabase URL, anon key, service-role key, app URL, and Mailpit URL, then run:

```bash
npm run verify:phase9
```

## Phase 10 local review fixture

`scripts/seed-phase10-demo.mjs` creates a deterministic, local-only Recap dataset for an existing local auth user. It refuses non-local Supabase hosts, creates no provider credentials or secret rows, and marks every fixture account/message with a `phase10-demo-` provider identifier. If the local stack has multiple users, set `DEMO_USER_EMAIL` before running it.

```bash
npm run seed:phase10-demo
```

The fixture covers all five intents, both providers, partial target-account setup, realistic message density, and one pending-classification state. It is development data only and is not a provider-sync substitute.

### CI note

`.github/workflows/ci.yml` runs lint, typecheck, unit tests, and build. The RLS job is present but disabled (`if: false`) until a Docker-capable runner is configured. Enable it when local Supabase can run in CI.

## Environments

| Environment | Purpose |
| --- | --- |
| Local | `next dev` + `supabase start` |
| Staging | Separate Vercel + Supabase project (Phase 9+) |
| Production | Separate Vercel + Supabase project |

Never reuse production OAuth clients or encryption keys in local/CI.

## Phase 9 verification status

- Passed on 2026-09-11: format check, lint, typecheck, 11 unit tests, and Next.js 16.3.4 production build with the local Supabase environment.
- Passed against local preview: `/`, `/sign-in`, and `/api/health` return 200; unauthenticated `/app` redirects to sign-in.
- Visually checked: landing and authentication at desktop width; landing at 390px mobile width.
- Passed against the reset local Supabase stack: live signup/sign-in, profile trigger, recovery email, SSR session cookie, protected route, logout/guard/re-login form flow, owner access, cross-user isolation, anonymous isolation, and secret-table isolation.
- Passed with `RUN_RLS_TESTS=1`: all four dedicated RLS tests ran with no skips.

## Phase 10 checkpoint verification status

- Passed on 2026-09-11: format check, lint, typecheck, 17 unit tests, and Next.js 16.3.4 production build.
- Passed against local Supabase with `RUN_RLS_TESTS=1`: all 8 RLS tests ran with no skips, including owner correction, cross-user denial, direct-write denial, and recap-visit idempotence.
- Local review fixture seeded successfully: 9 classified messages plus 1 pending message, with no provider credentials or secret rows.
- Final authenticated browser verification covers the rendered Recap, keyboard-visible rounded brand focus, all five full correction-select labels at a measured width of at least 220px, real server-action correction plus one audit row, refresh-stable visit behavior inside 30 minutes, rollover after expiry, and no visit advancement from triage, detail/correction, settings, or alternate Recap windows.
- A runtime regression found during this verification was fixed: the `"use server"` classification module now exports only its async action; client initial state lives in the client component.
