-- Fix "new row violates row-level security policy" on inserts: policy + privileges.
-- Run this if older migrations were never applied to your project.

drop policy if exists "referrals_insert_as_own_doctor" on public.referrals;

create policy "referrals_insert_as_own_doctor"
  on public.referrals
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and doctor_id = auth.uid()
  );

grant insert on table public.referrals to authenticated;
