import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { AuthNav } from "@/components/auth-nav"
import { Key, Code, BookOpen, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Developer Portal | Tensorus",
  description: "Access Tensorus APIs and developer resources",
}

export default function DeveloperPortal() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <AuthNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Developer Portal
            </div>
            <h1 className="text-4xl font-bold">Build with Tensorus</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access powerful APIs, manage your credentials, and integrate the world's first agentic tensor database into your applications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  API Key Management
                </CardTitle>
                <CardDescription>
                  Generate, view, and manage your API keys for secure access to Tensorus services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/developer/keys">Manage API Keys</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  API Documentation
                </CardTitle>
                <CardDescription>
                  Complete API reference, endpoints, and integration guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Quick start guides, tutorials, and code examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  View Guides
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Developer Support
                </CardTitle>
                <CardDescription>
                  Get help and contact our developer support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What is Tensorus API?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Tensor Operations</h3>
                <p className="text-muted-foreground text-sm">
                  Perform advanced tensor operations on your data including normalization, clustering, and statistical analysis.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Agent Network</h3>
                <p className="text-muted-foreground text-sm">
                  Access our network of specialized AI agents for data processing, analysis, and intelligent insights.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Natural Language Queries</h3>
                <p className="text-muted-foreground text-sm">
                  Query your tensor data using natural language and receive structured responses with visualizations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-time Processing</h3>
                <p className="text-muted-foreground text-sm">
                  Process data in real-time with our scalable tensor database infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
