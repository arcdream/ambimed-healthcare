alter table public.doctors add column if not exists hospital_association text null;

comment on column public.doctors.hospital_association is 'Hospital / practice association text shown in Referral hub for doctors.';
