import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabaseConfigured = Boolean(url && anon)

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anon || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  },
)
