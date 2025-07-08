import Link from "next/link"
import { Database, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Tensorus</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/guide">Documentation</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/platform">Platform</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="https://github.com/tensorus" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">Demo Version</div>
        </div>
      </div>
    </header>
  )
}
