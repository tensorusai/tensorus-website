"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Sparkles,
  MessageSquare,
  Code,
  Zap,
  BarChart,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export function PlatformAgentInteraction() {
  const [activeTab, setActiveTab] = useState("suggestions")
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setShowResult(true)
      }, 1500)
    }
  }

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Brain className="h-4 w-4" />
            <span>AI-Powered Agents</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Intelligent Agent Interaction</h2>
          <p className="text-xl text-muted-foreground">
            Experience how Tensorus agents provide intelligent assistance and automate complex tasks
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Agent Capabilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AgentCapability
                    icon={<MessageSquare className="h-4 w-4" />}
                    title="Intelligent Suggestions"
                    description="Provides context-aware recommendations based on your data and usage patterns"
                  />
                  <AgentCapability
                    icon={<Code className="h-4 w-4" />}
                    title="Automated Code Generation"
                    description="Creates optimized code snippets for common tensor operations and queries"
                  />
                  <AgentCapability
                    icon={<Zap className="h-4 w-4" />}
                    title="Real-time Feedback"
                    description="Offers immediate insights and optimization suggestions as you work"
                  />
                  <AgentCapability
                    icon={<BarChart className="h-4 w-4" />}
                    title="Performance Optimization"
                    description="Continuously monitors and improves database performance based on usage patterns"
                  />
                  <AgentCapability
                    icon={<Brain className="h-4 w-4" />}
                    title="Self-Learning"
                    description="Evolves and improves over time based on interactions and feedback"
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Interactive Demo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="code-gen">Code Generation</TabsTrigger>
                      <TabsTrigger value="optimization">Optimization</TabsTrigger>
                    </TabsList>

                    <TabsContent value="suggestions" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Enter a description of your data or task, and the agent will provide intelligent suggestions.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="E.g., I have customer transaction data with timestamps and amounts"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button type="submit" disabled={isProcessing || !inputValue.trim()} className="w-full">
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Get Suggestions
                            </>
                          )}
                        </Button>
                      </form>

                      {showResult && (
                        <div className="space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-sm">Agent Suggestions</h4>
                          </div>
                          <div className="space-y-2">
                            <SuggestionItem
                              title="Use time-series tensor structure"
                              description="Your transaction data would benefit from a 3D tensor with dimensions [customer, time, features]"
                            />
                            <SuggestionItem
                              title="Apply seasonal decomposition"
                              description="Detect patterns by decomposing your time series data into trend, seasonal, and residual components"
                            />
                            <SuggestionItem
                              title="Create anomaly detection model"
                              description="Identify unusual transactions with tensor-based anomaly detection"
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="code-gen" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Describe what you want to accomplish, and the agent will generate optimized code.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="E.g., Find similar customer profiles based on purchase history"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button type="submit" disabled={isProcessing || !inputValue.trim()} className="w-full">
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Code
                            </>
                          ) : (
                            <>
                              <Code className="mr-2 h-4 w-4" />
                              Generate Code
                            </>
                          )}
                        </Button>
                      </form>

                      {showResult && (
                        <div className="space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-sm">Generated Code</h4>
                          </div>
                          <pre className="text-xs overflow-x-auto font-mono bg-black/10 dark:bg-white/10 p-3 rounded-lg">
                            {`from tensorus import TensorDatabase, TensorProcessor
import numpy as np

# Initialize components
db = TensorDatabase()
processor = TensorProcessor()

# Get customer purchase history tensors
customer_tensors = db.search(
    "metadata.type = 'purchase_history'",
    sort_by="metadata.customer_id"
)

# Function to find similar customers
def find_similar_customers(customer_id, k=5):
    # Get the target customer tensor
    target_tensor, _ = db.get(f"customer_{customer_id}")
    
    # Find similar tensors using cosine similarity
    similar = db.search_similar(
        query_tensor=target_tensor,
        k=k,
        metric="cosine"
    )
    
    return similar

# Example usage
similar_customers = find_similar_customers("C12345", k=5)
print(f"Found {len(similar_customers)} similar customers")`}
                          </pre>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              <CheckCircle2 className="mr-2 h-3 w-3" />
                              Copy Code
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="optimization" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        The agent continuously monitors your database and suggests optimizations.
                      </p>
                      <div className="space-y-4 bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-sm">Performance Insights</h4>
                        </div>
                        <div className="space-y-3">
                          <OptimizationInsight
                            type="warning"
                            title="Index Optimization"
                            description="Your similarity search queries could be 3.5x faster with a HNSW index"
                            recommendation="Switch from flat to HNSW index for high-dimensional tensors"
                          />
                          <OptimizationInsight
                            type="info"
                            title="Storage Efficiency"
                            description="Detected 30% redundancy in image tensor storage"
                            recommendation="Apply dimensionality reduction to compress image tensors"
                          />
                          <OptimizationInsight
                            type="success"
                            title="Query Pattern"
                            description="Identified frequent access pattern for customer tensors"
                            recommendation="Tensors are now pre-cached for 2.8x faster retrieval"
                          />
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button size="sm">
                            <Zap className="mr-2 h-3 w-3" />
                            Apply Recommendations
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface AgentCapabilityProps {
  icon: React.ReactNode
  title: string
  description: string
}

function AgentCapability({ icon, title, description }: AgentCapabilityProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground pl-6">{description}</p>
    </div>
  )
}

interface SuggestionItemProps {
  title: string
  description: string
}

function SuggestionItem({ title, description }: SuggestionItemProps) {
  return (
    <div className="bg-card border rounded-md p-3">
      <h5 className="font-medium text-sm">{title}</h5>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

interface OptimizationInsightProps {
  type: "success" | "warning" | "info"
  title: string
  description: string
  recommendation: string
}

function OptimizationInsight({ type, title, description, recommendation }: OptimizationInsightProps) {
  const iconMap = {
    success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
    info: <Zap className="h-4 w-4 text-blue-500" />,
  }

  const bgColorMap = {
    success: "bg-green-50 dark:bg-green-950/30",
    warning: "bg-amber-50 dark:bg-amber-950/30",
    info: "bg-blue-50 dark:bg-blue-950/30",
  }

  const borderColorMap = {
    success: "border-green-200 dark:border-green-900",
    warning: "border-amber-200 dark:border-amber-900",
    info: "border-blue-200 dark:border-blue-900",
  }

  return (
    <div className={`${bgColorMap[type]} ${borderColorMap[type]} border rounded-md p-3`}>
      <div className="flex items-center gap-2">
        {iconMap[type]}
        <h5 className="font-medium text-sm">{title}</h5>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <Badge variant="outline" className="text-xs">
          Recommendation
        </Badge>
        <span className="text-xs font-medium">{recommendation}</span>
      </div>
    </div>
  )
}
