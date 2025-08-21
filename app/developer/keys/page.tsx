"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { AuthGuard } from "../components/auth-guard"
import { APIKeyForm } from "../components/api-key-form"
import { APIKeyTable } from "../components/api-key-table"
import { MainNav } from "@/components/main-nav"
import { AuthNav } from "@/components/auth-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Code, Zap, Info } from "lucide-react"
import Link from "next/link"
import type { APIKey } from "../types/api-keys"

export default function APIKeysPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleKeyGenerated = (key: APIKey) => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <AuthNav />
            </div>
          </div>
        </header>

        <main className="container mx-auto py-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">API Key Management</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Generate and manage your Tensorus API keys for secure access to our services. 
              Each key provides full access to your tensor operations and AI agent network.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> API keys are shown in full only once during generation. 
              Store them securely and never share them publicly. Revoke keys immediately if they're compromised.
            </AlertDescription>
          </Alert>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <APIKeyForm onKeyGenerated={handleKeyGenerated} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Usage Example
                  </CardTitle>
                  <CardDescription>
                    Quick example of how to use your API key with the Tensorus API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">cURL Request:</p>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`curl -X POST https://api.tensorus.com/v1/tensor/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": [[1,2,3], [4,5,6], [7,8,9]],
    "operation": "analyze"
  }'`}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">JavaScript Example:</p>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`const response = await fetch('https://api.tensorus.com/v1/tensor/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: [[1,2,3], [4,5,6], [7,8,9]],
    operation: 'analyze'
  })
});`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <APIKeyTable refreshTrigger={refreshTrigger} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    API Features
                  </CardTitle>
                  <CardDescription>
                    What you can do with your API keys
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Tensor Operations</p>
                          <p className="text-sm text-muted-foreground">
                            Perform advanced tensor operations like normalization, clustering, and statistical analysis
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">AI Agent Network</p>
                          <p className="text-sm text-muted-foreground">
                            Access our network of specialized AI agents for data processing and analysis
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Natural Language Queries</p>
                          <p className="text-sm text-muted-foreground">
                            Query your data using natural language and receive structured responses
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Real-time Processing</p>
                          <p className="text-sm text-muted-foreground">
                            Process data in real-time with our scalable infrastructure
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
