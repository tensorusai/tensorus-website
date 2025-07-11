import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

function validateEnvironmentVariables() {
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
  
  // Validate URL format
  try {
    new URL(supabaseUrl!)
  } catch (error) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not a valid URL')
  }
  
  // Basic validation for anon key format (should be a JWT)
  if (!supabaseAnonKey!.startsWith('eyJ')) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY does not appear to be a valid JWT token')
  }
}

export const createClient = () => {
  validateEnvironmentVariables()
  
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!)
  }
  return supabaseInstance
}
