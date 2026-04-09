-- Any authenticated user may insert a referral row for themselves (referrer = auth.uid()).
drop policy if exists "referrals_insert_as_own_doctor" on public.referrals;
create policy "referrals_insert_as_own_doctor"
  on public.referrals
  for insert
  to authenticated
  with check (doctor_id = auth.uid());
