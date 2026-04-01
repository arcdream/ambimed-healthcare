-- Allow users to see their own organization membership (needed for corporate / referral hub access checks).
alter table if exists public.user_organizations enable row level security;

drop policy if exists "user_organizations_select_own" on public.user_organizations;
create policy "user_organizations_select_own"
  on public.user_organizations
  for select
  to authenticated
  using (user_id = auth.uid());
