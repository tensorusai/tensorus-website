import { NextResponse } from 'next/server'

export async function PUT() {
  return NextResponse.json({ message: 'API Keys endpoint - AWS migration in progress' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'API Keys endpoint - AWS migration in progress' }, { status: 501 })
}