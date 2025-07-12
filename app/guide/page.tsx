import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Cpu, Brain, Search, BarChart, ArrowRight } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { AuthNav } from "@/components/auth-nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Usage Guide | Tensorus",
  description: "Learn how to use the Tensorus agentic tensor database system",
}

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/platform">Platform</Link>
              </Button>
            </div>
            <Button variant="default" asChild>
              <Link href="/developer">Developer Portal</Link>
            </Button>
            <Button asChild className="hidden sm:flex">
              <Link href="/demo">Try Demo</Link>
            </Button>
            <AuthNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Tensorus Usage Guide</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Learn how our innovative system works and how it can transform your data processing capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>What is Tensorus?</CardTitle>
                <CardDescription>Understanding the core concept</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Unlike traditional SQL, NoSQL, and vector databases, Tensorus is an innovative approach that converts
                  all data into tensors (multi-dimensional arrays) and processes them through specialized AI agents.
                </p>
                <p>This approach offers several advantages:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Efficient representation:</span> Tensor data structures can
                    efficiently represent complex, multi-dimensional data.
                  </li>
                  <li>
                    <span className="font-medium">AI-native processing:</span> Tensors are the native format for machine
                    learning models, enabling seamless integration with AI systems.
                  </li>
                  <li>
                    <span className="font-medium">Collaborative intelligence:</span> Specialized AI agents work together
                    to process, analyze, and learn from your data.
                  </li>
                  <li>
                    <span className="font-medium">Continuous learning:</span> The system evolves and improves as it
                    processes more data over time.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Agent Network</CardTitle>
                <CardDescription>Understanding the collaborative AI system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Tensorus is powered by a network of specialized AI agents, each with a specific role in the data
                  processing pipeline:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Data Ingestion Agent:</span> Processes and validates incoming data
                    files, preparing them for tensor transformation.
                  </li>
                  <li>
                    <span className="font-medium">Tensor Transformation Agent:</span> Converts data into optimal tensor
                    representations based on the data's characteristics.
                  </li>
                  <li>
                    <span className="font-medium">Operation Learning Agent:</span> Learns and optimizes tensor
                    operations based on usage patterns and data characteristics.
                  </li>
                  <li>
                    <span className="font-medium">Query Processing Agent:</span> Interprets natural language queries and
                    translates them into tensor operations.
                  </li>
                  <li>
                    <span className="font-medium">Orchestration Agent:</span> Coordinates all agent activities and
                    ensures efficient collaboration.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-6">How to Use the System</h2>

          <div className="space-y-8 mb-12">
            <WorkflowStep
              number={1}
              title="Upload Your Data"
              description="Upload your data files with descriptions to help the agents understand the context and content of your data."
              icon={<Upload className="h-8 w-8" />}
            >
              <div className="space-y-4">
                <p>
                  Start by navigating to the <strong>Data Upload</strong> tab in the dashboard. You can upload various
                  types of data:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tabular data (CSV, Excel)</li>
                  <li>JSON data</li>
                  <li>Text corpus</li>
                  <li>Image datasets</li>
                  <li>Time series data</li>
                </ul>
                <p>
                  <strong>Important:</strong> Include a detailed description of your data to help the agents understand
                  its context, structure, and meaning. The more information you provide, the better the system can
                  optimize the tensor representation.
                </p>
              </div>
            </WorkflowStep>

            <WorkflowStep
              number={2}
              title="Tensor Transformation"
              description="The system automatically converts your data into the most appropriate tensor representation."
              icon={<Cpu className="h-8 w-8" />}
            >
              <div className="space-y-4">
                <p>
                  After uploading, the Tensor Transformation Agent analyzes your data and converts it into an optimal
                  tensor representation. This process involves:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Determining the appropriate dimensionality</li>
                  <li>Selecting the optimal tensor structure</li>
                  <li>Applying appropriate transformations</li>
                  <li>Optimizing for sparsity and efficiency</li>
                </ul>
                <p>
                  You can view the transformation results in the <strong>Tensor Visualization</strong> tab, which
                  provides interactive visualizations of your tensor data.
                </p>
              </div>
            </WorkflowStep>

            <WorkflowStep
              number={3}
              title="Agent Learning"
              description="The agents learn various tensor operations based on your data characteristics."
              icon={<Brain className="h-8 w-8" />}
            >
              <div className="space-y-4">
                <p>
                  The Operation Learning Agent continuously learns and optimizes tensor operations for your specific
                  data. These operations include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Indexing and retrieval strategies</li>
                  <li>Regression and classification models</li>
                  <li>Clustering and dimensionality reduction</li>
                  <li>Anomaly detection algorithms</li>
                  <li>Time series forecasting methods</li>
                </ul>
                <p>
                  You can monitor agent activities and learning progress in the <strong>Agent Network</strong> tab.
                </p>
              </div>
            </WorkflowStep>

            <WorkflowStep
              number={4}
              title="Query Your Data"
              description="Use natural language to ask questions about your data and receive insights."
              icon={<Search className="h-8 w-8" />}
            >
              <div className="space-y-4">
                <p>
                  In the <strong>Query Interface</strong> tab, you can interact with your data using natural language
                  instead of complex query languages. Example queries include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>"Predict sales for the next 30 days based on historical patterns"</li>
                  <li>"Find anomalies in the transaction data"</li>
                  <li>"Cluster customers into segments based on behavior"</li>
                  <li>"What's the correlation between price and demand?"</li>
                  <li>"Summarize the key insights from this dataset"</li>
                </ul>
                <p>
                  The Query Processing Agent interprets your natural language query and translates it into appropriate
                  tensor operations.
                </p>
              </div>
            </WorkflowStep>

            <WorkflowStep
              number={5}
              title="Explore Insights"
              description="Review automatically generated insights and visualizations derived from your tensor data."
              icon={<BarChart className="h-8 w-8" />}
            >
              <div className="space-y-4">
                <p>
                  The <strong>Data Insights</strong> tab provides automatically generated visualizations and insights
                  derived from your tensor data, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Dimension analysis charts</li>
                  <li>Data distribution visualizations</li>
                  <li>Key insights extracted from tensor operations</li>
                  <li>Query result summaries</li>
                  <li>Anomaly detection results</li>
                </ul>
                <p>
                  These insights help you understand your data better and make informed decisions based on the tensor
                  analysis.
                </p>
              </div>
            </WorkflowStep>
          </div>

          <div className="bg-primary/10 border rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  The system becomes more intelligent over time as it processes more data and learns from user
                  interactions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Multi-Modal Data Support</h3>
                <p className="text-muted-foreground">
                  Process and analyze different types of data (text, images, time series) within the same tensor
                  framework.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Tensor Operations API</h3>
                <p className="text-muted-foreground">
                  Advanced users can directly access tensor operations through a programmatic API.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Lake Integration</h3>
                <p className="text-muted-foreground">
                  Scale to data lake levels with distributed tensor processing capabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Try our interactive demo to experience the power of Tensorus firsthand.
            </p>
            <Button asChild size="lg">
              <Link href="/demo" className="flex items-center gap-2">
                <span>Try the Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface WorkflowStepProps {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}

function WorkflowStep({ number, title, description, icon, children }: WorkflowStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <div className="h-full w-0.5 bg-border mt-4 hidden md:block"></div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {number}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
