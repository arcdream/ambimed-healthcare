-- doctor_id is uuid (auth user id). Do not compare to public.doctors.id when that id is serial.
drop policy if exists "referrals_select_own_as_doctor" on public.referrals;
create policy "referrals_select_own_as_doctor"
  on public.referrals
  for select
  to authenticated
  using (doctor_id = auth.uid());
