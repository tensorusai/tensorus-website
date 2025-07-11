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
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user) {
    router.replace("/dashboard")
    return null
  }

  const validateForm = () => {
    if (!name.trim()) {
      setError("Please enter your full name")
      return false
    }
    if (!email.trim()) {
      setError("Please enter your email address")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!password) {
      setError("Please enter a password")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setPending(true)
    
    try {
      const response = await signUp({ email: email.trim(), password, name: name.trim() })
      
      if (response.success) {
        if (response.user) {
          // Successful signup with user data
          router.replace("/dashboard")
        } else {
          // Email confirmation required
          setError("Please check your email and click the confirmation link to activate your account.")
          setPending(false)
        }
      } else {
        setError(response.error?.message || "Registration failed. Please try again.")
        setPending(false)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError("An unexpected error occurred. Please try again.")
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 py-8">
          <h1 className="text-2xl font-semibold text-center">Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
