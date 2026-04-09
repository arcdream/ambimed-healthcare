-- Fix: older policy compared doctor_id (uuid) to public.doctors.id (often serial). Re-apply safe policy.
drop policy if exists "referrals_select_own_as_doctor" on public.referrals;
create policy "referrals_select_own_as_doctor"
  on public.referrals
  for select
  to authenticated
  using (doctor_id = auth.uid());
