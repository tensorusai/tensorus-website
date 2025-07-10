"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase/context"

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 py-8">
          <h1 className="text-2xl font-semibold text-center">Reset password</h1>

          {sent ? (
            <p className="text-center">
              An email with reset instructions has been sent to <b>{email}</b>.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}

          {error && <p className="text-destructive text-sm text-center">{error}</p>}
        </CardContent>
      </Card>
    </main>
  )
}
