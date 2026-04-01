-- Corporate users: allow reading referrals where facility_id matches a facility from user_organizations.
drop policy if exists "referrals_select_own_as_doctor" on public.referrals;
drop policy if exists "referrals_select_for_user" on public.referrals;

create policy "referrals_select_for_user"
  on public.referrals
  for select
  to authenticated
  using (
    doctor_id = auth.uid()
    or (
      facility_id is not null
      and facility_id in (
        select uo.facility_id
        from public.user_organizations uo
        where uo.user_id = auth.uid()
          and uo.facility_id is not null
      )
    )
  );
