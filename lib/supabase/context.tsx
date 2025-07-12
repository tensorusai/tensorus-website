"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './client'
import { authService, type User, type AuthResponse, type LoginCredentials, type SignupCredentials } from './auth'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  isInitialized: boolean
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>
  signUp: (credentials: SignupCredentials) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  
  let supabase: any
  try {
    supabase = createClient()
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return (
      <AuthContext.Provider value={{
        user: null,
        isInitialized: true,
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
    let isMounted = true
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        if (error) {
          console.error('Session error:', error)
          setUser(null)
        } else if (session?.user) {
          console.log('Found existing session')
          
          // Create user object immediately from session data
          const fallbackUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            plan: 'free' as const,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          setUser(fallbackUser)
          
          // Try to fetch profile in background (don't block UI)
          authService.getCurrentUser().then(profile => {
            if (isMounted && profile) {
              setUser(profile)
            }
          }).catch(error => {
            console.error('Background profile fetch failed:', error)
            // Keep using fallback user
          })
        } else {
          console.log('No session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true)
          console.log('Auth initialization complete')
        }
      }
    }

    // Initialize auth immediately
    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!isMounted) return
        
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            plan: 'free' as const,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        // TOKEN_REFRESHED doesn't need to change user state
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
    }
  }

  const signUp = async (credentials: SignupCredentials): Promise<AuthResponse> => {
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
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      
      // Security: Redirect to home page after successful sign out
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      
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
    isInitialized,
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
