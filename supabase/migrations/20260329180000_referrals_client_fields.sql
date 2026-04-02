alter table public.referrals add column if not exists client_name text null;
alter table public.referrals add column if not exists client_phone_number text null;

comment on column public.referrals.client_name is 'Referred client display name';
comment on column public.referrals.client_phone_number is 'Referred client phone (as stored for display / tel links)';
