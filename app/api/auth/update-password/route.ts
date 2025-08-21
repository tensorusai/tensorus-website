import { createRouteClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password, accessToken, refreshToken } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Access token and refresh token are required' },
        { status: 400 }
      )
    }

    const supabase = createRouteClient()
    
    // Set the session with the provided tokens
    console.log('API: Setting session for password update')
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError || !sessionData.user) {
      console.error('API: Session error:', sessionError)
      return NextResponse.json(
        { success: false, error: 'Failed to authenticate with provided tokens' },
        { status: 401 }
      )
    }
    
    console.log('API: Updating password for user:', sessionData.user.id)
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error('API: Supabase updateUser error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    console.log('API: Password updated successfully')
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('API: UpdatePassword catch error:', error)
    return NextResponse.json(
      { success: false, error: 'Password update failed' },
      { status: 500 }
    )
  }
}