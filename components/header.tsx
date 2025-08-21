import Link from "next/link"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthNav } from "@/components/auth-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Tensorus</span>
        </Link>
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/guide">Documentation</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/platform">Platform</Link>
            </Button>
          </div>
          <div className="hidden sm:block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Demo</div>
          <AuthNav />
        </div>
      </div>
    </header>
  )
}
