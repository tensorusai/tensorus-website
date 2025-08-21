"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/aws/context"

export function AuthNav() {
  const { user, isInitialized, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until both mounted and initialized
  if (!mounted || !isInitialized) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  // User is signed in
  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild className="hidden sm:flex">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <div className="flex items-center space-x-2">
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
          <div className="hidden md:block">
            <div className="text-sm font-medium">{user.name || "User"}</div>
          </div>
        </div>
        <Button variant="outline" onClick={signOut} size="sm">
          Sign Out
        </Button>
      </div>
    )
  }

  // User is not signed in
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    </div>
  )
}