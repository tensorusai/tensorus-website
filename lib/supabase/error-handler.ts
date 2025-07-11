import { AuthError } from '@supabase/supabase-js'

export interface StandardError {
  code: string
  message: string
  details?: string
}

export interface StandardAuthResponse {
  success: boolean
  user?: any
  error?: StandardError
}

export class AuthErrorHandler {
  static mapSupabaseError(error: AuthError | Error | any): StandardError {
    // Handle Supabase Auth errors
    if (error?.name === 'AuthError' || error?.status) {
      return this.mapAuthError(error)
    }
    
    // Handle general errors
    if (error?.message) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error.details || undefined
      }
    }
    
    // Fallback for unexpected errors
    return {
      code: 'UNEXPECTED_ERROR',
      message: 'An unexpected error occurred. Please try again.',
      details: String(error)
    }
  }

  private static mapAuthError(error: AuthError | any): StandardError {
    const message = error.message || 'Authentication failed'
    
    // Common Supabase auth error patterns
    if (message.includes('Invalid login credentials')) {
      return {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password. Please check your credentials and try again.'
      }
    }
    
    if (message.includes('User already registered')) {
      return {
        code: 'USER_ALREADY_EXISTS',
        message: 'An account with this email already exists. Please sign in instead.'
      }
    }
    
    if (message.includes('Invalid email')) {
      return {
        code: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.'
      }
    }
    
    if (message.includes('Password should be at least 6 characters')) {
      return {
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 6 characters long.'
      }
    }
    
    if (message.includes('Email not confirmed')) {
      return {
        code: 'EMAIL_NOT_CONFIRMED',
        message: 'Please check your email and click the confirmation link to activate your account.'
      }
    }
    
    if (message.includes('Too many requests')) {
      return {
        code: 'RATE_LIMITED',
        message: 'Too many attempts. Please wait a moment before trying again.'
      }
    }
    
    if (message.includes('Network error') || message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.'
      }
    }
    
    if (message.includes('Email link is invalid or has expired')) {
      return {
        code: 'EXPIRED_LINK',
        message: 'This email link has expired or is invalid. Please request a new one.'
      }
    }
    
    if (message.includes('Access token has expired')) {
      return {
        code: 'SESSION_EXPIRED',
        message: 'Your session has expired. Please sign in again.'
      }
    }
    
    // Default mapping for unmapped auth errors
    return {
      code: 'AUTH_ERROR',
      message: message,
      details: error.details
    }
  }

  static createSuccessResponse(user?: any): StandardAuthResponse {
    return {
      success: true,
      user
    }
  }

  static createErrorResponse(error: AuthError | Error | any): StandardAuthResponse {
    return {
      success: false,
      error: this.mapSupabaseError(error)
    }
  }

  static validateCredentials(email: string, password: string): StandardError | null {
    if (!email || !password) {
      return {
        code: 'MISSING_FIELDS',
        message: 'Email and password are required.'
      }
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        code: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.'
      }
    }
    
    if (password.length < 6) {
      return {
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 6 characters long.'
      }
    }
    
    return null
  }

  static validateSignupCredentials(email: string, password: string, name: string): StandardError | null {
    const basicValidation = this.validateCredentials(email, password)
    if (basicValidation) return basicValidation
    
    if (!name?.trim()) {
      return {
        code: 'MISSING_NAME',
        message: 'Name is required.'
      }
    }
    
    if (name.trim().length < 2) {
      return {
        code: 'INVALID_NAME',
        message: 'Name must be at least 2 characters long.'
      }
    }
    
    return null
  }
}

// Export updated types for backward compatibility
export type { StandardAuthResponse as AuthResponse }