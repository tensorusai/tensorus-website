"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthErrorHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const handleAuthErrors = () => {
      const hash = window.location.hash
      
      // Check if we have auth-related content in the hash
      if (hash && (hash.includes('error=') || hash.includes('access_token=') || hash.includes('refresh_token='))) {
        const hashParams = new URLSearchParams(hash.substring(1))
        const error = hashParams.get('error')
        const errorCode = hashParams.get('error_code')
        const errorDescription = hashParams.get('error_description')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        console.log('Auth content detected in hash:', { error, errorCode, errorDescription, accessToken: !!accessToken, refreshToken: !!refreshToken, type, pathname })

        // Clear the hash to prevent the content from persisting
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }

        // If we're not already on an auth page, redirect to handle the auth content
        if (!pathname.startsWith('/auth/')) {
          if (error) {
            // Handle errors
            if (errorCode === 'otp_expired' || error === 'access_denied') {
              // Determine if this is a password reset or email confirmation
              const linkType = hash.includes('recovery') || type === 'recovery' ? 'recovery' : 'confirmation'
              router.push(`/auth/link-expired?type=${linkType}`)
            } else {
              // For other errors, go to signin with error message
              const message = errorDescription || 'Authentication failed'
              router.push(`/auth/signin?error=callback_error&message=${encodeURIComponent(message)}`)
            }
          } else if (accessToken && refreshToken) {
            // Handle successful auth tokens - redirect to callback API route
            const queryParams = new URLSearchParams()
            queryParams.set('access_token', accessToken)
            queryParams.set('refresh_token', refreshToken)
            if (type) queryParams.set('type', type)
            // Use the API route directly for processing
            window.location.href = `/api/auth/callback?${queryParams.toString()}`
          }
        }
      }
    }

    // Check immediately
    handleAuthErrors()

    // Also check on hash changes (in case user navigates with hash)
    const handleHashChange = () => {
      handleAuthErrors()
    }

    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [router, pathname])

  return null
}