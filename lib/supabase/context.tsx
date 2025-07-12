"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './client'
import { authService, type User, type AuthResponse, type LoginCredentials, type SignupCredentials } from './auth'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>
  signUp: (credentials: SignupCredentials) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  let supabase: any
  try {
    supabase = createClient()
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return (
      <AuthContext.Provider value={{
        user: null,
        loading: false,
        signIn: async () => ({ success: false, error: { code: 'CONFIG_ERROR', message: 'Supabase not configured' } }),
        signUp: async () => ({ success: false, error: { code: 'CONFIG_ERROR', message: 'Supabase not configured' } }),
        signOut: async () => {},
        updateProfile: async () => ({ success: false, error: { code: 'CONFIG_ERROR', message: 'Supabase not configured' } }),
        resetPassword: async () => ({ success: false, error: 'Supabase not configured' }),
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  useEffect(() => {
    // Safety timeout to ensure loading state doesn't persist indefinitely
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout reached after 8 seconds, forcing loading to false')
      setLoading(false)
    }, 8000) // 8 second timeout for faster UX

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await (supabase as any).auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          return
        }
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id)
          try {
            const profile = await authService.getCurrentUser()
            if (profile) {
              setUser(profile)
              console.log('Loaded user profile:', profile.email)
            } else {
              // Profile doesn't exist yet - create a fallback user object
              console.log('No profile found, creating fallback user object')
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: null,
                plan: 'free' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            }
          } catch (error) {
            console.error('Error fetching profile:', error)
            // Create fallback user object
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatar_url: null,
              plan: 'free' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        } else {
          console.log('No existing session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        console.log('Initial session check complete, setting loading to false')
        setLoading(false)
        clearTimeout(loadingTimeout)
      }
    }

    // Start the initial session check
    getInitialSession()

    // Listen for auth changes with enhanced session handling
    const { data: { subscription } } = (supabase as any).auth.onAuthStateChange(
      async (event: any, session: any) => {
        
        // Clear the timeout when auth state changes
        clearTimeout(loadingTimeout)
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await authService.getCurrentUser()
            if (profile) {
              setUser(profile)
            } else {
              // Profile doesn't exist yet, but user is authenticated
              console.log('Profile not found for newly signed in user')
              // Create fallback user object
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: null,
                plan: 'free' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            }
          } catch (error) {
            console.error('Error handling signed in user:', error)
            // Even if there's an error, create a basic user object from session
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatar_url: null,
              plan: 'free' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
          // User stays the same, just token was refreshed
        } else if (event === 'USER_UPDATED' && session?.user) {
          try {
            const profile = await authService.getCurrentUser()
            if (profile) {
              setUser(profile)
            }
          } catch (error) {
            console.error('Error updating user profile:', error)
          }
        }
        
        // Ensure loading is always set to false after auth state changes
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [supabase])

  const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true)
    try {
      const response = await authService.signIn(credentials)
      
      if (response.success && response.user) {
        setUser(response.user)
        toast({
          title: "Welcome back!",
          description: `Signed in as ${response.user.name}`,
        })
      } else {
        toast({
          title: "Sign in failed",
          description: response.error?.message || "Please check your credentials",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const errorMessage = 'An unexpected error occurred'
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: { code: 'UNEXPECTED_ERROR', message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    setLoading(true)
    try {
      const response = await authService.signUp(credentials)
      
      if (response.success) {
        toast({
          title: "Welcome to Tensorus!",
          description: "Your account has been created successfully",
        })
      } else {
        toast({
          title: "Sign up failed",
          description: response.error?.message || "Please check your information",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const errorMessage = 'An unexpected error occurred'
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: { code: 'UNEXPECTED_ERROR', message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await authService.updateProfile(updates)
      
      if (response.success && response.user) {
        setUser(response.user)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      } else {
        toast({
          title: "Update failed",
          description: response.error?.message || "Failed to update profile",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const errorMessage = 'Failed to update profile'
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: { code: 'UNEXPECTED_ERROR', message: errorMessage } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await authService.resetPassword(email)
      
      if (response.success) {
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions",
        })
      } else {
        toast({
          title: "Reset failed",
          description: response.error || "Failed to send reset email",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const errorMessage = 'Failed to send reset email'
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
