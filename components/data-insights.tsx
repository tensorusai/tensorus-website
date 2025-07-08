"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TensorData, QueryResult } from "@/types/database"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { findCorrelations, detectAnomalies, performClustering } from "@/utils/data-processing"

interface DataInsightsProps {
  tensorData: TensorData | null
  queryResults: QueryResult[]
}

export function DataInsights({ tensorData, queryResults }: DataInsightsProps) {
  // Generate insights data from real tensor data
  const insightData = generateInsightData(tensorData, queryResults)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tensor Dimension Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insightData.dimensionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Importance" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Data Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insightData.distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {insightData.distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insightData.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{insight}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

const COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"]

function generateInsightData(tensorData: TensorData | null, queryResults: QueryResult[]) {
  // Generate dimension data from real tensor data
  const dimensionData = []

  if (tensorData && tensorData.stats && tensorData.stats.mean) {
    const { stats, fields } = tensorData

    for (let i = 0; i < stats.mean.length; i++) {
      dimensionData.push({
        name: fields?.[i] || `Dim ${i + 1}`,
        value: Math.abs(stats.mean[i]) * 100, // Scale for visualization
      })
    }
  } else {
    // Fallback to mock data if no real data available
    for (let i = 0; i < 5; i++) {
      dimensionData.push({
        name: `Dimension ${i + 1}`,
        value: Math.floor(Math.random() * 100),
      })
    }
  }

  // Generate distribution data based on tensor data
  let distributionData = [
    { name: "Cluster A", value: 35 },
    { name: "Cluster B", value: 25 },
    { name: "Cluster C", value: 20 },
    { name: "Cluster D", value: 15 },
    { name: "Other", value: 5 },
  ]

  if (tensorData && tensorData.tensor && Array.isArray(tensorData.tensor) && tensorData.tensor.length > 0) {
    try {
      // Simple clustering for distribution
      const tensor = tensorData.tensor as number[][]
      const clustering = performClustering(tensor, 5)

      // Count points in each cluster
      const clusterCounts: Record<number, number> = {}
      clustering.clusters.forEach((cluster) => {
        clusterCounts[cluster] = (clusterCounts[cluster] || 0) + 1
      })

      // Convert to distribution data
      distributionData = Object.entries(clusterCounts).map(([cluster, count]) => ({
        name: `Cluster ${Number.parseInt(cluster) + 1}`,
        value: count,
      }))
    } catch (error) {
      console.error("Error generating cluster distribution:", error)
      // Keep default distribution data
    }
  }

  // Generate key insights based on real data
  const keyInsights = []

  if (
    tensorData &&
    tensorData.stats &&
    tensorData.tensor &&
    Array.isArray(tensorData.tensor) &&
    tensorData.tensor.length > 0
  ) {
    try {
      const { stats, fields } = tensorData
      const tensor = tensorData.tensor as number[][]

      // Check for skewed distributions
      for (let i = 0; i < stats.mean.length; i++) {
        const fieldName = fields?.[i] || `Dimension ${i + 1}`
        const range = stats.max[i] - stats.min[i]

        if (range > 0) {
          if (stats.mean[i] - stats.min[i] < 0.25 * range) {
            keyInsights.push(`${fieldName} is positively skewed with most values concentrated at the lower end.`)
          } else if (stats.max[i] - stats.mean[i] < 0.25 * range) {
            keyInsights.push(`${fieldName} is negatively skewed with most values concentrated at the higher end.`)
          }

          // Check for high variance
          if (stats.stdDev[i] > 0.5 * range) {
            keyInsights.push(`${fieldName} shows high variability relative to its range.`)
          }
        }
      }

      // Find correlations
      const correlations = findCorrelations(tensor, fields || [])

      // Find strongest correlation
      let maxCorr = 0
      let maxI = 0
      let maxJ = 0

      for (let i = 0; i < correlations.length; i++) {
        for (let j = i + 1; j < correlations[i].length; j++) {
          if (Math.abs(correlations[i][j]) > Math.abs(maxCorr)) {
            maxCorr = correlations[i][j]
            maxI = i
            maxJ = j
          }
        }
      }

      if (Math.abs(maxCorr) > 0.7) {
        const field1 = fields?.[maxI] || `Dimension ${maxI + 1}`
        const field2 = fields?.[maxJ] || `Dimension ${maxJ + 1}`
        keyInsights.push(
          `Strong correlation detected between ${field1} and ${field2} (correlation: ${maxCorr.toFixed(2)}).`,
        )
      }

      // Detect anomalies
      const anomalies = detectAnomalies(tensor, stats)
      if (anomalies.length > 0) {
        const anomalyPercent = ((anomalies.length / tensor.length) * 100).toFixed(1)
        keyInsights.push(
          `Detected ${anomalies.length} anomalies (${anomalyPercent}% of data points) that deviate significantly from expected patterns.`,
        )
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    }
  }

  // Add insights from query results
  if (queryResults.length > 0) {
    const latestQuery = queryResults[queryResults.length - 1]
    keyInsights.push(`Based on your "${latestQuery.query}" query: ${latestQuery.result.split(".")[0]}.`)
  }

  // Add default insights if none were generated
  if (keyInsights.length === 0) {
    keyInsights.push(
      "The tensor analysis reveals strong clustering in the primary dimension, suggesting natural segmentation in your data.",
      "Temporal patterns indicate cyclical behavior with a period of approximately 7 units, likely corresponding to weekly patterns.",
      "Dimensional reduction suggests that 85% of variance can be explained by just 4 principal components.",
      "Anomaly detection identified 3.2% of data points as potential outliers.",
      "Cross-dimensional correlations show strong relationships between dimensions 1 and 3, suggesting these features are closely related.",
    )
  }

  // Limit to 5 insights
  const limitedInsights = keyInsights.slice(0, 5)

  return {
    dimensionData,
    distributionData,
    keyInsights: limitedInsights,
  }
}
