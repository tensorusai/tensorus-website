import type { TensorData } from "@/types/database"

// Data parsing utilities
export async function parseFileContent(file: File, fileType: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result
        if (!content) {
          reject(new Error("Failed to read file"))
          return
        }

        switch (fileType) {
          case "tabular":
            resolve(parseCSV(content as string))
            break
          case "json":
            resolve(parseJSON(content as string))
            break
          case "text":
            resolve(parseText(content as string))
            break
          case "time-series":
            resolve(parseTimeSeries(content as string))
            break
          default:
            resolve(parseCSV(content as string))
        }
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    if (fileType === "json") {
      reader.readAsText(file)
    } else {
      reader.readAsText(file)
    }
  })
}

// Parse CSV data
export function parseCSV(content: string) {
  const lines = content.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  const data = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      // Handle quoted values with commas inside
      const values: string[] = []
      let inQuotes = false
      let currentValue = ""

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(currentValue)
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      // Add the last value
      values.push(currentValue)

      // Create object from headers and values
      const row: Record<string, any> = {}
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, "") || ""

        // Try to convert to number if possible
        const numValue = Number(value)
        row[header] = isNaN(numValue) ? value : numValue
      })

      return row
    })

  return { headers, data }
}

// Parse JSON data
function parseJSON(content: string) {
  const data = JSON.parse(content)

  if (Array.isArray(data)) {
    // Extract headers from the first object
    const headers = Object.keys(data[0] || {})
    return { headers, data }
  }

  // Handle nested JSON
  return { headers: ["data"], data: [data] }
}

// Parse text data
function parseText(content: string) {
  const lines = content.split("\n").filter((line) => line.trim() !== "")
  return {
    headers: ["text"],
    data: lines.map((line) => ({ text: line })),
  }
}

// Parse time series data
function parseTimeSeries(content: string) {
  // Assume CSV with first column as timestamp
  return parseCSV(content)
}

// Convert parsed data to tensor format
export function convertToTensor(parsedData: any): TensorData {
  const { headers, data } = parsedData

  // Filter only numeric columns for tensor conversion
  const numericHeaders = headers.filter((header: string) => typeof data[0][header] === "number")

  // Extract numeric data
  const numericData = data.map((row: any) => numericHeaders.map((header: string) => row[header]))

  // Calculate statistics
  const stats = calculateStatistics(numericData, numericHeaders)

  // Determine dimensions and shape
  const dimensions = 2 // 2D tensor for tabular data
  const shape = [data.length, numericHeaders.length]

  // Calculate sparsity (percentage of zero values)
  const sparsity = calculateSparsity(numericData)

  return {
    id: Date.now().toString(),
    originalFile: "uploaded_file.csv",
    dimensions,
    shape,
    dataType: "float32",
    sparsity,
    transformationMethod: "Direct Mapping",
    timestamp: new Date().toISOString(),
    tensor: numericData,
    fields: numericHeaders,
    stats,
  }
}

// Calculate basic statistics for the data
function calculateStatistics(data: number[][], fields: string[]) {
  const columns = data[0].length
  const min = Array(columns).fill(Number.POSITIVE_INFINITY)
  const max = Array(columns).fill(Number.NEGATIVE_INFINITY)
  const sum = Array(columns).fill(0)
  const sumSquared = Array(columns).fill(0)

  // Calculate min, max, and sums
  for (const row of data) {
    for (let i = 0; i < columns; i++) {
      if (row[i] < min[i]) min[i] = row[i]
      if (row[i] > max[i]) max[i] = row[i]
      sum[i] += row[i]
      sumSquared[i] += row[i] * row[i]
    }
  }

  // Calculate mean and standard deviation
  const n = data.length
  const mean = sum.map((s) => s / n)
  const variance = sumSquared.map((s, i) => s / n - mean[i] * mean[i])
  const stdDev = variance.map((v) => Math.sqrt(Math.max(0, v)))

  return { min, max, mean, stdDev, fields }
}

// Calculate sparsity (percentage of zero values)
function calculateSparsity(data: number[][]) {
  let zeros = 0
  let total = 0

  for (const row of data) {
    for (const value of row) {
      if (value === 0) zeros++
      total++
    }
  }

  return total === 0 ? 0 : zeros / total
}

