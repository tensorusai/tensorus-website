import { createRouteClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    try {
      const supabase = createRouteClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to sign in with error
        return NextResponse.redirect(requestUrl.origin + '/auth/signin?error=confirmation_failed')
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(requestUrl.origin + '/auth/signin?error=callback_error')
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + next)
}
