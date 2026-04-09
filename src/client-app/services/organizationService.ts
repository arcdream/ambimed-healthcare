import { supabase } from '../lib/supabase'

export type MembershipDisplay = {
  membershipId: string
  role: string | null
  organization: { id: string; name: string }
  facility: { id: string; name: string } | null
}

export const organizationService = {
  /** True when the user is linked to an organization (corporate account). */
  async isCorporateUser(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('user_id', userId)
      .limit(1)

    if (error) {
      console.error('user_organizations lookup:', error)
      return false
    }
    return (data?.length ?? 0) > 0
  },

  /** Distinct non-null `facility_id` values for this user (corporate referral scope). */
  async getFacilityIdsForUser(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_organizations')
      .select('facility_id')
      .eq('user_id', userId)

    if (error) {
      console.error('user_organizations facility_ids:', error)
      return []
    }
    const ids = [
      ...new Set(
        (data ?? [])
          .map((r) => r.facility_id)
          .filter((id): id is string => id != null && String(id).length > 0),
      ),
    ]
    return ids
  },

  /**
   * Organizations and facilities linked to the user (for Referral hub header).
   * Uses `organization_name` and `facility_name` from your schema.
   */
  async getMembershipsForDisplay(userId: string): Promise<MembershipDisplay[]> {
    const { data: rows, error } = await supabase
      .from('user_organizations')
      .select('id, role, organization_id, facility_id')
      .eq('user_id', userId)

    if (error) {
      console.error('user_organizations memberships:', error)
      return []
    }
    if (!rows?.length) return []

    const orgIds = [...new Set(rows.map((r) => r.organization_id).filter(Boolean) as string[])]
    const facilityIds = [
      ...new Set(rows.map((r) => r.facility_id).filter(Boolean) as string[]),
    ]

    const orgsRes = orgIds.length
      ? await supabase.from('organizations').select('id, organization_name').in('id', orgIds)
      : { data: [] as { id: string; organization_name: string }[], error: null }
    const facRes = facilityIds.length
      ? await supabase.from('facilities').select('id, facility_name').in('id', facilityIds)
      : { data: [] as { id: string; facility_name: string }[], error: null }

    if (orgsRes.error) console.error('organizations lookup:', orgsRes.error)
    if (facRes.error) console.error('facilities lookup:', facRes.error)

    const orgNameById = new Map<string, string>()
    for (const o of orgsRes.data ?? []) {
      orgNameById.set(o.id, (o.organization_name?.trim() || 'Organization').trim())
    }
    const facNameById = new Map<string, string>()
    for (const f of facRes.data ?? []) {
      facNameById.set(f.id, (f.facility_name?.trim() || 'Facility').trim())
    }

    return rows.map((r) => ({
      membershipId: r.id,
      role: r.role,
      organization: {
        id: r.organization_id,
        name: orgNameById.get(r.organization_id) ?? 'Organization',
      },
      facility: r.facility_id
        ? {
            id: r.facility_id,
            name: facNameById.get(r.facility_id) ?? 'Facility',
          }
        : null,
    }))
  },
}
