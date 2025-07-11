import { createRouteClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Whitelist of allowed redirect paths for security
const ALLOWED_REDIRECT_PATHS = [
  '/dashboard',
  '/auth/reset-password',
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
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next')
  const baseUrl = getBaseUrl(request)
  
  // Handle OAuth errors from Supabase
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorMessage = encodeURIComponent(errorDescription || 'Authentication failed')
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=oauth_error&message=${errorMessage}`)
  }

  // Handle missing code
  if (!code) {
    console.error('No authorization code provided')
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=missing_code&message=No authorization code provided`)
  }

  try {
    const supabase = createRouteClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const errorMessage = encodeURIComponent(exchangeError.message || 'Failed to confirm email')
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=confirmation_failed&message=${errorMessage}`)
    }

    if (!data.session) {
      console.error('No session returned after code exchange')
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=session_failed&message=Failed to create session`)
    }

    // Ensure user profile exists
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (!profile && !profileError) {
          // Create profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
            })

          if (createError) {
            console.error('Failed to create user profile:', createError)
            // Continue anyway - profile can be created later
          }
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
