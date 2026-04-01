import { supabase } from '../lib/supabase'
import { doctorService } from './doctorService'

export type ReferralRow = {
  id: number
  created_at: string
  doctor_id: string | null
  facility_id: string | null
  referral_amount: number
  referral_date: string
  is_settled: boolean
  settlement_date: string | null
}

export type DoctorReferralStats = {
  totalCount: number
  settledCount: number
  pendingCount: number
  totalEarnedSettled: number
  totalPendingAmount: number
  referrals: ReferralRow[]
}

/** referrals.doctor_id is uuid — never pass serial ints (e.g. "1") from public.doctors.id */
function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  )
}

function emptyStats(): DoctorReferralStats {
  return {
    totalCount: 0,
    settledCount: 0,
    pendingCount: 0,
    totalEarnedSettled: 0,
    totalPendingAmount: 0,
    referrals: [],
  }
}

export const referralService = {
  /**
   * Loads rows where referrals.doctor_id matches the signed-in doctor.
   * Filters by auth uid; if public.doctors.id is also a uuid, includes that too (not serial ints).
   */
  async fetchForDoctor(authUserId: string): Promise<{ stats: DoctorReferralStats; fetchError?: string }> {
    const doctorRowId = await doctorService.fetchDoctorRowIdForAuthUid(authUserId)
    const candidateIds = [authUserId]
    if (doctorRowId && isUuidLike(doctorRowId) && doctorRowId !== authUserId) {
      candidateIds.push(doctorRowId)
    }

    const { data, error } = await supabase
      .from('referrals')
      .select(
        'id, created_at, doctor_id, facility_id, referral_amount, referral_date, is_settled, settlement_date',
      )
      .in('doctor_id', candidateIds)
      .order('referral_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('referrals fetch:', error)
      return { stats: emptyStats(), fetchError: error.message }
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
      stats: {
        totalCount: rows.length,
        settledCount,
        pendingCount,
        totalEarnedSettled,
        totalPendingAmount,
        referrals: rows,
      },
    }
  },
}
