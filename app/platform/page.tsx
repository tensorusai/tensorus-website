import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { AuthNav } from "@/components/auth-nav"
import { Footer } from "@/components/footer"
import { PlatformHero } from "@/components/platform-hero"
import { PlatformFeatures } from "@/components/platform-features"
import { PlatformCodeExamples } from "@/components/platform-code-examples"
import { PlatformGettingStarted } from "@/components/platform-getting-started"
import { PlatformApiEndpoints } from "@/components/platform-api-endpoints"
import { PlatformAgentInteraction } from "@/components/platform-agent-interaction"
import { PlatformArchitectureVisual } from "@/components/platform-architecture-visual"

export const metadata: Metadata = {
  title: "Platform | Tensorus",
  description: "Explore the Tensorus platform - an advanced agentic tensor database for AI and machine learning",
}

export default function PlatformPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/guide">Documentation</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/platform">Platform</Link>
              </Button>
            </div>
            <Button asChild className="hidden sm:flex">
              <Link href="/demo">Try Demo</Link>
            </Button>
            <AuthNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <PlatformHero />
        <PlatformFeatures />
        <PlatformArchitectureVisual />
        <PlatformApiEndpoints />
        <PlatformAgentInteraction />
        <PlatformCodeExamples />
        <PlatformGettingStarted />
      </main>
      <Footer />
    </div>
  )
}
