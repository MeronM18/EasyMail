-- Phase 10: record successful recap visits without collapsing the active view on refresh.

alter table public.profiles
  add column recap_session_started_at timestamptz,
  add column recap_window_start_at timestamptz;

create or replace function public.record_recap_visit(
  p_previous_visit_at timestamptz,
  p_window_start_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  affected_rows integer;
  visited_at timestamptz := now();
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if p_window_start_at is null or p_window_start_at > visited_at then
    raise exception 'invalid recap window start' using errcode = '22023';
  end if;

  update public.profiles
  set last_recap_visit_at = visited_at,
      recap_session_started_at = visited_at,
      recap_window_start_at = p_window_start_at
  where id = current_user_id
    and last_recap_visit_at is not distinct from p_previous_visit_at
    and (
      recap_session_started_at is null
      or recap_session_started_at < visited_at - interval '30 minutes'
    );

  get diagnostics affected_rows = row_count;
  return affected_rows = 1;
end;
$$;

revoke all on function public.record_recap_visit(timestamptz, timestamptz)
  from public, anon;
grant execute on function public.record_recap_visit(timestamptz, timestamptz)
  to authenticated;
