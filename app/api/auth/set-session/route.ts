import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Endpoint - AWS migration in progress' }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ message: 'Endpoint - AWS migration in progress' }, { status: 501 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Endpoint - AWS migration in progress' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Endpoint - AWS migration in progress' }, { status: 501 })
}
