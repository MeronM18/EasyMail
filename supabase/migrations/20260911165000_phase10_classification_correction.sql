-- Phase 10: atomic, owner-scoped classification correction.
-- The model suggestion remains intact; only effective_intent becomes user-owned.

create or replace function public.correct_message_classification(
  p_message_id uuid,
  p_to_intent text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  current_intent text;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if p_to_intent not in (
    'needs_reply',
    'needs_action',
    'matters',
    'can_ignore',
    'cleanup_candidate'
  ) then
    raise exception 'invalid classification intent' using errcode = '22023';
  end if;

  select effective_intent
  into current_intent
  from public.message_classifications
  where message_id = p_message_id
    and user_id = current_user_id
  for update;

  if not found then
    raise exception 'message classification not found' using errcode = 'P0002';
  end if;

  if current_intent = p_to_intent then
    return;
  end if;

  insert into public.classification_corrections (
    user_id,
    message_id,
    from_intent,
    to_intent
  ) values (
    current_user_id,
    p_message_id,
    current_intent,
    p_to_intent
  );

  update public.message_classifications
  set effective_intent = p_to_intent,
      is_user_override = true,
      updated_at = now()
  where message_id = p_message_id
    and user_id = current_user_id;
end;
$$;

revoke all on function public.correct_message_classification(uuid, text) from public, anon;
grant execute on function public.correct_message_classification(uuid, text) to authenticated;

-- Sync/classification workers use service_role. Product users correct through the
-- function above so the current value and audit event cannot diverge.
revoke insert, update, delete on table public.message_classifications from authenticated;
revoke insert, update, delete on table public.classification_corrections from authenticated;
