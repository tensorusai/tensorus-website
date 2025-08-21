import { NextRequest, NextResponse } from 'next/server'
import { serverAuthService } from '@/lib/supabase/auth'
import { apiKeyService } from '@/lib/aws/api-keys'

export async function GET() {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await apiKeyService.getAPIKeys()
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.apiKeys)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, expiresAt } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const result = await apiKeyService.createAPIKey({
      name,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.apiKey)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
