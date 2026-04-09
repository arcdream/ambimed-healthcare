-- Lifecycle stage for each referral row (separate from settlement / payment).
DO $$
BEGIN
  CREATE TYPE public.referral_status AS ENUM ('referral_received', 'referral_booked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS referral_status public.referral_status;

COMMENT ON COLUMN public.referrals.referral_status IS 'referral_received | referral_booked';
