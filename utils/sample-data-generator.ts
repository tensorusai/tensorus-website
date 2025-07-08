// Utility to generate sample data for the Agentic Tensor Database demo

// Generate a realistic dataset with patterns that can be discovered through tensor analysis
export function generateSampleData(numSamples = 1000) {
  // Create a dataset with multiple features that have relationships
  const data = []

  // Time range (e.g., 1000 days)
  const startDate = new Date(2022, 0, 1)

  for (let i = 0; i < numSamples; i++) {
    // Create date (sequential days)
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    // Base value with trend
    const trend = 0.01 * i

    // Seasonal component (yearly cycle)
    const yearCycle = Math.sin((i / 365) * 2 * Math.PI)

    // Weekly cycle (stronger on weekdays, weaker on weekends)
    const dayOfWeek = currentDate.getDay()
    const weekdayEffect = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.2 : 0.8

    // Feature 1: Sales - affected by trend, seasonality, and day of week
    const sales = 1000 + trend * 10 + yearCycle * 200 + weekdayEffect * 100 + (Math.random() - 0.5) * 50

    // Feature 2: Temperature - seasonal with some noise
    const temperature = 15 + yearCycle * 15 + (Math.random() - 0.5) * 5

    // Feature 3: Website Traffic - correlated with sales but with its own patterns
    const websiteTraffic = sales * 0.5 + weekdayEffect * 200 + (Math.random() - 0.5) * 100

    // Feature 4: Conversion Rate - negatively correlated with traffic (higher traffic often means lower conversion)
    const conversionRate = 0.05 - (websiteTraffic / 10000) * 0.02 + (Math.random() - 0.5) * 0.01

    // Feature 5: Customer Satisfaction - somewhat random but slightly correlated with conversion
    const customerSatisfaction = 7 + conversionRate * 20 + (Math.random() - 0.5) * 2

    // Feature 6: Marketing Spend - cyclical with occasional spikes
    const marketingBase = 500 + Math.sin((i / 30) * 2 * Math.PI) * 200
    const marketingSpike = i % 90 < 5 ? 500 : 0 // Campaign spike every 90 days
    const marketingSpend = marketingBase + marketingSpike + (Math.random() - 0.5) * 50

    // Feature 7: Inventory Levels - inverse relationship with sales
    const inventoryLevels = 5000 - sales * 0.8 + (Math.random() - 0.5) * 200

    // Add some anomalies
    let anomalyFlag = false

    // Sales anomaly around holidays
    if (
      (currentDate.getMonth() === 11 && currentDate.getDate() > 20) || // Christmas
      (currentDate.getMonth() === 10 && currentDate.getDate() > 22 && currentDate.getDate() < 30) // Black Friday
    ) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        sales: sales * (1.5 + Math.random() * 0.5),
        temperature,
        websiteTraffic: websiteTraffic * (2 + Math.random()),
        conversionRate: conversionRate * (1.2 + Math.random() * 0.3),
        customerSatisfaction,
        marketingSpend: marketingSpend * 1.5,
        inventoryLevels: inventoryLevels * 0.7,
        anomaly: true,
      })
      anomalyFlag = true
    }

    // Random anomalies (about 2% of the data)
    if (!anomalyFlag && Math.random() < 0.02) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        sales: sales * (Math.random() < 0.5 ? 0.3 : 3), // Extreme value
        temperature,
        websiteTraffic: websiteTraffic * (Math.random() < 0.5 ? 0.2 : 4),
        conversionRate,
        customerSatisfaction: Math.random() < 0.5 ? 2 : 10, // Extreme satisfaction
        marketingSpend,
        inventoryLevels,
        anomaly: true,
      })
      anomalyFlag = true
    }

    // Normal data point
    if (!anomalyFlag) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        sales: Math.round(sales * 100) / 100,
        temperature: Math.round(temperature * 10) / 10,
        websiteTraffic: Math.round(websiteTraffic),
        conversionRate: Math.round(conversionRate * 1000) / 1000,
        customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
        marketingSpend: Math.round(marketingSpend),
        inventoryLevels: Math.round(inventoryLevels),
        anomaly: false,
      })
    }
  }

  return data
}

// Convert the data to CSV format
export function convertToCSV(data: any[]) {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add header row
  csvRows.push(headers.join(","))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Handle string values that might contain commas
      return typeof value === "string" ? `"${value}"` : value
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

// Create a downloadable file
export function downloadSampleData() {
  const data = generateSampleData(1000)
  const csv = convertToCSV(data)

  // Create a blob and download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "tensor_sample_data.csv")
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
