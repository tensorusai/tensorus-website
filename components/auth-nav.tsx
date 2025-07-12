"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/supabase/context"

export function AuthNav() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

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

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    </div>
  )
}