import { createClient } from './client'
import type { User } from './auth'

export async function ensureProfileExists(): Promise<User | null> {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (fetchError) {
      console.error('Error checking profile:', fetchError)
      return null
    }

    if (profile) {
      return profile
    }

    // Profile doesn't exist, create it
    console.log('Profile not found, creating profile for user:', user.id)
    
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating profile:', insertError)
      // Return a fallback user object even if we can't insert
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar_url: null,
        plan: 'free' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    console.log('Profile created successfully:', newProfile)
    return newProfile

  } catch (error) {
    console.error('Error in ensureProfileExists:', error)
    return null
  }
}