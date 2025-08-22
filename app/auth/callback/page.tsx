"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Processing authentication...')
  
  const code = searchParams?.get('code')
  const error = searchParams?.get('error')
  const next = searchParams?.get('next') || '/dashboard'

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Callback page loaded with URL:', window.location.href)
        
        // Check for errors in URL fragment (hash)
        const hash = window.location.hash
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1))
          const hashError = hashParams.get('error')
          const hashErrorCode = hashParams.get('error_code')
          const hashErrorDescription = hashParams.get('error_description')
          
          if (hashError) {
            console.error('Hash error:', hashError, hashErrorCode, hashErrorDescription)
            setStatus('error')
            
            // Provide specific error messages for different error types
            if (hashErrorCode === 'otp_expired') {
              // Redirect to dedicated expired link page
              const linkType = hash.includes('recovery') ? 'recovery' : 'confirmation'
              router.push(`/auth/link-expired?type=${linkType}`)
              return
            } else if (hashError === 'access_denied') {
              setMessage('Access denied. The email link may be invalid or has already been used.')
            } else {
              setMessage(hashErrorDescription ? decodeURIComponent(hashErrorDescription) : 'Authentication failed. Please try again.')
            }
            return
          }
        }

        // Check for errors in query parameters
        if (error) {
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          return
        }

        // Immediately redirect to API route for processing
        const urlParams = new URLSearchParams(window.location.search)
        console.log('Query parameters:', Object.fromEntries(urlParams.entries()))
        
        // Always redirect to API route, let it handle the auth flow
        const apiUrl = `/api/auth/callback?${urlParams.toString()}`
        console.log('Redirecting to API route:', apiUrl)
        
        // Use replace to avoid back button issues
        window.location.replace(apiUrl)
        
      } catch (error) {
        console.error('Error in callback:', error)
        setStatus('error')
        setMessage('An error occurred during authentication. Please try again.')
      }
    }

    handleCallback()
  }, [code, error, next, router, searchParams])

  const handleRetry = () => {
    router.push('/auth/signin')
  }

  const handleGoToDashboard = () => {
    router.push(next)
  }

  const handleRequestNewLink = () => {
    // Check if this was a password reset link
    const hash = window.location.hash
    if (hash && hash.includes('recovery')) {
      router.push('/auth/reset-password')
    } else {
      // For email confirmation, go to signup
      router.push('/auth/signup')
    }
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
                    {message.includes('expired') || message.includes('invalid') ? (
                      <>
                        <Button onClick={handleRequestNewLink} className="w-full">
                          Request New Link
                        </Button>
                        <Button variant="outline" onClick={handleRetry} className="w-full">
                          Sign In Instead
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleRetry} className="w-full">
                          Try Again
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/">Go Home</Link>
                        </Button>
                      </>
                    )}
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