import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  
  // AWS Cognito handles authentication redirects differently
  // This endpoint is no longer needed with Cognito hosted UI
  // Redirect to dashboard as fallback
  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
