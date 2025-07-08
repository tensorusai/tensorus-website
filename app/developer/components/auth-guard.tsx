"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Eye, EyeOff, LogOut } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const authToken = localStorage.getItem('tensorus_auth_token')
    const authExpiry = localStorage.getItem('tensorus_auth_expiry')
    
    if (authToken && authExpiry) {
      const expiryTime = parseInt(authExpiry)
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('tensorus_auth_token')
        localStorage.removeItem('tensorus_auth_expiry')
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    setTimeout(() => {
      if (credentials.username === 'demo' && credentials.password === 'demo123') {
        const authToken = btoa(Date.now().toString() + Math.random().toString())
        const expiry = Date.now() + (24 * 60 * 60 * 1000)
        
        localStorage.setItem('tensorus_auth_token', authToken)
        localStorage.setItem('tensorus_auth_expiry', expiry.toString())
        setIsAuthenticated(true)
      } else {
        setError('Invalid credentials. Use demo/demo123 for this demo.')
      }
      setIsSubmitting(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem('tensorus_auth_token')
    localStorage.removeItem('tensorus_auth_expiry')
    setIsAuthenticated(false)
    setCredentials({ username: '', password: '' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Developer Portal Access</CardTitle>
            <CardDescription>
              Sign in to manage your API keys and access developer resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Demo credentials:
              </p>
              <div className="text-center space-y-1">
                <p className="text-sm font-mono"><strong>Username:</strong> demo</p>
                <p className="text-sm font-mono"><strong>Password:</strong> demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b bg-muted/30">
        <div className="container mx-auto py-2 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Signed in as <strong>demo</strong>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}