// Find correlations between features
export function findCorrelations(data: number[][], fields: string[]) {
  const n = fields.length
  const correlations = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    correlations[i][i] = 1 // Self-correlation

    for (let j = i + 1; j < n; j++) {
      // Extract columns
      const col1 = data.map((row) => row[i])
      const col2 = data.map((row) => row[j])

      // Calculate Pearson correlation
      const correlation = calculatePearsonCorrelation(col1, col2)

      correlations[i][j] = correlation
      correlations[j][i] = correlation // Symmetric
    }
  }

  return correlations
}

// Calculate Pearson correlation coefficient
function calculatePearsonCorrelation(x: number[], y: number[]) {
  const n = x.length

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n
  const meanY = y.reduce((sum, val) => sum + val, 0) / n

  // Calculate covariance and variances
  let covariance = 0
  let varX = 0
  let varY = 0

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX
    const diffY = y[i] - meanY

    covariance += diffX * diffY
    varX += diffX * diffX
    varY += diffY * diffY
  }

  // Calculate correlation
  if (varX === 0 || varY === 0) return 0
  return covariance / (Math.sqrt(varX) * Math.sqrt(varY))
}

// Detect anomalies using Z-score method
export function detectAnomalies(data: number[][], stats: any) {
  const anomalies = []
  const threshold = 3 // Z-score threshold for anomalies

  for (let i = 0; i < data.length; i++) {
    let isAnomaly = false
    const anomalyFeatures = []

    for (let j = 0; j < data[i].length; j++) {
      const zScore = Math.abs((data[i][j] - stats.mean[j]) / stats.stdDev[j])

      if (zScore > threshold) {
        isAnomaly = true
        anomalyFeatures.push(stats.fields[j])
      }
    }

    if (isAnomaly) {
      anomalies.push({
        index: i,
        features: anomalyFeatures,
      })
    }
  }

  return anomalies
}

// Perform simple clustering using k-means
export function performClustering(data: number[][], k = 3) {
  // Normalize data for better clustering
  const normalizedData = normalizeData(data)

  // Initialize centroids randomly
  const centroids = initializeCentroids(normalizedData, k)

  // Assign points to clusters
  let clusters = assignToClusters(normalizedData, centroids)
  let oldClusters: number[] = []
  let iterations = 0
  const maxIterations = 10

  // Iterate until convergence or max iterations
  while (!arraysEqual(clusters, oldClusters) && iterations < maxIterations) {
    oldClusters = [...clusters]

    // Update centroids
    updateCentroids(normalizedData, clusters, centroids, k)

    // Reassign clusters
    clusters = assignToClusters(normalizedData, centroids)

    iterations++
  }

  return {
    clusters,
    centroids,
    iterations,
  }
}

// Normalize data to [0,1] range
function normalizeData(data: number[][]) {
  const cols = data[0].length

  // Find min and max for each column
  const min = Array(cols).fill(Number.POSITIVE_INFINITY)
  const max = Array(cols).fill(Number.NEGATIVE_INFINITY)

  for (const row of data) {
    for (let j = 0; j < cols; j++) {
      if (row[j] < min[j]) min[j] = row[j]
      if (row[j] > max[j]) max[j] = row[j]
    }
  }

  // Normalize
  return data.map((row) =>
    row.map((val, j) => {
      const range = max[j] - min[j]
      return range === 0 ? 0 : (val - min[j]) / range
    }),
  )
}

// Initialize centroids using k-means++ method
function initializeCentroids(data: number[][], k: number) {
  const centroids: number[][] = []
  const n = data.length
  const cols = data[0].length

  // Choose first centroid randomly
  const firstIndex = Math.floor(Math.random() * n)
  centroids.push([...data[firstIndex]])

  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances = data.map((point) => {
      // Find minimum distance to any existing centroid
      const minDist = Math.min(...centroids.map((centroid) => euclideanDistance(point, centroid)))
      return minDist * minDist // Square for probability weighting
    })

    // Sum of distances
    const sum = distances.reduce((a, b) => a + b, 0)

    // Choose next centroid with probability proportional to distance
    let rand = Math.random() * sum
    let index = 0

    while (rand > 0 && index < n) {
      rand -= distances[index]
      index++
    }

    centroids.push([...data[index - 1]])
  }

  return centroids
}

// Assign points to nearest centroid
function assignToClusters(data: number[][], centroids: number[][]) {
  return data.map((point) => {
    let minDist = Number.POSITIVE_INFINITY
    let cluster = 0

    centroids.forEach((centroid, i) => {
      const dist = euclideanDistance(point, centroid)
      if (dist < minDist) {
        minDist = dist
        cluster = i
      }
    })

    return cluster
  })
}

