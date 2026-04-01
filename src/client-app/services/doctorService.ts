import { supabase } from '../lib/supabase'

/**
 * Doctors are identified by auth user id in public.doctors.doctor_uid.
 * referrals.doctor_id is uuid (typically auth uid / profiles.user_id). If doctors.id is a serial int, it must not be used as doctor_id.
 */
export const doctorService = {
  async isDoctorUid(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('doctors')
      .select('doctor_uid')
      .eq('doctor_uid', userId)
      .maybeSingle()

    if (error) {
      console.error('doctors lookup:', error)
      return false
    }
    return !!data
  },

  /**
   * Primary key on public.doctors — used when referrals.doctor_id points at doctors.id instead of auth uid.
   */
  async fetchDoctorRowIdForAuthUid(authUid: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('id')
      .eq('doctor_uid', authUid)
      .maybeSingle()

    if (error) {
      console.error('doctors id lookup:', error)
      return null
    }
    if (data?.id == null) return null
    return String(data.id)
  },
}
