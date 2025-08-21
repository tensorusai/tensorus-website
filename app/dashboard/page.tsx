"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Database, BarChart, Code } from "lucide-react"

import { useAuth } from "@/lib/aws/context"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard-overview"
import { DeveloperPortalContent } from "@/components/developer-portal-content"

function DashboardContent() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Initialize tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'developer' || tab === 'overview') {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', value)
    window.history.replaceState({}, '', url.toString())
  }

  // Redirect unauthenticated visitors
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/dashboard")
    }
  }, [loading, user, router])

  /* -- Loading state ----------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  // While redirecting
  if (!user) return null

  /* -- Render dashboard -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Tensorus</span>
            </Link>
            <Badge variant="outline">Dashboard</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} />
                <AvatarFallback>
                  {(user.name || user.email || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-sm md:block">
                <div className="font-medium">{user.name || "User"}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
            </div>

            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto lg:mx-0">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2 text-xs sm:text-sm">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Developer Portal</span>
              <span className="sm:hidden">Developer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <DashboardOverview user={user} />
          </TabsContent>

          <TabsContent value="developer" className="space-y-8">
            <DeveloperPortalContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}