"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, AlertCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/supabase/context'

export default function LinkExpiredPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const linkType = searchParams?.get('type') || 'confirmation'
  const isPasswordReset = linkType === 'recovery'

  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)

    if (!email) {
      setError('Please enter your email address')
      setPending(false)
      return
    }

    try {
      if (isPasswordReset) {
        const response = await resetPassword(email)
        if (response.success) {
          setSent(true)
        } else {
          setError(response.error || 'Failed to send reset link')
        }
      } else {
        // For email confirmation, we'd need to implement a resend confirmation endpoint
        // For now, redirect to signup
        router.push('/auth/signup')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setPending(false)
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
            <p className="text-muted-foreground mt-2">
              Email link expired
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Link Expired</CardTitle>
              <CardDescription className="text-center">
                {isPasswordReset 
                  ? 'Your password reset link has expired. Enter your email to request a new one.'
                  : 'Your email confirmation link has expired. Please request a new one.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-destructive/10 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>

              {sent ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <Mail className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">New Link Sent!</h3>
                    <p className="text-muted-foreground">
                      We've sent a new {isPasswordReset ? 'password reset' : 'confirmation'} link to <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Email links expire after 24 hours for security reasons. 
                      {isPasswordReset ? ' Request a new password reset link below.' : ' Please request a new confirmation link.'}
                    </AlertDescription>
                  </Alert>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {isPasswordReset ? (
                    <form onSubmit={handleResendLink} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={pending}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={pending}
                      >
                        {pending ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send New Reset Link'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-center">
                        To request a new email confirmation link, please sign up again.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/auth/signup">
                          Go to Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-6 space-y-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              or <Link href="/" className="text-primary hover:underline">go to homepage</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}