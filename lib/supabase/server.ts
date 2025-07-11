import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Standard client for authenticated operations
export const createServerClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Route client for API routes - same as server client for now
export const createRouteClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Service role client for admin operations (bypasses RLS)
export const createServiceClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
