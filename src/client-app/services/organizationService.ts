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
}
