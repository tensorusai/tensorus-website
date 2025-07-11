import { createRouteClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Whitelist of allowed redirect paths for security
const ALLOWED_REDIRECT_PATHS = [
  '/dashboard',
  '/auth/reset-password',
  '/auth/link-expired',
  '/developer',
  '/developer/keys',
  '/demo',
  '/platform',
  '/guide'
]

// Get base URL from environment or request
function getBaseUrl(request: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl
  
  const requestUrl = new URL(request.url)
  return requestUrl.origin
}

// Validate and sanitize the next parameter
function validateNextPath(next: string | null): string {
  if (!next) return '/dashboard'
  
  // Remove any potential domain/origin from the path
  const path = next.startsWith('/') ? next : `/${next}`
  
  // Check if the path is in our whitelist
  if (ALLOWED_REDIRECT_PATHS.includes(path)) {
    return path
  }
  
  // Check if it's a valid nested path under allowed paths
  const isValidNestedPath = ALLOWED_REDIRECT_PATHS.some(allowedPath => 
    path.startsWith(allowedPath + '/') || path === allowedPath
  )
  
  if (isValidNestedPath) {
    return path
  }
  
  // Default to dashboard if path is not allowed
  console.warn(`Invalid redirect path attempted: ${path}. Redirecting to dashboard.`)
  return '/dashboard'
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next')
  const type = requestUrl.searchParams.get('type')
  const accessToken = requestUrl.searchParams.get('access_token')
  const refreshToken = requestUrl.searchParams.get('refresh_token')
  const baseUrl = getBaseUrl(request)
  
  // Debug logging
  console.log('Auth callback invoked with params:', {
    code: code ? 'present' : 'missing',
    tokenHash: tokenHash ? 'present' : 'missing',
    error,
    errorDescription,
    next,
    type,
    accessToken: accessToken ? 'present' : 'missing',
    refreshToken: refreshToken ? 'present' : 'missing',
    fullUrl: requestUrl.toString()
  })
  
  // Handle OAuth errors from Supabase
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorMessage = encodeURIComponent(errorDescription || 'Authentication failed')
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=oauth_error&message=${errorMessage}`)
  }

  // Handle password recovery flow (from email template with access/refresh tokens)
  if (type === 'recovery' && accessToken && refreshToken) {
    console.log('Handling password recovery callback with URL tokens')
    // For password reset, always redirect to reset-password page with tokens
    return NextResponse.redirect(`${baseUrl}/auth/reset-password?type=recovery&access_token=${accessToken}&refresh_token=${refreshToken}`)
  }

  // Handle missing code/token_hash for email confirmation
  if (!code && !tokenHash) {
    console.error('No authorization code or token hash provided')
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=missing_code&message=No authorization code or token hash provided`)
  }

  try {
    const supabase = createRouteClient()
    
    // Handle both code and token_hash patterns
    let data, exchangeError
    if (code) {
      // PKCE flow
      const result = await supabase.auth.exchangeCodeForSession(code)
      data = result.data
      exchangeError = result.error
    } else if (tokenHash) {
      // Token hash pattern - use the newer approach
      const result = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type === 'recovery' ? 'recovery' : type === 'email_change' ? 'email_change' : 'signup'
      })
      data = result.data
      exchangeError = result.error
      
      // Special handling for password recovery with token_hash
      if (type === 'recovery' && data.session) {
        console.log('Handling password recovery callback with token_hash')
        // For password reset with token_hash, redirect to reset-password page with session
        return NextResponse.redirect(`${baseUrl}/auth/reset-password?type=recovery&access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`)
      }
    }
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const errorMessage = encodeURIComponent(exchangeError.message || 'Failed to confirm email')
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=confirmation_failed&message=${errorMessage}`)
    }

    if (!data.session) {
      console.error('No session returned after code exchange')
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=session_failed&message=Failed to create session`)
    }

    // Ensure user profile exists - use service client to bypass RLS
    if (data.user) {
      try {
        const serviceClient = createServiceClient()
        
        // First check if profile exists
        const { data: profile, error: profileError } = await serviceClient
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error checking profile:', profileError)
        }

        if (!profile) {
          // Create profile if it doesn't exist using service client
          const { error: createError } = await serviceClient
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
            })

          if (createError) {
            console.error('Failed to create user profile:', createError)
            // Continue anyway - profile can be created later
          } else {
            console.log('Successfully created user profile')
          }
        } else {
          console.log('User profile already exists')
        }
      } catch (profileError) {
        console.error('Error handling user profile:', profileError)
        // Continue anyway - profile can be created later
      }
    }

    // Validate and get safe redirect path
    const redirectPath = validateNextPath(next)
    
    console.log(`Auth callback successful, redirecting to: ${redirectPath}`)
    return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    const errorMessage = encodeURIComponent('An unexpected error occurred during authentication')
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=callback_error&message=${errorMessage}`)
  }
}
