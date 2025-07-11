"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/supabase/context"
import { authService } from "@/lib/supabase/auth"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  
  // Check if we have access token (from password reset link)
  const accessToken = searchParams?.get('access_token')
  const refreshToken = searchParams?.get('refresh_token')
  const type = searchParams?.get('type')
  
  const [mode, setMode] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [sent, setSent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    // If we have tokens and type is recovery, show reset form
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Password reset mode detected with tokens')
      setMode('reset')
      // Set the session using the tokens
      const setSession = async () => {
        try {
          console.log('About to call setSession...')
          const response = await Promise.race([
            authService.setSession(accessToken, refreshToken),
            new Promise<{ success: boolean; error?: string }>((_, reject) => 
              setTimeout(() => reject(new Error('setSession timeout')), 10000)
            )
          ]) as { success: boolean; error?: string }
          console.log('setSession completed with response:', response)
          
          if (!response.success) {
            console.error('Failed to set session:', response.error)
            setError('Failed to authenticate. Please try the reset link again.')
          } else {
            console.log('Session set successfully for password reset')
          }
        } catch (error) {
          console.error('Error setting session:', error)
          setError('Failed to authenticate. Please try the reset link again.')
        }
      }
      setSession()
    } else {
      console.log('Password request mode - no tokens found')
    }
  }, [accessToken, refreshToken, type])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)

    const response = await resetPassword(email)

    if (!response.success) {
      setError(response.error || "An error occurred during password reset")
    } else {
      setSent(true)
    }
    setPending(false)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)

    console.log('Starting password reset...')

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setPending(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setPending(false)
      return
    }

    try {
      console.log('Calling updatePassword...')
      const response = await Promise.race([
        authService.updatePassword(password),
        new Promise<{ success: boolean; error?: string }>((_, reject) => 
          setTimeout(() => reject(new Error('updatePassword timeout')), 10000)
        )
      ]) as { success: boolean; error?: string }
      console.log('UpdatePassword response:', response)
      
      if (response.success) {
        console.log('Password updated successfully')
        setSuccess(true)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        console.error('Password update failed:', response.error)
        setError(response.error || "Failed to update password")
      }
    } catch (error) {
      console.error('Password update error:', error)
      setError("An unexpected error occurred")
    } finally {
      setPending(false)
    }
  }

  if (mode === 'reset') {
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
                Reset your password
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {success ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Password Updated!</h3>
                      <p className="text-muted-foreground">
                        Your password has been successfully updated. Redirecting to dashboard...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                            disabled={pending}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={pending}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                            disabled={pending}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={pending}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={pending}
                      >
                        {pending ? "Updating Password..." : "Update Password"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Request reset mode
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
              Reset your password
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sent ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Check your email</h3>
                    <p className="text-muted-foreground">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                      {pending ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
              <Database className="h-8 w-8 text-primary" />
              Tensorus
            </Link>
            <p className="text-muted-foreground mt-2">
              Loading...
            </p>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
