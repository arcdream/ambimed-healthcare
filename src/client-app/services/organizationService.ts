import { supabase } from '../lib/supabase'

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
}
