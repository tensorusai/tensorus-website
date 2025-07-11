"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Confirming your email...')
  
  const code = searchParams?.get('code')
  const error = searchParams?.get('error')
  const next = searchParams?.get('next') || '/dashboard'

  useEffect(() => {
    if (error) {
      setStatus('error')
      setMessage('Authentication failed. Please try again.')
      return
    }

    if (!code) {
      setStatus('error')
      setMessage('Invalid authentication link. Please try signing in again.')
      return
    }

    // Let the API route handle the callback
    // This page is just for showing loading state
    const timer = setTimeout(() => {
      // If we're still here after 5 seconds, something went wrong
      setStatus('error')
      setMessage('Authentication is taking longer than expected. Please try again.')
    }, 5000)

    return () => clearTimeout(timer)
  }, [code, error])

  const handleRetry = () => {
    router.push('/auth/signin')
  }

  const handleGoToDashboard = () => {
    router.push(next)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
              <Database className="h-8 w-8 text-primary" />
              Tensorus
            </Link>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              {status === 'processing' && (
                <>
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Confirming Authentication</h2>
                    <p className="text-muted-foreground">{message}</p>
                  </div>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Email Confirmed!</h2>
                    <p className="text-muted-foreground">Your email has been confirmed successfully.</p>
                  </div>
                  <Button onClick={handleGoToDashboard} className="w-full">
                    Continue to Dashboard
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
                    <p className="text-muted-foreground">{message}</p>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={handleRetry} className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/">Go Home</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button variant="ghost" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}