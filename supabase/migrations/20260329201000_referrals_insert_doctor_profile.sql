-- Allow inserts when the user is a doctor in `profiles` even if `public.doctors` has no row yet.
drop policy if exists "referrals_insert_as_own_doctor" on public.referrals;
create policy "referrals_insert_as_own_doctor"
  on public.referrals
  for insert
  to authenticated
  with check (
    doctor_id = auth.uid()
    and (
      exists (
        select 1
        from public.doctors d
        where d.doctor_uid = auth.uid()
      )
      or exists (
        select 1
        from public.profiles p
        where p.user_id = auth.uid()
          and lower(trim(p.role::text)) = 'doctor'
      )
    )
  );
