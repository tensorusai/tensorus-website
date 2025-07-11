"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { User, AuthState, AuthAction, LoginCredentials, SignupCredentials, AuthResponse } from './types'
import { authService } from './service'

const AuthContext = createContext<{
  state: AuthState
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<AuthResponse>
  isLoading: boolean
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true }
    case 'AUTH_SUCCESS':
      return {
        user: action.payload.user,
        isLoading: false,
        isAuthenticated: true
      }
    case 'AUTH_ERROR':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false
      }
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('tensorus_token')
        const userData = localStorage.getItem('tensorus_user')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          
          // Validate token with server (in real app)
          // For demo, just check if token exists and is not expired
          const tokenData = JSON.parse(atob(token.split('.')[1] || '{}'))
          if (tokenData.exp && tokenData.exp * 1000 > Date.now()) {
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
          } else {
            // Token expired
            localStorage.removeItem('tensorus_token')
            localStorage.removeItem('tensorus_user')
            dispatch({ type: 'AUTH_LOGOUT' })
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch({ type: 'AUTH_LOGOUT' })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('Auth context login called')
    dispatch({ type: 'AUTH_START' })
    
    try {
      console.log('Calling authService.login...')
      const response = await authService.login(credentials)
      console.log('Auth service response:', response)
      
      if (response.success && response.user && response.token) {
        console.log('Login successful, setting localStorage and dispatching success')
        localStorage.setItem('tensorus_token', response.token)
        localStorage.setItem('tensorus_user', JSON.stringify(response.user))
        
        if (credentials.rememberMe) {
          localStorage.setItem('tensorus_remember', 'true')
        }
        
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } })
        
        toast({
          title: "Welcome back!",
          description: `Signed in as ${response.user.name}`,
        })
      } else {
        console.log('Login failed:', response.error)
        dispatch({ type: 'AUTH_ERROR', payload: response.error! })
        toast({
          title: "Sign in failed",
          description: response.error?.message || "Please check your credentials",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      console.error('Login error in auth context:', error)
      const authError = { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' }
      dispatch({ type: 'AUTH_ERROR', payload: authError })
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: authError }
    }
  }

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const response = await authService.signup(credentials)
      
      if (response.success && response.user && response.token) {
        localStorage.setItem('tensorus_token', response.token)
        localStorage.setItem('tensorus_user', JSON.stringify(response.user))
        
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } })
        
        toast({
          title: "Welcome to Tensorus!",
          description: "Your account has been created successfully",
        })
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.error! })
        toast({
          title: "Sign up failed",
          description: response.error?.message || "Please check your information",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const authError = { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' }
      dispatch({ type: 'AUTH_ERROR', payload: authError })
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: authError }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('tensorus_token')
      localStorage.removeItem('tensorus_user')
      localStorage.removeItem('tensorus_remember')
      dispatch({ type: 'AUTH_LOGOUT' })
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    }
  }

  const updateUser = async (data: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await authService.updateProfile(data)
      
      if (response.success && response.user) {
        localStorage.setItem('tensorus_user', JSON.stringify(response.user))
        dispatch({ type: 'UPDATE_USER', payload: response.user })
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      }
      
      return response
    } catch (error) {
      const authError = { code: 'UPDATE_ERROR', message: 'Failed to update profile' }
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: authError }
    }
  }

  const resetPassword = async (email: string): Promise<AuthResponse> => {
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
          description: response.error?.message || "Failed to send reset email",
          variant: "destructive",
        })
      }
      
      return response
    } catch (error) {
      const authError = { code: 'RESET_ERROR', message: 'Failed to send reset email' }
      toast({
        title: "Reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: authError }
    }
  }

  return (
    <AuthContext.Provider value={{
      state,
      login,
      signup,
      logout,
      updateUser,
      resetPassword,
      isLoading: state.isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
