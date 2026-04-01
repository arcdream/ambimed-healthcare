import { supabase } from '../lib/supabase'

/**
 * Doctors are identified by auth user id in public.doctors.doctor_uid.
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
}
