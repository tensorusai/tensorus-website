import { createRouteClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json()

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Access token and refresh token are required' },
        { status: 400 }
      )
    }

    console.log('API: Setting session with tokens:', { 
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing'
    })

    const supabase = createRouteClient()
    
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (error) {
      console.error('API: SetSession error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    console.log('API: Session set successfully:', data.user ? 'user authenticated' : 'no user')
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('API: SetSession catch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to set session' },
      { status: 500 }
    )
  }
}