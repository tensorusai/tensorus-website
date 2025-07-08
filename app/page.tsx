import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TransformSection } from "@/components/transform-section"
import { PossibilitiesSection } from "@/components/possibilities-section"
import { CommunitySection } from "@/components/community-section"
import { AISection } from "@/components/ai-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Tensorus: Agentic Tensor Database",
  description: "A revolutionary way to store and use information powered by AI agents",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
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
            <Button asChild>
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TransformSection />
        <PossibilitiesSection />
        <CommunitySection />
        <AISection />
      </main>
      <Footer />
    </div>
  )
}
