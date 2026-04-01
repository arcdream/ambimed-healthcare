import { supabase } from '../lib/supabase'

export type ReferralRow = {
  id: number
  created_at: string
  doctor_id: string | null
  facility_id: string | null
  referral_amount: number
  referral_date: string
  is_settled: boolean
  settlement_date: string | null
  referred_name: string | null
}

export type DoctorReferralStats = {
  totalCount: number
  settledCount: number
  pendingCount: number
  totalEarnedSettled: number
  totalPendingAmount: number
  referrals: ReferralRow[]
}

export const referralService = {
  async fetchForDoctor(doctorUserId: string): Promise<DoctorReferralStats> {
    const { data, error } = await supabase
      .from('referrals')
      .select(
        'id, created_at, doctor_id, facility_id, referral_amount, referral_date, is_settled, settlement_date, referred_name',
      )
      .eq('doctor_id', doctorUserId)
      .order('referral_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('referrals fetch:', error)
      return {
        totalCount: 0,
        settledCount: 0,
        pendingCount: 0,
        totalEarnedSettled: 0,
        totalPendingAmount: 0,
        referrals: [],
      }
    }

    const rows = (data ?? []) as ReferralRow[]
    let settledCount = 0
    let pendingCount = 0
    let totalEarnedSettled = 0
    let totalPendingAmount = 0

    for (const r of rows) {
      if (r.is_settled) {
        settledCount += 1
        totalEarnedSettled += Number(r.referral_amount) || 0
      } else {
        pendingCount += 1
        totalPendingAmount += Number(r.referral_amount) || 0
      }
    }

    return {
      totalCount: rows.length,
      settledCount,
      pendingCount,
      totalEarnedSettled,
      totalPendingAmount,
      referrals: rows,
    }
  },
}
