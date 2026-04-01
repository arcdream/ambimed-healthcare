import { supabase } from '../lib/supabase'

const PROFILE_PICS_BUCKET = 'profile_pics'

export function getProfileImagePublicUrl(storagePath: string | null): string | null {
  if (!storagePath?.trim()) return null
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }
  const { data } = supabase.storage.from(PROFILE_PICS_BUCKET).getPublicUrl(storagePath)
  return data?.publicUrl ?? null
}

type ProfileFromDB = {
  user_id: string
  role: 'client' | 'worker' | 'admin' | 'doctor'
  first_name: string | null
  last_name: string | null
  email: string | null
  profile_pic_url: string | null
}

export const profileService = {
  async fetchProfile(userId: string): Promise<ProfileFromDB | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, role, first_name, last_name, email, profile_pic_url')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Error fetching profile:', error)
      return null
    }
    return data as ProfileFromDB
  },
}
