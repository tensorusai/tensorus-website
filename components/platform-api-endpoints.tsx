"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Search, BarChart, Activity, ArrowRight, Network } from "lucide-react"

export function PlatformApiEndpoints() {
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">API Reference</h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive documentation of Tensorus API endpoints for seamless integration
          </p>
        </motion.div>

        <Tabs defaultValue="datasets" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-[600px]">
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="querying">Querying</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="datasets" className="space-y-8">
            <ApiEndpointCard
              method="POST"
              endpoint="/datasets/create"
              description="Creates a new, empty dataset with the specified unique name"
              icon={<Database className="h-5 w-5" />}
              requestExample={{
                name: "my_image_dataset",
              }}
              responseExample={{
                success: true,
                message: "Dataset created successfully",
                data: {
                  name: "my_image_dataset",
                },
              }}
            />

            <ApiEndpointCard
              method="POST"
              endpoint="/datasets/{name}/ingest"
              description="Ingests a single tensor (provided in JSON format) into the specified dataset"
              icon={<Database className="h-5 w-5" />}
              parameters={[
                { name: "name", type: "string", description: "The name of the target dataset for ingestion" },
              ]}
              requestExample={{
                shape: [2, 3],
                dtype: "float32",
                data: [
                  [1.0, 2.0, 3.0],
                  [4.0, 5.0, 6.0],
                ],
                metadata: {
                  source: "api_ingest",
                  timestamp: 1678886400,
                },
              }}
              responseExample={{
                success: true,
                message: "Tensor ingested successfully",
                data: {
                  record_id: "tensor_20240301_123456_789",
                },
              }}
            />

            <ApiEndpointCard
              method="GET"
              endpoint="/datasets/{name}/fetch"
              description="Retrieves all records (including tensor data and metadata) from a specified dataset"
              icon={<Database className="h-5 w-5" />}
              parameters={[
                { name: "name", type: "string", description: "The name of the dataset to fetch records from" },
              ]}
              responseExample={{
                success: true,
                message: "Dataset fetched successfully",
                data: [
                  {
                    record_id: "tensor_20240301_123456_789",
                    shape: [2, 3],
                    dtype: "float32",
                    data: [
                      [1.0, 2.0, 3.0],
                      [4.0, 5.0, 6.0],
                    ],
                    metadata: {
                      source: "api_ingest",
                      timestamp: 1678886400,
                    },
                  },
                ],
              }}
            />

            <ApiEndpointCard
              method="GET"
              endpoint="/datasets"
              description="Lists the names of all available datasets managed by the TensorStorage"
              icon={<Database className="h-5 w-5" />}
              responseExample={{
                success: true,
                message: "Datasets retrieved successfully",
                data: ["my_image_dataset", "sensor_readings", "embeddings"],
              }}
            />
          </TabsContent>

          <TabsContent value="querying" className="space-y-8">
            <ApiEndpointCard
              method="POST"
              endpoint="/query"
              description="Executes a Natural Query Language (NQL) query against the stored tensor data"
              icon={<Search className="h-5 w-5" />}
              requestExample={{
                query: "find image tensors from 'my_image_dataset' where metadata.source = 'web_scrape'",
              }}
              responseExample={{
                success: true,
                message: "Query executed successfully",
                count: 2,
                results: [
                  {
                    record_id: "tensor_20240301_123456_789",
                    shape: [224, 224, 3],
                    dtype: "float32",
                    data: "[[...tensor data truncated...]]",
                    metadata: {
                      source: "web_scrape",
                      url: "https://example.com/image1.jpg",
                      timestamp: 1678886400,
                    },
                  },
                  {
                    record_id: "tensor_20240301_123456_790",
                    shape: [224, 224, 3],
                    dtype: "float32",
                    data: "[[...tensor data truncated...]]",
                    metadata: {
                      source: "web_scrape",
                      url: "https://example.com/image2.jpg",
                      timestamp: 1678886500,
                    },
                  },
                ],
              }}
            />
          </TabsContent>

          <TabsContent value="agents" className="space-y-8">
            <ApiEndpointCard
              method="GET"
              endpoint="/agents"
              description="Lists all registered agents and their basic information (name, description, status, config)"
              icon={<Network className="h-5 w-5" />}
              responseExample={[
                {
                  id: "ingestion",
                  name: "Data Ingestion Agent",
                  description: "Processes and transforms incoming data into tensor format",
                  status: "running",
                  config: {
                    batch_size: 32,
                    processing_threads: 4,
                  },
                },
                {
                  id: "rl_trainer",
                  name: "Reinforcement Learning Agent",
                  description: "Trains RL models on tensor data",
                  status: "stopped",
                  config: {
                    learning_rate: 0.001,
                    discount_factor: 0.99,
                  },
                },
              ]}
            />

            <ApiEndpointCard
              method="GET"
              endpoint="/agents/{agent_id}/status"
              description="Gets the current status, configuration, and last log timestamp for a specific agent"
              icon={<Network className="h-5 w-5" />}
              parameters={[{ name: "agent_id", type: "string", description: "The unique identifier of the agent" }]}
              responseExample={{
                id: "ingestion",
                name: "Data Ingestion Agent",
                description: "Processes and transforms incoming data into tensor format",
                status: "running",
                config: {
                  batch_size: 32,
                  processing_threads: 4,
                },
                last_log_timestamp: 1678886400,
              }}
            />

            <ApiEndpointCard
              method="POST"
              endpoint="/agents/{agent_id}/start"
              description="Signals an agent to start its operation"
              icon={<Network className="h-5 w-5" />}
              parameters={[
                { name: "agent_id", type: "string", description: "The unique identifier of the agent to start" },
              ]}
              responseExample={{
                success: true,
                message: "Agent started successfully",
              }}
            />

            <ApiEndpointCard
              method="POST"
              endpoint="/agents/{agent_id}/stop"
              description="Signals an agent to stop its operation gracefully"
              icon={<Network className="h-5 w-5" />}
              parameters={[
                { name: "agent_id", type: "string", description: "The unique identifier of the agent to stop" },
              ]}
              responseExample={{
                success: true,
                message: "Agent stopped successfully",
              }}
            />

            <ApiEndpointCard
              method="GET"
              endpoint="/agents/{agent_id}/logs"
              description="Retrieves recent logs for a specific agent"
              icon={<Activity className="h-5 w-5" />}
              parameters={[
                { name: "agent_id", type: "string", description: "The unique identifier of the agent" },
                {
                  name: "lines",
                  type: "integer",
                  description: "Maximum number of recent log lines to retrieve (default: 20)",
                },
              ]}
              responseExample={{
                logs: [
                  "2023-03-15T12:34:56Z [INFO] Agent started",
                  "2023-03-15T12:35:01Z [INFO] Processing batch 1/10",
                  "2023-03-15T12:35:10Z [INFO] Processing batch 2/10",
                ],
              }}
            />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-8">
            <ApiEndpointCard
              method="GET"
              endpoint="/metrics/dashboard"
              description="Provides aggregated dashboard metrics, combining real data with simulated data for agent performance and system health"
              icon={<BarChart className="h-5 w-5" />}
              responseExample={{
                timestamp: 1678886400,
                dataset_count: 3,
                total_records_est: 12500,
                agent_status_summary: {
                  running: 2,
                  stopped: 1,
                  error: 0,
                },
                data_ingestion_rate: 42.5,
                avg_query_latency_ms: 125.3,
                rl_latest_reward: 0.85,
                rl_total_steps: 15000,
                automl_best_score: 0.92,
                automl_trials_completed: 48,
                system_cpu_usage_percent: 65.2,
                system_memory_usage_percent: 78.4,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface ApiEndpointCardProps {
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  description: string
  icon: React.ReactNode
  parameters?: Array<{ name: string; type: string; description: string }>
  requestExample?: any
  responseExample: any
}

function ApiEndpointCard({
  method,
  endpoint,
  description,
  icon,
  parameters,
  requestExample,
  responseExample,
}: ApiEndpointCardProps) {
  const methodColors = {
    GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
              <CardTitle className="text-xl">{endpoint}</CardTitle>
            </div>
            <Badge className={methodColors[method]}>{method}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {parameters && parameters.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Parameters</h4>
                  <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4">
                    <ul className="space-y-2">
                      {parameters.map((param, index) => (
                        <li key={index} className="text-xs">
                          <span className="font-mono text-primary">{param.name}</span>
                          <span className="text-muted-foreground"> ({param.type})</span>
                          <span>: {param.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {requestExample && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Request Example</h4>
                  <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono">
                    {JSON.stringify(requestExample, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Response Example</h4>
              <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono">
                {JSON.stringify(responseExample, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <ArrowRight className="h-3 w-3" />
            <span>Returns</span>
            <Badge variant="outline" className="text-xs">
              application/json
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
