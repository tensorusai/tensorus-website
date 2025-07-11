import { createClient } from './client'
import { createRouteClient } from './server'
import type { Database } from './database.types'

export type User = Database['public']['Tables']['profiles']['Row']

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export const authService = {
  async signUp({ email, password, name }: SignupCredentials): Promise<AuthResponse> {
    try {
      const supabase = createClient()
      
      // Validate inputs
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' }
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      // Get base URL for callback - prefer environment variable for server-side consistency
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}/auth/callback?next=/dashboard`,
          data: {
            name,
          }
        }
      })

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'An account with this email already exists. Please sign in instead.' }
        }
        if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' }
        }
        if (error.message.includes('Password')) {
          return { success: false, error: 'Password must be at least 6 characters long.' }
        }
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Handle email confirmation requirement
        if (!data.session) {
          return { 
            success: true, 
            user: null,
            error: 'Please check your email and click the confirmation link to activate your account.'
          }
        }

        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Try to get the profile with better error handling
        let profile = null
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle() // Use maybeSingle to avoid errors if no row found
          
          if (profileData) {
            profile = profileData
          } else {
            // Create profile manually if trigger failed
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                name: name
              })
              .select()
              .single()
            
            if (createdProfile) {
              profile = createdProfile
            } else {
              console.error('Profile creation failed:', createError)
              // Continue without profile - user can complete setup later
            }
          }
        } catch (profileErr) {
          console.error('Profile fetch/create error:', profileErr)
          // Continue without profile - user can complete setup later
        }

        return { 
          success: true, 
          user: profile || {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            avatar_url: null,
            plan: 'free' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      }

      return { success: false, error: 'Registration failed. Please try again.' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'An unexpected error occurred. Please try again.' }
    }
  },

  async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          return { success: false, error: 'Profile fetch failed' }
        }

        return { success: true, user: profile }
      }

      return { success: false, error: 'Sign in failed' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Sign out failed' }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return profile
    } catch (error) {
      return null
    }
  },

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      // Get base URL for callback - prefer environment variable for server-side consistency
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/callback?next=/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Password reset failed' }
    }
  },

  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      // Check if user is authenticated first
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('Current user for password update:', user ? 'authenticated' : 'not authenticated', userError)
      
      if (!user) {
        return { success: false, error: 'User not authenticated. Please try the reset link again.' }
      }
      
      console.log('Updating password for user:', user.id)
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error('Supabase updateUser error:', error)
        return { success: false, error: error.message }
      }

      console.log('Password updated successfully')
      return { success: true }
    } catch (error) {
      console.error('UpdatePassword catch error:', error)
      return { success: false, error: 'Password update failed' }
    }
  },

  async setSession(accessToken: string, refreshToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      console.log('Setting session with tokens:', { 
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing'
      })
      
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        console.error('SetSession error:', error)
        return { success: false, error: error.message }
      }

      console.log('Session set successfully:', data.user ? 'user authenticated' : 'no user')
      return { success: true }
    } catch (error) {
      console.error('SetSession catch error:', error)
      return { success: false, error: 'Failed to set session' }
    }
  }
}

// Server-side auth helper
export const serverAuthService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = createRouteClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return profile
    } catch (error) {
      return null
    }
  },

  async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    return user
  }
}
