-- Client-submitted referrals: `user_id` = referring profile when not doctor/facility-scoped.
alter table public.referrals add column if not exists user_id uuid null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'referrals'
      and c.conname = 'referrals_user_id_fkey'
  ) then
    alter table public.referrals
      add constraint referrals_user_id_fkey
      foreign key (user_id) references profiles (user_id);
  end if;
end $$;

-- Read: own rows as doctor, facility, or client referrer.
drop policy if exists "referrals_select_for_user" on public.referrals;
create policy "referrals_select_for_user"
  on public.referrals
  for select
  to authenticated
  using (
    doctor_id = auth.uid()
    or user_id = auth.uid()
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

-- Insert: doctor-only row, client-only row (user_id), or facility row for org members.
drop policy if exists "referrals_insert_as_own_doctor" on public.referrals;
drop policy if exists "referrals_insert_authenticated" on public.referrals;

create policy "referrals_insert_authenticated"
  on public.referrals
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and (
      (
        doctor_id = auth.uid()
        and user_id is null
        and facility_id is null
      )
      or (
        user_id = auth.uid()
        and doctor_id is null
        and facility_id is null
      )
      or (
        doctor_id is null
        and user_id is null
        and facility_id is not null
        and facility_id in (
          select uo.facility_id
          from public.user_organizations uo
          where uo.user_id = auth.uid()
            and uo.facility_id is not null
        )
      )
    )
  );

grant insert on table public.referrals to authenticated;
