"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase/context"

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user) {
    router.replace("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    const response = await signUp({ email, password })
    if (!response.success) {
      setError(response.error || "An error occurred during signup")
      setPending(false)
      return
    }
    router.replace("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 py-8">
          <h1 className="text-2xl font-semibold text-center">Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={pending || loading}>
              {pending ? "Creating…" : "Sign up"}
            </Button>
          </form>

          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" onClick={() => router.push("/auth/signin")}>
              Sign in
            </Button>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
