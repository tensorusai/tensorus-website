"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Server, Cpu, Brain, ArrowRight, ArrowDown, FileJson, Search, BarChart } from "lucide-react"

export function PlatformArchitectureVisual() {
  const [activeFlow, setActiveFlow] = useState<string | null>(null)

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">System Architecture & Flow</h2>
          <p className="text-xl text-muted-foreground">
            Visual representation of how Tensorus processes requests and delivers results
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-[500px]">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="execution">Execution Flow</TabsTrigger>
              <TabsTrigger value="interaction">Component Interaction</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-xl p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                  <h3 className="text-lg font-medium mb-4 text-center">Tensorus Architecture Overview</h3>
                  <div className="relative">
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 overflow-x-auto">
                      <div className="min-w-[800px] h-[400px] relative">
                        {/* Client Layer */}
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                          <ArchitectureBox
                            title="Client Applications"
                            icon={<FileJson className="h-4 w-4" />}
                            items={["Web UI", "Python SDK", "REST API Clients"]}
                            color="bg-blue-100 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900"
                            isActive={activeFlow === "client"}
                            onClick={() => setActiveFlow(activeFlow === "client" ? null : "client")}
                          />
                        </div>

                        {/* API Layer */}
                        <div className="absolute top-[100px] left-0 right-0 flex justify-center">
                          <ArchitectureBox
                            title="API Layer"
                            icon={<Server className="h-4 w-4" />}
                            items={["REST Endpoints", "Authentication", "Request Validation"]}
                            color="bg-green-100 dark:bg-green-950/50 border-green-200 dark:border-green-900"
                            isActive={activeFlow === "api"}
                            onClick={() => setActiveFlow(activeFlow === "api" ? null : "api")}
                          />
                        </div>

                        {/* Core Services */}
                        <div className="absolute top-[200px] left-0 right-0 flex justify-center gap-4">
                          <ArchitectureBox
                            title="Core Services"
                            icon={<Database className="h-4 w-4" />}
                            items={["Tensor Storage", "Indexing", "Query Processing"]}
                            color="bg-purple-100 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900"
                            isActive={activeFlow === "core"}
                            onClick={() => setActiveFlow(activeFlow === "core" ? null : "core")}
                            width="w-[200px]"
                          />
                          <ArchitectureBox
                            title="Agent System"
                            icon={<Brain className="h-4 w-4" />}
                            items={["Learning", "Optimization", "Suggestions"]}
                            color="bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900"
                            isActive={activeFlow === "agent"}
                            onClick={() => setActiveFlow(activeFlow === "agent" ? null : "agent")}
                            width="w-[200px]"
                          />
                        </div>

                        {/* Infrastructure Layer */}
                        <div className="absolute top-[300px] left-0 right-0 flex justify-center">
                          <ArchitectureBox
                            title="Infrastructure"
                            icon={<Cpu className="h-4 w-4" />}
                            items={["Storage", "Compute", "GPU Acceleration", "Distributed Processing"]}
                            color="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            isActive={activeFlow === "infra"}
                            onClick={() => setActiveFlow(activeFlow === "infra" ? null : "infra")}
                            width="w-[500px]"
                          />
                        </div>

                        {/* Connection Lines */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Client to API */}
                          <line
                            x1="400"
                            y1="50"
                            x2="400"
                            y2="100"
                            stroke="rgba(100, 116, 139, 0.5)"
                            strokeWidth="2"
                            strokeDasharray={activeFlow === "client" ? "0" : "5,5"}
                          />

                          {/* API to Core Services */}
                          <line
                            x1="400"
                            y1="150"
                            x2="300"
                            y2="200"
                            stroke="rgba(100, 116, 139, 0.5)"
                            strokeWidth="2"
                            strokeDasharray={activeFlow === "api" ? "0" : "5,5"}
                          />
                          <line
                            x1="400"
                            y1="150"
                            x2="500"
                            y2="200"
                            stroke="rgba(100, 116, 139, 0.5)"
                            strokeWidth="2"
                            strokeDasharray={activeFlow === "api" ? "0" : "5,5"}
                          />

                          {/* Core Services to Infrastructure */}
                          <line
                            x1="300"
                            y1="250"
                            x2="400"
                            y2="300"
                            stroke="rgba(100, 116, 139, 0.5)"
                            strokeWidth="2"
                            strokeDasharray={activeFlow === "core" ? "0" : "5,5"}
                          />
                          <line
                            x1="500"
                            y1="250"
                            x2="400"
                            y2="300"
                            stroke="rgba(100, 116, 139, 0.5)"
                            strokeWidth="2"
                            strokeDasharray={activeFlow === "agent" ? "0" : "5,5"}
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Flow Description */}
                    {activeFlow && (
                      <div className="mt-4 bg-card border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">
                          {activeFlow === "client" && "Client Application Flow"}
                          {activeFlow === "api" && "API Layer Processing"}
                          {activeFlow === "core" && "Core Services Operations"}
                          {activeFlow === "agent" && "Agent System Intelligence"}
                          {activeFlow === "infra" && "Infrastructure Layer"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activeFlow === "client" &&
                            "Client applications interact with Tensorus through REST API calls, Python SDK methods, or direct web interface. They send requests for tensor operations and receive processed results."}
                          {activeFlow === "api" &&
                            "The API layer authenticates requests, validates input parameters, routes to appropriate services, and formats responses. It provides a unified interface for all Tensorus capabilities."}
                          {activeFlow === "core" &&
                            "Core services handle tensor storage, indexing, and query processing. They manage the fundamental operations like saving, retrieving, and searching tensors with optimized algorithms."}
                          {activeFlow === "agent" &&
                            "The agent system continuously monitors usage patterns, learns from interactions, and optimizes database performance. It provides intelligent suggestions and automates complex tasks."}
                          {activeFlow === "infra" &&
                            "The infrastructure layer provides the computational resources, storage systems, and acceleration capabilities that power Tensorus. It includes distributed processing for scalability."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="execution">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-xl p-8 shadow-sm"
            >
              <h3 className="text-lg font-medium mb-6 text-center">Request Execution Flow</h3>

              <div className="relative max-w-3xl mx-auto">
                <div className="space-y-8">
                  <ExecutionStep
                    number={1}
                    title="Client Request"
                    description="Client sends a request to the Tensorus API"
                    code={`// Python SDK example
from tensorus import TensorDatabase
db = TensorDatabase()
result = db.search_similar(query_tensor, k=5)`}
                    icon={<FileJson className="h-5 w-5" />}
                  />

                  <ExecutionStep
                    number={2}
                    title="API Processing"
                    description="API layer authenticates, validates, and routes the request"
                    code={`// Internal API processing
validateRequest(request)
authenticateUser(request.token)
routeToService(request)`}
                    icon={<Server className="h-5 w-5" />}
                  />

                  <ExecutionStep
                    number={3}
                    title="Agent Optimization"
                    description="Agents analyze the request and optimize execution"
                    code={`// Agent optimization
const executionPlan = optimizeQuery(request)
const indexType = selectOptimalIndex(request.tensor)
const resources = allocateResources(executionPlan)`}
                    icon={<Brain className="h-5 w-5" />}
                  />

                  <ExecutionStep
                    number={4}
                    title="Core Processing"
                    description="Core services execute the optimized request"
                    code={`// Core processing
const results = searchIndex(
  indexType,
  request.tensor,
  request.k,
  request.metric
)`}
                    icon={<Search className="h-5 w-5" />}
                  />

                  <ExecutionStep
                    number={5}
                    title="Result Formatting"
                    description="Results are formatted and returned to the client"
                    code={`// Result formatting
return {
  results: formatResults(results),
  metadata: generateMetadata(results),
  execution_time: timer.elapsed()
}`}
                    icon={<BarChart className="h-5 w-5" />}
                  />
                </div>

                {/* Connecting Line */}
                <div className="absolute left-[39px] top-[80px] bottom-[80px] w-0.5 bg-border"></div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="interaction">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-xl p-8 shadow-sm"
            >
              <h3 className="text-lg font-medium mb-6 text-center">Component Interaction</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span>Data Storage Flow</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <InteractionStep
                        from="Client"
                        to="API Layer"
                        description="Client sends tensor data with metadata"
                      />
                      <InteractionStep
                        from="API Layer"
                        to="Validation Service"
                        description="API validates tensor format and metadata"
                      />
                      <InteractionStep
                        from="Validation Service"
                        to="Agent System"
                        description="Agents analyze and optimize tensor structure"
                      />
                      <InteractionStep
                        from="Agent System"
                        to="Storage Service"
                        description="Optimized tensor is stored with indexing"
                      />
                      <InteractionStep
                        from="Storage Service"
                        to="Client"
                        description="Storage confirmation and tensor ID returned"
                        isLast
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      <span>Query Processing Flow</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <InteractionStep from="Client" to="API Layer" description="Client sends query request" />
                      <InteractionStep
                        from="API Layer"
                        to="Query Parser"
                        description="API parses and validates the query"
                      />
                      <InteractionStep
                        from="Query Parser"
                        to="Agent System"
                        description="Agents optimize query execution plan"
                      />
                      <InteractionStep
                        from="Agent System"
                        to="Query Executor"
                        description="Optimized query is executed against indices"
                      />
                      <InteractionStep
                        from="Query Executor"
                        to="Client"
                        description="Results are formatted and returned"
                        isLast
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface ArchitectureBoxProps {
  title: string
  icon: React.ReactNode
  items: string[]
  color: string
  isActive: boolean
  onClick: () => void
  width?: string
}

function ArchitectureBox({ title, icon, items, color, isActive, onClick, width = "w-[300px]" }: ArchitectureBoxProps) {
  return (
    <div
      className={`${width} ${color} border rounded-lg p-3 cursor-pointer transition-all duration-200 ${isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <ul className="text-xs space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-foreground/70"></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface ExecutionStepProps {
  number: number
  title: string
  description: string
  code: string
  icon: React.ReactNode
}

function ExecutionStep({ number, title, description, code, icon }: ExecutionStepProps) {
  return (
    <div className="flex gap-6">
      <div className="flex-none">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-card border flex items-center justify-center">{icon}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            Step {number}
          </Badge>
          <h4 className="font-medium">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono">{code}</pre>
      </div>
    </div>
  )
}

interface InteractionStepProps {
  from: string
  to: string
  description: string
  isLast?: boolean
}

function InteractionStep({ from, to, description, isLast = false }: InteractionStepProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <Badge variant="outline" className="text-xs">
          {from}
        </Badge>
        <div className="flex-1 mx-2 flex items-center justify-center">
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
        </div>
        <Badge variant="outline" className="text-xs">
          {to}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>

      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full flex flex-col items-center">
          <ArrowDown className="h-3 w-3 text-muted-foreground my-1" />
        </div>
      )}
    </div>
  )
}
