"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/supabase/context"

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await resetPassword(email)

      if (response.success) {
        setIsSubmitted(true)
      } else {
        setError(response.error?.message || "Failed to send reset email")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
              >
                <Database className="h-8 w-8 text-primary" />
                Tensorus
              </Link>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                  We've sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">What's next?</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    className="w-full"
                  >
                    Try different email
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to sign in
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              <Database className="h-8 w-8 text-primary" />
              Tensorus
            </Link>
            <p className="text-muted-foreground mt-2">Reset your password</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Forgot password?</CardTitle>
              <CardDescription className="text-center">
                No worries! Enter your email and we'll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send reset link
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Remember your password?</strong> You can{" "}
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    sign in here
                  </Link>{" "}
                  or{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    create a new account
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
