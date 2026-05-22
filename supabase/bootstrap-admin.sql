-- Bootstrap the first administrator without committing real credentials.
--
-- Usage:
-- 1. Replace the placeholder <ADMIN_EMAIL> locally with the first admin email.
-- 2. Run this SQL against the Supabase database.
-- 3. Have that email sign up so the auth trigger accepts the invitation.
-- 4. Run this SQL again to promote the accepted profile to admin.
--
-- Keep <ADMIN_EMAIL> as a placeholder in version control.

insert into public.invitations (email, status)
select lower('<ADMIN_EMAIL>'), 'pending'
where not exists (
  select 1
  from public.invitations
  where email = lower('<ADMIN_EMAIL>')
);

update public.profiles
set
  role = 'admin',
  updated_at = now()
where email = lower('<ADMIN_EMAIL>')
  and exists (
    select 1
    from public.invitations
    where invitations.email = lower('<ADMIN_EMAIL>')
      and invitations.status = 'accepted'
      and invitations.accepted_by = profiles.id
  );