// Update centroids based on cluster assignments
function updateCentroids(data: number[][], clusters: number[], centroids: number[][], k: number) {
  const cols = data[0].length

  // Initialize sums and counts
  const sums = Array(k)
    .fill(0)
    .map(() => Array(cols).fill(0))
  const counts = Array(k).fill(0)

  // Sum points in each cluster
  data.forEach((point, i) => {
    const cluster = clusters[i]
    counts[cluster]++

    for (let j = 0; j < cols; j++) {
      sums[cluster][j] += point[j]
    }
  })

  // Calculate new centroids
  for (let i = 0; i < k; i++) {
    if (counts[i] > 0) {
      for (let j = 0; j < cols; j++) {
        centroids[i][j] = sums[i][j] / counts[i]
      }
    }
  }
}

// Calculate Euclidean distance between two points
function euclideanDistance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0))
}

// Check if two arrays are equal
function arraysEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Predict future values using simple linear regression
export function predictFutureValues(data: number[][], field: number, periods = 10) {
  // Extract the target field
  const y = data.map((row) => row[field])
  const x = Array.from({ length: y.length }, (_, i) => i)

  // Perform linear regression
  const { slope, intercept } = linearRegression(x, y)

  // Generate predictions
  const predictions = []
  for (let i = 0; i < periods; i++) {
    const xVal = x.length + i
    predictions.push(slope * xVal + intercept)
  }

  return {
    historical: y,
    predictions,
    slope,
    intercept,
  }
}

// Simple linear regression
function linearRegression(x: number[], y: number[]) {
  const n = x.length

  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n
  const meanY = y.reduce((a, b) => a + b, 0) / n

  // Calculate slope and intercept
  let numerator = 0
  let denominator = 0

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY)
    denominator += Math.pow(x[i] - meanX, 2)
  }

  const slope = denominator !== 0 ? numerator / denominator : 0
  const intercept = meanY - slope * meanX

  return { slope, intercept }
}

// Perform tensor operations
export function performTensorOperation(tensor: number[][], operation: string): number[][] {
  switch (operation) {
    case "normalize":
      return normalizeTensor(tensor)
    case "transpose":
      return transposeTensor(tensor)
    case "pca":
      return performPCA(tensor, 2) // Reduce to 2 dimensions for visualization
    default:
      return tensor
  }
}

// Normalize tensor values to [0,1] range
function normalizeTensor(tensor: number[][]): number[][] {
  const rows = tensor.length
  const cols = tensor[0].length

  // Find min and max for each column
  const min = Array(cols).fill(Number.POSITIVE_INFINITY)
  const max = Array(cols).fill(Number.NEGATIVE_INFINITY)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (tensor[i][j] < min[j]) min[j] = tensor[i][j]
      if (tensor[i][j] > max[j]) max[i][j] = tensor[i][j]
    }
  }

  // Normalize
  const normalized = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const range = max[j] - min[j]
      normalized[i][j] = range === 0 ? 0 : (tensor[i][j] - min[j]) / range
    }
  }

  return normalized
}

// Transpose a 2D tensor
function transposeTensor(tensor: number[][]): number[][] {
  const rows = tensor.length
  const cols = tensor[0].length
  const result = Array(cols)
    .fill(0)
    .map(() => Array(rows).fill(0))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = tensor[i][j]
    }
  }

  return result
}

// Simple PCA implementation (for demonstration)
function performPCA(tensor: number[][], components: number): number[][] {
  // This is a simplified PCA for demonstration
  // In a real implementation, you would:
  // 1. Center the data
  // 2. Compute covariance matrix
  // 3. Find eigenvectors and eigenvalues
  // 4. Project data onto principal components

  // For demo, we'll just return the first two columns
  const normalized = normalizeTensor(tensor)
  return normalized.map((row) => row.slice(0, components))
}

// Process natural language queries
export function processQuery(
  query: string,
  tensorData: TensorData,
): {
  result: string
  visualData?: any
} {
  const queryLower = query.toLowerCase()
  const tensor = tensorData.tensor as number[][]

  // Extract basic statistics
  const { stats } = tensorData

  // Detect query intent
  if (queryLower.includes("predict") || queryLower.includes("forecast")) {
    return handlePredictionQuery(query, tensorData)
  } else if (queryLower.includes("cluster") || queryLower.includes("group")) {
    return handleClusteringQuery(query, tensorData)
  } else if (queryLower.includes("anomaly") || queryLower.includes("outlier")) {
    return handleAnomalyQuery(query, tensorData)
  } else if (queryLower.includes("correlation") || queryLower.includes("relationship")) {
    return handleCorrelationQuery(query, tensorData)
  } else if (queryLower.includes("summary") || queryLower.includes("summarize")) {
    return handleSummaryQuery(query, tensorData)
  } else {
    // Default analysis
    return handleGeneralQuery(query, tensorData)
  }
}

