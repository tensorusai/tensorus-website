"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataUpload } from "@/components/data-upload"
import { TensorVisualization } from "@/components/tensor-visualization"
import { AgentNetwork } from "@/components/agent-network"
import { QueryInterface } from "@/components/query-interface"
import { DataInsights } from "@/components/data-insights"
import { useToast } from "@/hooks/use-toast"
import type { DataFile, TensorData, AgentMessage, QueryResult } from "@/types/database"
import { Upload, Layers, Network, Search, BarChart2 } from "lucide-react"
import {
  convertToTensor,
  detectAnomalies,
  findCorrelations,
  performClustering,
  predictFutureValues,
} from "@/utils/data-processing"
import { queryGemma } from "@/utils/ai-service"

export default function Dashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upload")
  const [dataFiles, setDataFiles] = useState<DataFile[]>([])
  const [tensorData, setTensorData] = useState<TensorData | null>(null)
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawData, setRawData] = useState<any>(null)

  const handleFileUpload = async (file: DataFile, parsedContent: any) => {
    setIsProcessing(true)
    setRawData(parsedContent)

    // Add the file to our list
    setDataFiles([...dataFiles, file])

    // Add agent message
    const newMessage: AgentMessage = {
      id: Date.now().toString(),
      agent: "Data Ingestion Agent",
      message: `Received new file: ${file.name}. Beginning analysis...`,
      timestamp: new Date().toISOString(),
    }
    setAgentMessages([...agentMessages, newMessage])

    // Process the data with a small delay to show the agent working
    setTimeout(async () => {
      const transformMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        agent: "Tensor Transformation Agent",
        message: `Analyzing data structure and converting to optimal tensor representation...`,
        timestamp: new Date().toISOString(),
      }
      setAgentMessages((prev) => [...prev, transformMessage])

      try {
        // Convert the parsed data to tensor format
        const tensorData = convertToTensor(parsedContent)

        // Add AI analysis message
        const aiPrompt = `Analyze this dataset with ${parsedContent.headers.join(", ")} columns and ${parsedContent.data.length} rows. Identify key patterns and insights.`
        const aiResponse = await queryGemma(aiPrompt)

        const aiMessage: AgentMessage = {
          id: (Date.now() + 2).toString(),
          agent: "AI Analysis Agent",
          message: `Initial data analysis: ${aiResponse.substring(0, 150)}...`,
          timestamp: new Date().toISOString(),
        }
        setAgentMessages((prev) => [...prev, aiMessage])

        setTimeout(() => {
          setTensorData(tensorData)

          const completeMessage: AgentMessage = {
            id: (Date.now() + 3).toString(),
            agent: "Orchestration Agent",
            message: `Tensor transformation complete. Data indexed and ready for queries.`,
            timestamp: new Date().toISOString(),
          }
          setAgentMessages((prev) => [...prev, completeMessage])

          setIsProcessing(false)
          setActiveTab("visualization")

          toast({
            title: "Data Processing Complete",
            description: "Your data has been transformed into tensor format and is ready for querying.",
          })
        }, 1000)
      } catch (error) {
        console.error("Error converting to tensor:", error)

        const errorMessage: AgentMessage = {
          id: (Date.now() + 2).toString(),
          agent: "Error Handling Agent",
          message: `Error processing data: ${(error as Error).message}. Please try a different file or format.`,
          timestamp: new Date().toISOString(),
        }
        setAgentMessages((prev) => [...prev, errorMessage])

        setIsProcessing(false)

        toast({
          title: "Processing Error",
          description: "There was an error processing your data. Please try a different file.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleQuery = async (query: string) => {
    if (!tensorData) return

    setIsProcessing(true)

    // Add agent message
    const newMessage: AgentMessage = {
      id: Date.now().toString(),
      agent: "Query Processing Agent",
      message: `Processing query: "${query}"`,
      timestamp: new Date().toISOString(),
    }
    setAgentMessages([...agentMessages, newMessage])

    // Process the query with a small delay to show the agent working
    setTimeout(async () => {
      try {
        // Determine query type and process accordingly
        let result = ""
        let visualData = null

        const queryLower = query.toLowerCase()

        if (queryLower.includes("predict") || queryLower.includes("forecast")) {
          // Find the field to predict
          let fieldIndex = 0 // Default to first field
          const fields = tensorData.fields || []

          for (let i = 0; i < fields.length; i++) {
            const field = fields[i].toLowerCase()
            if (queryLower.includes(field)) {
              fieldIndex = i
              break
            }
          }

          // Perform prediction
          const prediction = predictFutureValues(tensorData.tensor as number[][], fieldIndex)

          // Prepare visualization data
          visualData = {
            type: "prediction",
            field: tensorData.fields?.[fieldIndex] || `Field ${fieldIndex}`,
            historical: prediction.historical,
            predictions: prediction.predictions,
          }

          // Get AI explanation
          const aiPrompt = `Explain a forecast for ${tensorData.fields?.[fieldIndex] || "the selected metric"} showing a ${prediction.slope > 0 ? "positive" : "negative"} trend. The data has ${prediction.historical.length} historical points and we're predicting ${prediction.predictions.length} periods ahead.`
          result = await queryGemma(aiPrompt)
        } else if (queryLower.includes("cluster") || queryLower.includes("segment")) {
          // Perform clustering
          const clustering = performClustering(tensorData.tensor as number[][], 4)

          // Prepare visualization data
          visualData = {
            type: "clustering",
            clusters: clustering.clusters,
            data: (tensorData.tensor as number[][]).map((point, i) => ({
              x: point[0],
              y: point.length > 1 ? point[1] : 0,
              cluster: clustering.clusters[i],
            })),
          }

          // Get AI explanation
          const aiPrompt = `Explain the results of clustering this dataset into ${clustering.centroids.length} segments. The data has ${tensorData.fields?.length || "multiple"} dimensions including ${tensorData.fields?.slice(0, 3).join(", ") || "various metrics"}.`
          result = await queryGemma(aiPrompt)
        } else if (queryLower.includes("anomaly") || queryLower.includes("outlier")) {
          // Detect anomalies
          const anomalies = detectAnomalies(tensorData.tensor as number[][], tensorData.stats)

          // Prepare visualization data
          visualData = {
            type: "anomaly",
            anomalies: anomalies.map((a) => a.index),
            data: (tensorData.tensor as number[][]).map((point, i) => ({
              x: point[0],
              y: point.length > 1 ? point[1] : 0,
              isAnomaly: anomalies.some((a) => a.index === i),
            })),
          }

          // Get AI explanation
          const aiPrompt = `Explain the ${anomalies.length} anomalies detected in this dataset of ${(tensorData.tensor as number[][]).length} points. The anomalies were detected using z-score method with dimensions including ${tensorData.fields?.slice(0, 3).join(", ") || "various metrics"}.`
          result = await queryGemma(aiPrompt)
        } else if (queryLower.includes("correlation") || queryLower.includes("relationship")) {
          // Find correlations
          const correlations = findCorrelations(tensorData.tensor as number[][], tensorData.fields || [])

          // Prepare visualization data
          visualData = {
            type: "correlation",
            correlations,
            fields: tensorData.fields || [],
          }

          // Get AI explanation
          const aiPrompt = `Explain the correlations between variables in this dataset with ${tensorData.fields?.length || "multiple"} dimensions including ${tensorData.fields?.slice(0, 3).join(", ") || "various metrics"}. Focus on the strongest relationships.`
          result = await queryGemma(aiPrompt)
        } else {
          // General query - use AI to generate response
          const aiPrompt = `Analyze this tensor data with ${tensorData.dimensions} dimensions and shape [${tensorData.shape.join(", ")}]. The user is asking: "${query}". Provide insights based on typical patterns in such data.`
          result = await queryGemma(aiPrompt)
        }

        // Create query result
        const queryResult: QueryResult = {
          id: Date.now().toString(),
          query,
          result,
          timestamp: new Date().toISOString(),
          visualData,
        }

        setQueryResults([...queryResults, queryResult])

        const completeMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          agent: "Operation Learning Agent",
          message: `Query processed. Learning from this operation to improve future performance.`,
          timestamp: new Date().toISOString(),
        }
        setAgentMessages((prev) => [...prev, completeMessage])

        setIsProcessing(false)

        toast({
          title: "Query Processed",
          description: "Your query has been processed successfully.",
        })
      } catch (error) {
        console.error("Error processing query:", error)

        const errorMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          agent: "Error Handling Agent",
          message: `Error processing query: ${(error as Error).message}. Please try a different query.`,
          timestamp: new Date().toISOString(),
        }
        setAgentMessages((prev) => [...prev, errorMessage])

        setIsProcessing(false)

        toast({
          title: "Query Error",
          description: "There was an error processing your query. Please try a different approach.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  return (
    <div className="flex-1 container mx-auto py-6 space-y-8">
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="px-6 pt-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="upload" className="rounded-md">
                <div className="flex flex-col items-center py-1 gap-1">
                  <Upload className="h-4 w-4" />
                  <span>Data Upload</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="visualization" disabled={!tensorData} className="rounded-md">
                <div className="flex flex-col items-center py-1 gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Visualization</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="agents" className="rounded-md">
                <div className="flex flex-col items-center py-1 gap-1">
                  <Network className="h-4 w-4" />
                  <span>Agent Network</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="query" disabled={!tensorData} className="rounded-md">
                <div className="flex flex-col items-center py-1 gap-1">
                  <Search className="h-4 w-4" />
                  <span>Query Interface</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="insights" disabled={queryResults.length === 0} className="rounded-md">
                <div className="flex flex-col items-center py-1 gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>Data Insights</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
                <CardDescription>
                  Upload your data files with descriptions to begin the tensor transformation process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataUpload onUpload={handleFileUpload} isProcessing={isProcessing} existingFiles={dataFiles} />
              </CardContent>
            </Card>

            {agentMessages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Agent Activity</CardTitle>
                  <CardDescription>Real-time updates from the agent network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {agentMessages.map((message) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-semibold text-primary">{message.agent}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-2">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Tensor Visualization</CardTitle>
                <CardDescription>
                  Visual representation of how your data has been transformed into tensors
                </CardDescription>
              </CardHeader>
              <CardContent>{tensorData && <TensorVisualization data={tensorData} rawData={rawData} />}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Network</CardTitle>
                <CardDescription>Visualization of the collaborative AI agent network</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentNetwork messages={agentMessages} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Natural Query Language Interface</CardTitle>
                <CardDescription>Ask questions about your data using natural language</CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInterface onSubmitQuery={handleQuery} isProcessing={isProcessing} results={queryResults} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Data Insights</CardTitle>
                <CardDescription>Automated insights and visualizations derived from your tensor data</CardDescription>
              </CardHeader>
              <CardContent>
                <DataInsights tensorData={tensorData} queryResults={queryResults} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
