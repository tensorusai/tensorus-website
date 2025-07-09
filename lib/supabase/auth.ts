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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Get the created profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          return { success: false, error: 'Profile creation failed' }
        }

        return { success: true, user: profile }
      }

      return { success: false, error: 'User creation failed' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
      
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Password update failed' }
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
