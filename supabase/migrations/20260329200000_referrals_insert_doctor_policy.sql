-- Registered doctors may insert referral rows only for themselves (doctor_id = auth.uid()).
drop policy if exists "referrals_insert_as_own_doctor" on public.referrals;
create policy "referrals_insert_as_own_doctor"
  on public.referrals
  for insert
  to authenticated
  with check (
    doctor_id = auth.uid()
    and exists (
      select 1
      from public.doctors d
      where d.doctor_uid = auth.uid()
    )
  );
