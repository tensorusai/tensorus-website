import { NextRequest, NextResponse } from 'next/server'
import { serverAuthService } from '@/lib/aws/server-auth'
import { tensorService } from '@/lib/supabase/tensors'

export async function GET(request: NextRequest) {
  try {
    const user = await serverAuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    let result

    if (projectId) {
      result = await tensorService.getTensorsByProject(projectId)
    } else {
      result = await tensorService.getTensors()
    }
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.tensors)
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
    const {
      projectId,
      dimensions,
      shape,
      dataType,
      sparsity,
      transformationMethod,
      fields,
      stats,
    } = body

    if (!projectId || !dimensions || !shape || !dataType || !transformationMethod || !fields) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await tensorService.createTensor({
      projectId,
      dimensions,
      shape,
      dataType,
      sparsity: sparsity || 0,
      transformationMethod,
      fields,
      stats,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.tensor)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
