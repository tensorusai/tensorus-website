import { createClient } from './client'
import { AuthErrorHandler } from './error-handler'

export class SessionManager {
  private static supabase = createClient()
  private static refreshPromise: Promise<boolean> | null = null

  static async ensureValidSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        return false
      }
      
      if (!session) {
        return false
      }
      
      // Check if token is close to expiring (within 5 minutes)
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = expiresAt - now
      
      if (timeUntilExpiry < 300) { // 5 minutes
        console.log('Token expires soon, attempting refresh...')
        return await this.refreshSession()
      }
      
      return true
    } catch (error) {
      console.error('Error checking session validity:', error)
      return false
    }
  }

  static async refreshSession(): Promise<boolean> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return await this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()
    const result = await this.refreshPromise
    this.refreshPromise = null
    
    return result
  }

  private static async performRefresh(): Promise<boolean> {
    try {
      console.log('Attempting to refresh session...')
      
      const { data, error } = await this.supabase.auth.refreshSession()
      
      if (error) {
        console.error('Session refresh failed:', error)
        
        // If refresh fails, sign out the user
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('invalid_refresh_token')) {
          console.log('Invalid refresh token, signing out user')
          await this.supabase.auth.signOut()
        }
        
        return false
      }
      
      if (data.session) {
        console.log('Session refreshed successfully')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Unexpected error during session refresh:', error)
      return false
    }
  }

  static async handleAuthError(error: any): Promise<boolean> {
    const standardError = AuthErrorHandler.mapSupabaseError(error)
    
    // If the error is related to expired tokens, try to refresh
    if (standardError.code === 'SESSION_EXPIRED' || 
        error?.status === 401 ||
        error?.message?.includes('JWT expired')) {
      
      console.log('Detected expired session, attempting refresh...')
      return await this.refreshSession()
    }
    
    return false
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 1
  ): Promise<T> {
    let lastError: any
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Ensure session is valid before operation
        if (attempt === 0) {
          await this.ensureValidSession()
        }
        
        return await operation()
      } catch (error) {
        lastError = error
        
        // On first failure, try to handle auth error and retry
        if (attempt === 0) {
          const refreshed = await this.handleAuthError(error)
          if (refreshed) {
            console.log('Session refreshed, retrying operation...')
            continue
          }
        }
        
        // If we've exhausted retries or refresh failed, throw the error
        throw error
      }
    }
    
    throw lastError
  }

  static isAuthError(error: any): boolean {
    return error?.status === 401 ||
           error?.message?.includes('JWT') ||
           error?.message?.includes('expired') ||
           error?.message?.includes('unauthorized')
  }
}

// Utility function to wrap auth service methods with retry logic
export function withSessionRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    return SessionManager.withRetry(() => fn(...args))
  }
}