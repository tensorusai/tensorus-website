import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function validateServerEnvironmentVariables() {
  const missing = []
  
  if (!supabaseUrl) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!supabaseAnonKey) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}. ` +
      'Please check your .env.local file and ensure all Supabase environment variables are set.'
    )
  }
}

function validateServiceRoleKey() {
  if (!supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This is required for admin operations that bypass Row Level Security.'
    )
  }
}

// Standard client for authenticated operations
export const createServerClient = () => {
  validateServerEnvironmentVariables()
  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!)
}

// Route client for API routes - same as server client for now
export const createRouteClient = () => {
  validateServerEnvironmentVariables()
  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!)
}

// Service role client for admin operations (bypasses RLS)
export const createServiceClient = () => {
  validateServerEnvironmentVariables()
  validateServiceRoleKey()
  return createSupabaseClient<Database>(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
