-- EasyMail initial schema (Phase 8)
-- Source of truth: SCHEMA.md / SECURITY.md / DEC-009

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  last_recap_visit_at timestamptz,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Signup trigger: create profile row on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- SECURITY DEFINER helper: not a public RPC endpoint
revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to postgres, service_role;

-- ---------------------------------------------------------------------------
-- mail_accounts
-- ---------------------------------------------------------------------------

create table public.mail_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null check (provider in ('google', 'microsoft')),
  provider_account_id text not null,
  email_address text not null,
  nickname text,
  scopes_granted text[] not null default '{}',
  status text not null check (
    status in ('active', 'needs_reconnect', 'sync_error', 'disconnected')
  ),
  status_message text,
  sync_cursor jsonb,
  last_synced_at timestamptz,
  last_sync_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, provider_account_id),
  unique (user_id, provider, email_address)
);

create index mail_accounts_user_id_idx on public.mail_accounts (user_id);
create index mail_accounts_user_status_idx on public.mail_accounts (user_id, status);
create index mail_accounts_last_synced_at_idx on public.mail_accounts (last_synced_at);

create trigger mail_accounts_set_updated_at
before update on public.mail_accounts
for each row execute function public.set_updated_at();

alter table public.mail_accounts enable row level security;

create policy "mail_accounts_select_own"
on public.mail_accounts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "mail_accounts_insert_own"
on public.mail_accounts for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "mail_accounts_update_own"
on public.mail_accounts for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "mail_accounts_delete_own"
on public.mail_accounts for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- mail_account_secrets (service role only — no grants to anon/authenticated)
-- ---------------------------------------------------------------------------

create table public.mail_account_secrets (
  mail_account_id uuid primary key references public.mail_accounts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  refresh_token_ciphertext bytea,
  access_token_ciphertext bytea,
  access_token_expires_at timestamptz,
  token_payload_version int not null default 1,
  updated_at timestamptz not null default now()
);

create trigger mail_account_secrets_set_updated_at
before update on public.mail_account_secrets
for each row execute function public.set_updated_at();

alter table public.mail_account_secrets enable row level security;

-- Intentionally no policies for anon/authenticated.
revoke all on table public.mail_account_secrets from anon, authenticated;
grant all on table public.mail_account_secrets to service_role;

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mail_account_id uuid not null references public.mail_accounts (id) on delete cascade,
  provider_message_id text not null,
  provider_thread_id text,
  received_at timestamptz not null,
  from_address text not null,
  from_name text,
  subject text not null default '',
  snippet text not null default '',
  body_text text,
  body_retained_until timestamptz,
  web_link text,
  is_handled boolean not null default false,
  classification_status text not null check (
    classification_status in ('pending', 'classified', 'failed', 'skipped')
  ),
  raw_internal_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mail_account_id, provider_message_id)
);

create index messages_user_received_at_idx
  on public.messages (user_id, received_at desc);
create index messages_user_classification_status_idx
  on public.messages (user_id, classification_status);
create index messages_account_received_at_idx
  on public.messages (mail_account_id, received_at desc);
create index messages_user_handled_received_at_idx
  on public.messages (user_id, is_handled, received_at desc);

create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

alter table public.messages enable row level security;

create policy "messages_select_own"
on public.messages for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "messages_update_own"
on public.messages for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- INSERT/DELETE primarily via service role during sync; still allow owner delete.
create policy "messages_delete_own"
on public.messages for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- message_classifications
-- ---------------------------------------------------------------------------

create table public.message_classifications (
  message_id uuid primary key references public.messages (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  model_intent text not null check (
    model_intent in (
      'needs_reply',
      'needs_action',
      'matters',
      'can_ignore',
      'cleanup_candidate'
    )
  ),
  effective_intent text not null check (
    effective_intent in (
      'needs_reply',
      'needs_action',
      'matters',
      'can_ignore',
      'cleanup_candidate'
    )
  ),
  reason text,
  action_signal text,
  is_user_override boolean not null default false,
  model_id text,
  classified_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create trigger message_classifications_set_updated_at
before update on public.message_classifications
for each row execute function public.set_updated_at();

alter table public.message_classifications enable row level security;

create policy "message_classifications_select_own"
on public.message_classifications for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "message_classifications_insert_own"
on public.message_classifications for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "message_classifications_update_own"
on public.message_classifications for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "message_classifications_delete_own"
on public.message_classifications for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- classification_corrections (append-only for clients)
-- ---------------------------------------------------------------------------

create table public.classification_corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  message_id uuid not null references public.messages (id) on delete cascade,
  from_intent text not null check (
    from_intent in (
      'needs_reply',
      'needs_action',
      'matters',
      'can_ignore',
      'cleanup_candidate'
    )
  ),
  to_intent text not null check (
    to_intent in (
      'needs_reply',
      'needs_action',
      'matters',
      'can_ignore',
      'cleanup_candidate'
    )
  ),
  created_at timestamptz not null default now()
);

alter table public.classification_corrections enable row level security;

create policy "classification_corrections_select_own"
on public.classification_corrections for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "classification_corrections_insert_own"
on public.classification_corrections for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- No UPDATE/DELETE policies for authenticated (immutable audit log).

-- ---------------------------------------------------------------------------
-- sync_runs
-- ---------------------------------------------------------------------------

create table public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mail_account_id uuid not null references public.mail_accounts (id) on delete cascade,
  "trigger" text not null check ("trigger" in ('onboarding', 'cron', 'manual')),
  status text not null check (
    status in ('queued', 'running', 'succeeded', 'failed', 'partial')
  ),
  stats jsonb,
  error_summary text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- At most one queued|running sync per mail account
create unique index sync_runs_one_active_per_account_idx
  on public.sync_runs (mail_account_id)
  where status in ('queued', 'running');

alter table public.sync_runs enable row level security;

create policy "sync_runs_select_own"
on public.sync_runs for select
to authenticated
using ((select auth.uid()) = user_id);

-- Writes via service role primarily; no authenticated insert/update/delete.

-- ---------------------------------------------------------------------------
-- oauth_states (service role only)
-- ---------------------------------------------------------------------------

create table public.oauth_states (
  state text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null check (provider in ('google', 'microsoft')),
  code_verifier text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.oauth_states enable row level security;

-- Intentionally no policies for anon/authenticated.
revoke all on table public.oauth_states from anon, authenticated;
grant all on table public.oauth_states to service_role;

-- Ensure classification.user_id always matches parent message owner
create or replace function public.enforce_classification_user_match()
returns trigger
language plpgsql
as $$
declare
  msg_user uuid;
begin
  select user_id into msg_user from public.messages where id = new.message_id;
  if msg_user is null then
    raise exception 'message % not found', new.message_id;
  end if;
  if new.user_id is distinct from msg_user then
    raise exception 'message_classifications.user_id must match messages.user_id';
  end if;
  return new;
end;
$$;

create trigger message_classifications_user_match
before insert or update on public.message_classifications
for each row execute function public.enforce_classification_user_match();
