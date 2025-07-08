"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles, Info } from "lucide-react"
import type { QueryResult } from "@/types/database"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QueryInterfaceProps {
  onSubmitQuery: (query: string) => void
  isProcessing: boolean
  results: QueryResult[]
}

export function QueryInterface({ onSubmitQuery, isProcessing, results }: QueryInterfaceProps) {
  const [query, setQuery] = useState("")
  const [exampleQueries, setExampleQueries] = useState([
    "Predict sales for the next 30 days based on historical patterns",
    "Find anomalies in the transaction data",
    "Cluster customers into segments based on behavior",
    "What's the correlation between sales and website traffic?",
    "Summarize the key insights from this dataset",
  ])
  const [showGemmaInfo, setShowGemmaInfo] = useState(false)

  // Update example queries based on the latest result
  useEffect(() => {
    if (results.length > 0) {
      const latestResult = results[results.length - 1]
      if (latestResult.visualData?.type === "prediction") {
        setExampleQueries([
          "What factors are driving the predicted trend?",
          "How confident are you in this prediction?",
          "What would happen if marketing spend increased by 20%?",
          "Show me the seasonal patterns in this data",
          "What actions should we take based on this forecast?",
        ])
      } else if (latestResult.visualData?.type === "clustering") {
        setExampleQueries([
          "What are the key characteristics of each cluster?",
          "How can we target marketing to cluster 2?",
          "Which cluster has the highest lifetime value?",
          "How stable are these clusters over time?",
          "What products should we recommend to cluster 3?",
        ])
      } else if (latestResult.visualData?.type === "anomaly") {
        setExampleQueries([
          "What caused these anomalies?",
          "Are these anomalies concerning?",
          "How can we prevent similar anomalies?",
          "Show me the pattern of anomalies over time",
          "Which metrics are most affected by these anomalies?",
        ])
      } else if (latestResult.visualData?.type === "correlation") {
        setExampleQueries([
          "What actions should we take based on these correlations?",
          "Is there causation or just correlation?",
          "Which correlation is most actionable?",
          "How can we leverage the relationship between X and Y?",
          "What other factors might influence these correlations?",
        ])
      }
    }
  }, [results])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      onSubmitQuery(query)
      setQuery("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Natural Query Interface</h3>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setShowGemmaInfo(!showGemmaInfo)}
        >
          <Info className="h-4 w-4" />
          <span>About Gemma-3</span>
        </Button>
      </div>

      {showGemmaInfo && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Gemma-3
              </Badge>
              <div>
                <p>
                  This interface uses Google's Gemma-3 LLM to analyze your tensor data and answer natural language
                  queries. The model processes your questions and provides insights based on the tensor representation
                  of your data.
                </p>
                <p className="mt-2">
                  Sample data has been provided to demonstrate the capabilities of the system. In a production
                  environment, this would connect to your actual data sources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask a question about your data..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          disabled={isProcessing}
        />
        <Button type="submit" disabled={!query.trim() || isProcessing}>
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>

      {results.length === 0 && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Try asking a question about your data using natural language
          </div>

          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((exampleQuery, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setQuery(exampleQuery)}
                disabled={isProcessing}
              >
                {exampleQuery}
              </Button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((result) => (
            <div key={result.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="font-medium">{result.query}</div>
                <div className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleTimeString()}</div>
              </div>
              <div className="flex gap-2 items-start">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">{result.result}</div>
              </div>

              {result.visualData && (
                <div className="h-[300px] mt-4 border-t pt-4">
                  <QueryVisualization data={result.visualData} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Component to visualize query results
function QueryVisualization({ data }: { data: any }) {
  if (!data) return null

  switch (data.type) {
    case "prediction":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" type="category" allowDuplicatedCategory={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              name="Historical"
              data={data.historical.map((value: number, i: number) => ({ index: `Past ${i + 1}`, value }))}
              dataKey="value"
              stroke="#8884d8"
              dot={false}
            />
            <Line
              name="Predicted"
              data={data.predictions.map((value: number, i: number) => ({ index: `Future ${i + 1}`, value }))}
              dataKey="value"
              stroke="#82ca9d"
              strokeDasharray="5 5"
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )

    case "clustering":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Dimension 1" />
            <YAxis type="number" dataKey="y" name="Dimension 2" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter name="Clusters" data={data.data} fill="#8884d8">
              {data.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getClusterColor(entry.cluster)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )

    case "anomaly":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Dimension 1" />
            <YAxis type="number" dataKey="y" name="Dimension 2" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter name="Normal Points" data={data.data.filter((d: any) => !d.isAnomaly)} fill="#8884d8" />
            <Scatter name="Anomalies" data={data.data.filter((d: any) => d.isAnomaly)} fill="#ff0000" />
          </ScatterChart>
        </ResponsiveContainer>
      )

    case "correlation":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.fields.map((field: string, i: number) => {
              const result: Record<string, any> = { name: field }
              data.fields.forEach((f: string, j: number) => {
                result[f] = data.correlations[i][j]
              })
              return result
            })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Legend />
            {data.fields.map((field: string, i: number) => (
              <Bar key={i} dataKey={field} fill={`hsl(${i * 30}, 70%, 50%)`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No visualization available for this query type.</p>
        </div>
      )
  }
}

// Helper function to get color for clusters
function getClusterColor(cluster: number): string {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]
  return colors[cluster % colors.length]
}
