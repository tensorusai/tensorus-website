import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'API Keys endpoint - AWS migration in progress' }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ message: 'API Keys endpoint - AWS migration in progress' }, { status: 501 })
}