create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('learner', 'admin');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked');
create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  role public.app_role not null default 'learner',
  cefr_goal public.cefr_level not null default 'B1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null unique,
  status public.invitation_status not null default 'pending',
  created_by uuid references auth.users (id) on delete set null,
  accepted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table public.learning_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  unit_id text not null,
  status text not null default 'not_started',
  accuracy numeric,
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.learning_progress enable row level security;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create policy "profiles select own or admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.current_user_role() = 'admin'
);

create policy "profiles update own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = public.current_user_role()
);

create policy "invitations admin all"
on public.invitations
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "learning_progress own all"
on public.learning_progress
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pending_invitation_id uuid;
begin
  if new.email is null then
    raise exception 'Sign-up requires an invited email address.';
  end if;

  select id
  into pending_invitation_id
  from public.invitations
  where email = lower(new.email)
    and status = 'pending'
  limit 1;

  if pending_invitation_id is null then
    raise exception 'Email address is not invited.';
  end if;

  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name')
  );

  update public.invitations
  set
    status = 'accepted',
    accepted_by = new.id,
    accepted_at = now()
  where id = pending_invitation_id
    and status = 'pending';

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
