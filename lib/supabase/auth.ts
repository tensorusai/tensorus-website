import { createClient } from './client'
import { createRouteClient } from './server'
import { AuthErrorHandler } from './error-handler'
import { withSessionRetry } from './session-manager'
import type { Database } from './database.types'
import type { AuthResponse } from './error-handler'

export type User = Database['public']['Tables']['profiles']['Row']
export type { AuthResponse }

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
      // Validate inputs using standardized validation
      const validationError = AuthErrorHandler.validateSignupCredentials(email, password, name)
      if (validationError) {
        return AuthErrorHandler.createErrorResponse(validationError)
      }
      
      const supabase = createClient()

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
        return AuthErrorHandler.createErrorResponse(error)
      }

      if (data.user) {
        // Handle email confirmation requirement
        if (!data.session) {
          return { 
            success: true, 
            user: null,
            error: {
              code: 'EMAIL_CONFIRMATION_REQUIRED',
              message: 'Please check your email and click the confirmation link to activate your account.'
            }
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

        return AuthErrorHandler.createSuccessResponse(profile || {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          avatar_url: null,
          plan: 'free' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      return AuthErrorHandler.createErrorResponse(new Error('Registration failed. Please try again.'))
    } catch (error) {
      console.error('Signup error:', error)
      return AuthErrorHandler.createErrorResponse(error)
    }
  },

  async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate inputs using standardized validation
      const validationError = AuthErrorHandler.validateCredentials(email, password)
      if (validationError) {
        return AuthErrorHandler.createErrorResponse(validationError)
      }
      
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return AuthErrorHandler.createErrorResponse(error)
      }

      if (data.user) {
        // Get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
          return AuthErrorHandler.createErrorResponse(new Error('Failed to load user profile'))
        }

        if (!profile) {
          // Profile doesn't exist, create a fallback
          console.log('Profile not found, creating fallback user object')
          const fallbackUser = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            avatar_url: null,
            plan: 'free' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          return AuthErrorHandler.createSuccessResponse(fallbackUser)
        }

        return AuthErrorHandler.createSuccessResponse(profile)
      }

      return AuthErrorHandler.createErrorResponse(new Error('Sign in failed'))
    } catch (error) {
      return AuthErrorHandler.createErrorResponse(error)
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        const standardError = AuthErrorHandler.mapSupabaseError(error)
        return { success: false, error: standardError.message }
      }

      return { success: true }
    } catch (error) {
      const standardError = AuthErrorHandler.mapSupabaseError(error)
      return { success: false, error: standardError.message }
    }
  },

  getCurrentUser: withSessionRetry(async (): Promise<User | null> => {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Profile fetch error in getCurrentUser:', profileError)
        return null
      }

      if (!profile) {
        // Profile doesn't exist, create a fallback
        console.log('Profile not found in getCurrentUser, creating fallback')
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

      return profile
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      return null
    }
  }),

  updateProfile: withSessionRetry(async (updates: Partial<User>): Promise<AuthResponse> => {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return AuthErrorHandler.createErrorResponse(new Error('Not authenticated'))
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return AuthErrorHandler.createErrorResponse(error)
      }

      return AuthErrorHandler.createSuccessResponse(data)
    } catch (error) {
      return AuthErrorHandler.createErrorResponse(error)
    }
  }),

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        const standardError = AuthErrorHandler.mapSupabaseError({ message: 'Please enter a valid email address' })
        return { success: false, error: standardError.message }
      }
      
      const supabase = createClient()
      
      // Get base URL for callback - prefer environment variable for server-side consistency
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/callback?next=/auth/reset-password`,
      })

      if (error) {
        const standardError = AuthErrorHandler.mapSupabaseError(error)
        return { success: false, error: standardError.message }
      }

      return { success: true }
    } catch (error) {
      const standardError = AuthErrorHandler.mapSupabaseError(error)
      return { success: false, error: standardError.message }
    }
  },

  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate password
      const validationError = AuthErrorHandler.validateCredentials('dummy@email.com', password)
      if (validationError && validationError.code === 'WEAK_PASSWORD') {
        return { success: false, error: validationError.message }
      }
      
      console.log('Calling password update API...')
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()
      console.log('Password update API response:', data)
      
      return data
    } catch (error) {
      console.error('UpdatePassword fetch error:', error)
      const standardError = AuthErrorHandler.mapSupabaseError(error)
      return { success: false, error: standardError.message }
    }
  },

  async updatePasswordWithTokens(password: string, accessToken: string, refreshToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Calling password update API with tokens...')
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, accessToken, refreshToken }),
      })

      const data = await response.json()
      console.log('Password update API response:', data)
      
      return data
    } catch (error) {
      console.error('UpdatePasswordWithTokens fetch error:', error)
      return { success: false, error: 'Password update failed' }
    }
  },

  async setSession(accessToken: string, refreshToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Calling set session API...')
      const response = await fetch('/api/auth/set-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      })

      const data = await response.json()
      console.log('Set session API response:', data)
      
      return data
    } catch (error) {
      console.error('SetSession fetch error:', error)
      return { success: false, error: 'Failed to set session' }
    }
  }
}

// Server-side auth helper
export const serverAuthService = {
  getCurrentUser: withSessionRetry(async (): Promise<User | null> => {
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
  }),

  async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    return user
  }
}