// Handle prediction queries
function handlePredictionQuery(query: string, tensorData: TensorData) {
  const tensor = tensorData.tensor as number[][]
  const fields = tensorData.fields || []

  // Simple linear trend prediction
  const lastColumn = tensor.map((row) => row[row.length - 1])
  const n = lastColumn.length

  // Calculate trend
  let trend = 0
  if (n > 5) {
    const recentValues = lastColumn.slice(-5)
    const avgRecent = recentValues.reduce((a, b) => a + b, 0) / recentValues.length
    const earlierValues = lastColumn.slice(0, 5)
    const avgEarlier = earlierValues.reduce((a, b) => a + b, 0) / earlierValues.length

    trend = ((avgRecent - avgEarlier) / avgEarlier) * 100
  }

  // Generate prediction data for visualization
  const predictedValues = []
  const lastValue = lastColumn[lastColumn.length - 1]

  for (let i = 1; i <= 10; i++) {
    predictedValues.push(lastValue * (1 + (trend / 100) * (i / 10)))
  }

  const visualData = {
    type: "prediction",
    labels: Array.from({ length: n + 10 }, (_, i) => (i < n ? `Past ${i + 1}` : `Future ${i - n + 1}`)),
    datasets: [
      {
        label: "Historical",
        data: [...lastColumn, null, null, null, null, null, null, null, null, null, null],
      },
      {
        label: "Predicted",
        data: [...Array(n).fill(null), lastColumn[lastColumn.length - 1], ...predictedValues],
      },
    ],
  }

  return {
    result: `Based on tensor analysis, the forecast shows a ${Math.abs(trend).toFixed(1)}% ${trend >= 0 ? "increase" : "decrease"} in the target variable over the next period with moderate confidence.`,
    visualData,
  }
}

// Handle clustering queries
function handleClusteringQuery(query: string, tensorData: TensorData) {
  const tensor = tensorData.tensor as number[][]

  // Simple k-means clustering (very simplified)
  const k = 3 // Number of clusters
  const normalized = normalizeTensor(tensor)

  // Randomly assign initial clusters
  const clusters = Array(normalized.length)
    .fill(0)
    .map(() => Math.floor(Math.random() * k))

  // Count points in each cluster
  const counts = Array(k).fill(0)
  clusters.forEach((cluster) => counts[cluster]++)

  // Calculate percentages
  const percentages = counts.map((count) => ((count / normalized.length) * 100).toFixed(1))

  const visualData = {
    type: "clustering",
    data: normalized.map((point, i) => ({
      x: point[0],
      y: point.length > 1 ? point[1] : 0,
      cluster: clusters[i],
    })),
  }

  return {
    result: `Tensor clustering identified ${k} distinct groups in your data with the following distribution: ${counts.map((count, i) => `Group ${i + 1} (${percentages[i]}%)`).join(", ")}.`,
    visualData,
  }
}

// Handle anomaly detection queries
function handleAnomalyQuery(query: string, tensorData: TensorData) {
  const tensor = tensorData.tensor as number[][]
  const { stats } = tensorData

  // Simple anomaly detection using z-score
  const anomalies: number[] = []
  const threshold = 2.5 // Z-score threshold

  for (let i = 0; i < tensor.length; i++) {
    let isAnomaly = false

    for (let j = 0; j < tensor[i].length; j++) {
      const zScore = Math.abs((tensor[i][j] - stats!.mean[j]) / stats!.stdDev[j])
      if (zScore > threshold) {
        isAnomaly = true
        break
      }
    }

    if (isAnomaly) {
      anomalies.push(i)
    }
  }

  const anomalyPercentage = ((anomalies.length / tensor.length) * 100).toFixed(1)

  const visualData = {
    type: "anomaly",
    data: tensor.map((point, i) => ({
      x: point[0],
      y: point.length > 1 ? point[1] : 0,
      isAnomaly: anomalies.includes(i),
    })),
  }

  return {
    result: `Tensor analysis detected ${anomalies.length} anomalies (${anomalyPercentage}% of data points) that deviate significantly from expected patterns.`,
    visualData,
  }
}

