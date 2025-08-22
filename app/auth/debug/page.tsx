"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, ArrowLeft } from 'lucide-react'

function AuthDebugContent() {
  const searchParams = useSearchParams()
  const [hashData, setHashData] = useState<any>(null)
  const [queryData, setQueryData] = useState<any>(null)

  useEffect(() => {
    // Get query parameters
    const queryParams: any = {}
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value
      }
    }
    setQueryData(queryParams)

    // Get hash parameters
    const hash = window.location.hash
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1))
      const hashData: any = {}
      for (const [key, value] of hashParams.entries()) {
        hashData[key] = value
      }
      setHashData(hashData)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Database className="h-8 w-8 text-primary" />
            Tensorus
          </Link>
          <p className="text-muted-foreground mt-2">
            Authentication Debug Information
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>URL Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Current URL:</h3>
                <code className="text-sm bg-muted p-2 rounded block break-all">
                  {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Pathname:</h3>
                <code className="text-sm bg-muted p-2 rounded block">
                  {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Hash:</h3>
                <code className="text-sm bg-muted p-2 rounded block break-all">
                  {typeof window !== 'undefined' ? window.location.hash || 'None' : 'Loading...'}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              {queryData && Object.keys(queryData).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(queryData).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium">{key}:</span>
                      <code className="text-sm bg-muted p-1 rounded">{value as string}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No query parameters found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hash Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              {hashData && Object.keys(hashData).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(hashData).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="font-medium">{key}:</span>
                      <code className="text-sm bg-muted p-1 rounded ml-2 break-all max-w-xs">
                        {value as string}
                      </code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hash parameters found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you're seeing auth errors, try these steps:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Check if the email link has expired (links expire after 24 hours)</li>
                  <li>• Ensure you're using the latest link from your email</li>
                  <li>• Try requesting a new confirmation or reset link</li>
                  <li>• Check your email spam folder</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Go to Sign In</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/signup">Go to Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AuthDebugPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
              <Database className="h-8 w-8 text-primary" />
              Tensorus
            </Link>
            <p className="text-muted-foreground mt-2">
              Loading debug information...
            </p>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <AuthDebugContent />
    </Suspense>
  )
}