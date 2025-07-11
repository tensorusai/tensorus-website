import { createRouteClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

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

    const supabase = createRouteClient()
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('API: Current user for password update:', user ? 'authenticated' : 'not authenticated', userError)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated. Please try the reset link again.' },
        { status: 401 }
      )
    }
    
    console.log('API: Updating password for user:', user.id)
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