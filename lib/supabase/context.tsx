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
  
  let supabase
  try {
    supabase = createClient()
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return (
      <AuthContext.Provider value={{
        user: null,
        loading: false,
        signIn: async () => ({ success: false, error: 'Supabase not configured' }),
        signUp: async () => ({ success: false, error: 'Supabase not configured' }),
        signOut: async () => {},
        updateProfile: async () => ({ success: false, error: 'Supabase not configured' }),
        resetPassword: async () => ({ success: false, error: 'Supabase not configured' }),
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await authService.getCurrentUser()
          if (profile) {
            setUser(profile)
          } else {
            // Profile doesn't exist yet, but user is authenticated
            // This can happen during signup - keep loading state
            console.log('Profile not found for authenticated user, keeping loading state')
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await authService.getCurrentUser()
          if (profile) {
            setUser(profile)
          } else {
            // Profile doesn't exist yet, but user is authenticated
            console.log('Profile not found for newly signed in user')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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
          description: response.error || "Please check your credentials",
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
      return { success: false, error: errorMessage }
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
          description: response.error || "Please check your information",
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
      return { success: false, error: errorMessage }
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
          description: response.error || "Failed to update profile",
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
      return { success: false, error: errorMessage }
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