// Handle correlation queries
function handleCorrelationQuery(query: string, tensorData: TensorData) {
  const tensor = tensorData.tensor as number[][]
  const fields = tensorData.fields || []

  // Calculate correlation matrix
  const correlations: number[][] = []
  const n = tensor[0].length

  for (let i = 0; i < n; i++) {
    correlations[i] = []
    for (let j = 0; j < n; j++) {
      if (i === j) {
        correlations[i][j] = 1 // Self-correlation
      } else {
        // Calculate Pearson correlation
        const col1 = tensor.map((row) => row[i])
        const col2 = tensor.map((row) => row[j])

        const mean1 = col1.reduce((a, b) => a + b, 0) / col1.length
        const mean2 = col2.reduce((a, b) => a + b, 0) / col2.length

        let num = 0
        let den1 = 0
        let den2 = 0

        for (let k = 0; k < col1.length; k++) {
          const diff1 = col1[k] - mean1
          const diff2 = col2[k] - mean2

          num += diff1 * diff2
          den1 += diff1 * diff1
          den2 += diff2 * diff2
        }

        const corr = num / (Math.sqrt(den1) * Math.sqrt(den2))
        correlations[i][j] = isNaN(corr) ? 0 : corr
      }
    }
  }

  // Find strongest correlations
  const pairs: { field1: string; field2: string; correlation: number }[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        field1: fields[i] || `Field ${i + 1}`,
        field2: fields[j] || `Field ${j + 1}`,
        correlation: correlations[i][j],
      })
    }
  }

  pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))

  const visualData = {
    type: "correlation",
    labels: fields.length ? fields : Array.from({ length: n }, (_, i) => `Field ${i + 1}`),
    data: correlations,
  }

  let result = "No strong correlations found in the data."

  if (pairs.length > 0 && Math.abs(pairs[0].correlation) > 0.5) {
    result = `Strong tensor correlations detected between ${pairs[0].field1} and ${pairs[0].field2} (correlation coefficient: ${pairs[0].correlation.toFixed(2)}).`

    if (pairs.length > 1 && Math.abs(pairs[1].correlation) > 0.3) {
      result += ` Weaker but significant correlations between ${pairs[1].field1} and ${pairs[1].field2} (${pairs[1].correlation.toFixed(2)}).`
    }
  }

  return { result, visualData }
}

// Handle summary queries
function handleSummaryQuery(query: string, tensorData: TensorData) {
  const { stats, fields } = tensorData

  // Generate insights based on statistics
  const insights: string[] = []

  // Check for skewed distributions
  for (let i = 0; i < stats!.mean.length; i++) {
    const fieldName = fields?.[i] || `Field ${i + 1}`
    const range = stats!.max[i] - stats!.min[i]

    if (stats!.mean[i] - stats!.min[i] < 0.25 * range) {
      insights.push(`${fieldName} is positively skewed with most values concentrated at the lower end.`)
    } else if (stats!.max[i] - stats!.mean[i] < 0.25 * range) {
      insights.push(`${fieldName} is negatively skewed with most values concentrated at the higher end.`)
    }

    // Check for high variance
    if (stats!.stdDev[i] > 0.5 * range) {
      insights.push(`${fieldName} shows high variability relative to its range.`)
    }
  }

  // If no specific insights, provide general summary
  if (insights.length === 0) {
    insights.push("The data appears to be relatively normally distributed across most dimensions.")
    insights.push("No extreme outliers or skewness detected in the primary dimensions.")
  }

  const visualData = {
    type: "summary",
    labels: fields?.length ? fields : Array.from({ length: stats!.mean.length }, (_, i) => `Field ${i + 1}`),
    stats: {
      min: stats!.min,
      max: stats!.max,
      mean: stats!.mean,
      stdDev: stats!.stdDev,
    },
  }

  return {
    result: `Summary of tensor data: ${insights.join(" ")}`,
    visualData,
  }
}

// Handle general queries
function handleGeneralQuery(query: string, tensorData: TensorData) {
  // Combine aspects of different query types
  const summaryResult = handleSummaryQuery(query, tensorData)
  const correlationResult = handleCorrelationQuery(query, tensorData)

  return {
    result: `The tensor analysis of your data reveals several key insights: 1) ${summaryResult.result.split(":")[1].trim()} 2) ${correlationResult.result}`,
    visualData: summaryResult.visualData,
  }
}
export { normalizeData as normalizeTensor }
export { performClustering as performPCA }
export { detectAnomalies as detectOutliers }
export { findCorrelations as calculateCorrelations }
export { predictFutureValues as predictValues }
