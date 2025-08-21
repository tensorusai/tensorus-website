import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'AI Query endpoint - AWS migration in progress' }, { status: 501 })
}