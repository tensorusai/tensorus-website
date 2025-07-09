import { NextRequest, NextResponse } from 'next/server'
import { serverAuthService } from '@/lib/supabase/auth'
import { queryService } from '@/lib/supabase/queries'
import { serverTensorService } from '@/lib/supabase/tensors'
import { queryGemma } from '@/utils/ai-service'

export async function POST(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, tensorId, query } = body

    if (!projectId || !tensorId || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that the tensor belongs to the user
    const tensor = await serverTensorService.getTensor(tensorId, user.id)
    if (!tensor) {
      return NextResponse.json({ error: 'Tensor not found' }, { status: 404 })
    }

    // Process query with AI service
    const aiResult = await queryGemma(query)

    // Save query to database
    const result = await queryService.createQuery({
      projectId,
      tensorId,
      queryText: query,
      result: aiResult,
      visualData: null, // Could be populated by AI service
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      query: result.query,
      result: aiResult,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}