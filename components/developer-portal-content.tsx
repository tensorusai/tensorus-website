"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Code, BookOpen, HelpCircle } from "lucide-react"

export function DeveloperPortalContent() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section>
        <div className="text-center space-y-4 mb-8">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Developer Portal
          </div>
          <h2 className="text-3xl font-bold">Build with Tensorus</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access powerful APIs, manage your credentials, and integrate the world's first agentic tensor database into your applications.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
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
      </section>

      {/* Information Section */}
      <section>
        <div className="bg-muted/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">What is Tensorus API?</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Tensor Operations</h4>
              <p className="text-muted-foreground text-sm">
                Perform advanced tensor operations on your data including normalization, clustering, and statistical analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Agent Network</h4>
              <p className="text-muted-foreground text-sm">
                Access our network of specialized AI agents for data processing, analysis, and intelligent insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Natural Language Queries</h4>
              <p className="text-muted-foreground text-sm">
                Query your tensor data using natural language and receive structured responses with visualizations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Real-time Processing</h4>
              <p className="text-muted-foreground text-sm">
                Process data in real-time with our scalable tensor database infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}