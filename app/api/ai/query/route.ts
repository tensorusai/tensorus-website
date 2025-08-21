import { NextRequest, NextResponse } from 'next/server'
import { serverAuthService } from '@/lib/aws/server-auth'
import { query } from '@/lib/aws/database'
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
    const tensorResult = await query('SELECT * FROM tensors WHERE id = $1 AND user_id = $2', [tensorId, user.id])
    if (tensorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tensor not found' }, { status: 404 })
    }

    // Process query with AI service
    const aiResult = await queryGemma(query)

    // Save query to database
    const queryResult = await query(
      'INSERT INTO queries (user_id, project_id, tensor_id, query_text, result) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.id, projectId, tensorId, query, aiResult]
    )

    return NextResponse.json({
      query: queryResult.rows[0],
      result: aiResult,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
