import { supabase } from '../lib/supabase'
import { doctorService } from './doctorService'
import { organizationService } from './organizationService'

/** Matches `public.referral_status` enum (`referral_received`, `referral_booked`). */
export type ReferralStatusCode = 'referral_received' | 'referral_booked'

export type ReferralRow = {
  id: number
  created_at: string
  doctor_id: string | null
  facility_id: string | null
  /** From `facilities.facility_name` when resolved (UI). */
  facility_name: string | null
  referral_amount: number
  referral_date: string
  is_settled: boolean
  settlement_date: string | null
  referral_status: ReferralStatusCode | null
}

export type DoctorReferralStats = {
  totalCount: number
  settledCount: number
  pendingCount: number
  totalEarnedSettled: number
  totalPendingAmount: number
  referrals: ReferralRow[]
}

export type ReferralHubRoles = {
  isDoctor: boolean
  isCorporateUser: boolean
}

const SELECT_COLUMNS =
  'id, created_at, doctor_id, facility_id, referral_amount, referral_date, is_settled, settlement_date, referral_status'

/** Hub filter: all rows, or only rows matching `referrals.referral_status`. */
export type ReferralStatusFilter = 'all' | ReferralStatusCode

export function filterReferralsByStatus(
  rows: ReferralRow[],
  filter: ReferralStatusFilter,
): ReferralRow[] {
  if (filter === 'all') return rows
  return rows.filter((r) => r.referral_status === filter)
}

export function buildStatsFromReferrals(rows: ReferralRow[]): DoctorReferralStats {
  return aggregateStats(rows)
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

function aggregateStats(rows: ReferralRow[]): DoctorReferralStats {
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
}

function mergeDedupeSort(rows: ReferralRow[]): ReferralRow[] {
  const byId = new Map<number, ReferralRow>()
  for (const r of rows) {
    byId.set(r.id, r)
  }
  return Array.from(byId.values()).sort((a, b) => {
    const da = new Date(a.referral_date).getTime()
    const db = new Date(b.referral_date).getTime()
    if (db !== da) return db - da
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

/** Loads `facilities.facility_name` for distinct `facility_id` values on referral rows. */
async function attachFacilityNames(rows: ReferralRow[]): Promise<ReferralRow[]> {
  const ids = [...new Set(rows.map((r) => r.facility_id).filter(Boolean) as string[])]
  if (ids.length === 0) {
    return rows.map((r) => ({ ...r, facility_name: null }))
  }

  const { data, error } = await supabase.from('facilities').select('id, facility_name').in('id', ids)

  if (error) {
    console.error('facilities facility_name for referrals:', error)
    return rows.map((r) => ({ ...r, facility_name: null }))
  }

  const nameById = new Map<string, string>()
  for (const f of data ?? []) {
    const row = f as { id: string; facility_name: string }
    nameById.set(row.id, row.facility_name?.trim() || '')
  }

  return rows.map((r) => ({
    ...r,
    facility_name: r.facility_id ? nameById.get(r.facility_id) || null : null,
  }))
}

export const referralService = {
  /**
   * Doctor path: `referrals.doctor_id` = auth uid (and uuid `doctors.id` when applicable).
   * Corporate path: `referrals.facility_id` in facility ids from `user_organizations` for this user.
   * When both apply, results are merged and deduped by `referrals.id`.
   */
  async fetchReferralDashboard(
    authUserId: string,
    roles: ReferralHubRoles,
  ): Promise<{ stats: DoctorReferralStats; fetchError?: string }> {
    const collected: ReferralRow[] = []
    const errors: string[] = []

    if (roles.isDoctor) {
      const doctorRowId = await doctorService.fetchDoctorRowIdForAuthUid(authUserId)
      const candidateIds = [authUserId]
      if (doctorRowId && isUuidLike(doctorRowId) && doctorRowId !== authUserId) {
        candidateIds.push(doctorRowId)
      }

      const { data, error } = await supabase
        .from('referrals')
        .select(SELECT_COLUMNS)
        .in('doctor_id', candidateIds)
        .order('referral_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('referrals fetch (doctor_id):', error)
        errors.push(error.message)
      } else {
        collected.push(
          ...((data ?? []) as Omit<ReferralRow, 'facility_name'>[]).map((r) => ({
            ...r,
            facility_name: null as string | null,
          })),
        )
      }
    }

    if (roles.isCorporateUser) {
      const facilityIds = await organizationService.getFacilityIdsForUser(authUserId)
      if (facilityIds.length > 0) {
        const { data, error } = await supabase
          .from('referrals')
          .select(SELECT_COLUMNS)
          .in('facility_id', facilityIds)
          .order('referral_date', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) {
          console.error('referrals fetch (facility_id):', error)
          errors.push(error.message)
        } else {
          collected.push(
            ...((data ?? []) as Omit<ReferralRow, 'facility_name'>[]).map((r) => ({
              ...r,
              facility_name: null as string | null,
            })),
          )
        }
      }
    }

    if (!roles.isDoctor && !roles.isCorporateUser) {
      return { stats: emptyStats() }
    }

    const merged = mergeDedupeSort(collected)
    const withFacilityNames = await attachFacilityNames(merged)
    const stats = aggregateStats(withFacilityNames)

    if (merged.length === 0 && errors.length > 0) {
      return { stats: emptyStats(), fetchError: errors.join(' ') }
    }

    return { stats }
  },

  /**
   * Resolves doctor vs corporate from the database (works even if session `User` flags are stale).
   */
  async fetchReferralDashboardForUser(authUserId: string): Promise<{ stats: DoctorReferralStats; fetchError?: string }> {
    const [isDoctor, isCorporateUser] = await Promise.all([
      doctorService.isDoctorUid(authUserId),
      organizationService.isCorporateUser(authUserId),
    ])
    return this.fetchReferralDashboard(authUserId, { isDoctor, isCorporateUser })
  },

  /** @deprecated use fetchReferralDashboardForUser */
  async fetchForDoctor(authUserId: string): Promise<{ stats: DoctorReferralStats; fetchError?: string }> {
    return this.fetchReferralDashboardForUser(authUserId)
  },
}
