"use client"

import { useAuth } from "@/lib/supabase/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Database, Key, Activity, Settings, BarChart3, Users, Zap, Clock, TrendingUp, Shield, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { state, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      router.push("/auth/signin?redirect=/dashboard")
    }
  }, [state.isAuthenticated, state.isLoading, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!state.isAuthenticated || !state.user) {
    return null
  }

  const { user } = state

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Tensorus</span>
              </Link>
              <Badge variant="outline">Dashboard</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/developer">Developer Portal</Link>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's an overview of your Tensorus account and recent activity.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">API Keys</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">API Calls</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tensors</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Usage</p>
                    <p className="text-2xl font-bold">76%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Overview
                </CardTitle>
                <CardDescription>Your account details and subscription status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plan</span>
                  <Badge
                    variant={user.plan === "enterprise" ? "default" : user.plan === "pro" ? "secondary" : "outline"}
                  >
                    {user.plan === "enterprise" ? "Enterprise" : user.plan === "pro" ? "Pro" : "Free"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Status</span>
                  <Badge variant={user.emailVerified ? "default" : "destructive"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2FA</span>
                  <Badge variant={user.twoFactorEnabled ? "default" : "outline"}>
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
                <CardDescription>Your API usage for the current month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Calls</span>
                    <span className="text-sm text-muted-foreground">1,247 / 10,000</span>
                  </div>
                  <Progress value={12.47} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Data Processing</span>
                    <span className="text-sm text-muted-foreground">3.2 GB / 50 GB</span>
                  </div>
                  <Progress value={6.4} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI Agent Calls</span>
                    <span className="text-sm text-muted-foreground">456 / 5,000</span>
                  </div>
                  <Progress value={9.12} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    You're on the <strong>{user.plan}</strong> plan. Upgrade for higher limits.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Zap className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/developer/keys">
                    <Key className="mr-2 h-4 w-4" />
                    Manage API Keys
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/demo">
                    <Database className="mr-2 h-4 w-4" />
                    Try Demo
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/guide">
                    <Users className="mr-2 h-4 w-4" />
                    View Documentation
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest API calls and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Tensor analysis completed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">API key generated</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Data upload processed</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Profile updated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
