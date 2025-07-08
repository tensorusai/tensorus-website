"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TensorData } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { CuboidIcon as Cube, Grid, BarChart2, DotIcon as ScatterDot, RotateCw } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"

interface TensorVisualizationProps {
  data: TensorData
  rawData?: any
}

export function TensorVisualization({ data, rawData }: TensorVisualizationProps) {
  const [activeView, setActiveView] = useState("structure")
  const [selectedDimensions, setSelectedDimensions] = useState<[number, number]>([0, 1])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoom, setZoom] = useState(1)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (activeView === "3d" && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let lastTime = 0
      const animate = (time: number) => {
        if (!lastTime) lastTime = time
        const deltaTime = time - lastTime
        lastTime = time

        // Update rotation if auto-rotate is enabled
        if (autoRotate) {
          setRotation((prev) => (prev + deltaTime * 0.0002) % (Math.PI * 2))
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw 3D tensor visualization
        drawInteractive3DTensor(ctx, canvas.width, canvas.height, data, rotation, zoom)

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [activeView, data, rotation, autoRotate, zoom])

  // Prepare data for visualization
  const prepareChartData = () => {
    if (!data.tensor || !Array.isArray(data.tensor) || data.tensor.length === 0) {
      return Array(5)
        .fill(0)
        .map((_, i) => ({
          index: i,
          value: Math.random() * 100,
        }))
    }

    const tensor = data.tensor as number[][]
    const fields = data.fields || Array.from({ length: tensor[0]?.length || 0 }, (_, i) => `Dim ${i + 1}`)

    return tensor.slice(0, 100).map((row, i) => {
      const point: Record<string, any> = { index: i }
      fields.forEach((field, j) => {
        if (j < row.length) {
          point[field] = row[j]
        }
      })
      return point
    })
  }

  const chartData = prepareChartData()

  // Prepare scatter plot data
  const scatterData = () => {
    if (!data.tensor || !Array.isArray(data.tensor) || data.tensor.length === 0) {
      return Array(20)
        .fill(0)
        .map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        }))
    }

    const tensor = data.tensor as number[][]
    return tensor.slice(0, 500).map((row) => {
      const x = selectedDimensions[0] < row.length ? row[selectedDimensions[0]] : 0
      const y = selectedDimensions[1] < row.length ? row[selectedDimensions[1]] : 0
      return { x, y }
    })
  }

  // Prepare dimension statistics data
  const dimensionStatsData = () => {
    if (!data.stats || !data.stats.fields || !data.stats.mean) {
      return Array(5)
        .fill(0)
        .map((_, i) => ({
          name: `Dimension ${i + 1}`,
          min: Math.random() * 20,
          mean: 50 + Math.random() * 30,
          max: 80 + Math.random() * 20,
        }))
    }

    return data.stats.fields.map((field, i) => ({
      name: field,
      min: data.stats?.min[i] || 0,
      mean: data.stats?.mean[i] || 0,
      max: data.stats?.max[i] || 0,
    }))
  }

  // Get available dimensions for selection
  const availableDimensions =
    data.fields ||
    (data.tensor && Array.isArray(data.tensor) && data.tensor[0]
      ? Array.from({ length: data.tensor[0].length }, (_, i) => `Dimension ${i + 1}`)
      : ["Dimension 1", "Dimension 2"])

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeView !== "3d" || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Disable auto-rotation when user interacts
    setAutoRotate(false)

    const startX = x

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX - rect.left
      const deltaX = currentX - startX

      // Update rotation based on mouse movement
      setRotation((prev) => (prev + deltaX * 0.01) % (Math.PI * 2))
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta * 0.1)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Dimensions:</span>
          <Badge variant="outline">{data.dimensions}D</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Shape:</span>
          <Badge variant="outline">{data.shape.join(" × ")}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Data Type:</span>
          <Badge variant="outline">{data.dataType}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Sparsity:</span>
          <Badge variant="outline">{(data.sparsity * 100).toFixed(1)}%</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Transformation:</span>
          <Badge variant="secondary">{data.transformationMethod}</Badge>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="structure" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span>Data Structure</span>
          </TabsTrigger>
          <TabsTrigger value="scatter" className="flex items-center gap-1">
            <ScatterDot className="h-4 w-4" />
            <span>Scatter Plot</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-1">
            <Cube className="h-4 w-4" />
            <span>3D Visualization</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-1">
            <Grid className="h-4 w-4" />
            <span>Value Heatmap</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Feature Distribution</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimensionStatsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="min" fill="#8884d8" name="Min" />
                    <Bar dataKey="mean" fill="#82ca9d" name="Mean" />
                    <Bar dataKey="max" fill="#ffc658" name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Time Series View</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {data.fields?.slice(0, 5).map((field, i) => (
                      <Line key={field} type="monotone" dataKey={field} stroke={getColorByIndex(i)} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scatter" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Scatter Plot</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">X-Axis:</span>
                    <select
                      className="h-8 rounded-md border border-input px-2 py-1 text-sm"
                      value={selectedDimensions[0]}
                      onChange={(e) => setSelectedDimensions([Number.parseInt(e.target.value), selectedDimensions[1]])}
                    >
                      {availableDimensions.map((field, i) => (
                        <option key={i} value={i}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Y-Axis:</span>
                    <select
                      className="h-8 rounded-md border border-input px-2 py-1 text-sm"
                      value={selectedDimensions[1]}
                      onChange={(e) => setSelectedDimensions([selectedDimensions[0], Number.parseInt(e.target.value)])}
                    >
                      {availableDimensions.map((field, i) => (
                        <option key={i} value={i}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name={availableDimensions[selectedDimensions[0]]} />
                    <YAxis type="number" dataKey="y" name={availableDimensions[selectedDimensions[1]]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value: any) => [value, ""]}
                      labelFormatter={(_, payload) => {
                        if (payload && payload.length > 0) {
                          const x = payload[0].payload.x
                          const y = payload[0].payload.y
                          return `${availableDimensions[selectedDimensions[0]]}: ${x}, ${availableDimensions[selectedDimensions[1]]}: ${y}`
                        }
                        return ""
                      }}
                    />
                    <Legend />
                    <Scatter name="Data Points" data={scatterData()} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d" className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-[500px] cursor-grab"
              onMouseDown={handleCanvasMouseDown}
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <RotateCw className={`h-5 w-5 ${autoRotate ? "text-primary" : ""}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-10 h-10 rounded-full p-0"
                onClick={() => handleZoomChange(1)}
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-10 h-10 rounded-full p-0"
                onClick={() => handleZoomChange(-1)}
              >
                -
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 text-sm bg-black/20 text-white px-3 py-1 rounded-md">
              Drag to rotate • Use +/- to zoom
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Interactive 3D visualization of the tensor structure. The visualization shows how your data has been
            transformed into a {data.dimensions}-dimensional tensor space. Colors represent different value ranges, and
            the opacity indicates the confidence level of the transformation.
          </p>
        </TabsContent>

        <TabsContent value="heatmap">
          <div className="border rounded-lg p-4 bg-black/5 dark:bg-white/5 overflow-auto">
            <div className="min-h-[400px] flex items-center justify-center">
              <TensorHeatmap data={data} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getColorByIndex(index: number): string {
  const colors = [
    "#4f46e5", // Indigo
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f97316", // Orange
  ]
  return colors[index % colors.length]
}

function drawInteractive3DTensor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TensorData,
  rotation: number,
  zoom: number,
) {
  try {
    // Set up the canvas
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * zoom

    // Draw based on dimensions
    if (data.dimensions === 2) {
      draw2DTensor(ctx, centerX, centerY, size, rotation, data)
    } else if (data.dimensions === 3) {
      draw3DInteractiveTensor(ctx, centerX, centerY, size, rotation, data)
    } else {
      drawHighDimensionalTensor(ctx, centerX, centerY, size, rotation, data)
    }

    // Draw coordinate axes
    drawCoordinateAxes(ctx, centerX, centerY, size, rotation)

    // Draw legend
    drawColorLegend(ctx, width - 80, height - 120, data)
  } catch (error) {
    console.error("Error drawing tensor visualization:", error)

    // Draw error message
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, width, height)
    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#ef4444"
    ctx.textAlign = "center"
    ctx.fillText("Error rendering visualization", width / 2, height / 2)
  }
}

function drawCoordinateAxes(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
) {
  const axisLength = size * 0.6

  // X-axis (red)
  const xEndX = centerX + Math.cos(rotation) * axisLength
  const xEndY = centerY + Math.sin(rotation) * axisLength

  ctx.strokeStyle = "#ef4444"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(xEndX, xEndY)
  ctx.stroke()

  // X-axis label
  ctx.fillStyle = "#ef4444"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("X", xEndX + 10 * Math.cos(rotation), xEndY + 10 * Math.sin(rotation))

  // Y-axis (green)
  const yRotation = rotation + Math.PI / 2
  const yEndX = centerX + Math.cos(yRotation) * axisLength
  const yEndY = centerY + Math.sin(yRotation) * axisLength

  ctx.strokeStyle = "#10b981"
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(yEndX, yEndY)
  ctx.stroke()

  // Y-axis label
  ctx.fillStyle = "#10b981"
  ctx.fillText("Y", yEndX + 10 * Math.cos(yRotation), yEndY + 10 * Math.sin(yRotation))

  // Z-axis (blue) - coming out of the screen
  const zRotation = rotation + Math.PI / 4
  const zEndX = centerX + Math.cos(zRotation) * axisLength * 0.5
  const zEndY = centerY + Math.sin(zRotation) * axisLength * 0.5

  ctx.strokeStyle = "#3b82f6"
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(zEndX, zEndY)
  ctx.stroke()

  // Z-axis label
  ctx.fillStyle = "#3b82f6"
  ctx.fillText("Z", zEndX + 10 * Math.cos(zRotation), zEndY + 10 * Math.sin(zRotation))
}

function drawColorLegend(ctx: CanvasRenderingContext2D, x: number, y: number, data: TensorData) {
  const legendWidth = 20
  const legendHeight = 100
  const steps = 10

  ctx.strokeStyle = "#000"
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, legendWidth, legendHeight)

  for (let i = 0; i < steps; i++) {
    const normalizedValue = i / (steps - 1)
    const yPos = y + legendHeight - legendHeight * normalizedValue

    // Color based on value
    const r = Math.floor(normalizedValue * 100)
    const g = Math.floor(normalizedValue * 150)
    const b = Math.floor(normalizedValue * 255)

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(x, yPos - legendHeight / steps, legendWidth, legendHeight / steps)
  }

  // Legend labels
  ctx.fillStyle = "#000"
  ctx.font = "10px sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("High", x + legendWidth + 5, y + 10)
  ctx.fillText("Low", x + legendWidth + 5, y + legendHeight - 5)
}

function draw2DTensor(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
  data: TensorData,
) {
  // Draw a 2D matrix representation
  const tensor = data.tensor as number[][]
  if (!tensor || tensor.length === 0) {
    drawPlaceholderGrid(ctx, centerX, centerY, size)
    return
  }

  const cellSize = size / Math.min(20, tensor.length)
  const gridSize = Math.min(20, tensor.length)

  // Find min and max values for color scaling
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (let i = 0; i < gridSize; i++) {
    if (i >= tensor.length) break
    for (let j = 0; j < Math.min(gridSize, tensor[i].length); j++) {
      const value = tensor[i][j]
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  // Apply rotation to the entire grid
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)
  ctx.translate(-centerX, -centerY)

  // Draw cells
  for (let i = 0; i < gridSize; i++) {
    if (i >= tensor.length) break
    for (let j = 0; j < Math.min(gridSize, tensor[i].length); j++) {
      const x = centerX - size / 2 + i * cellSize
      const y = centerY - size / 2 + j * cellSize

      // Normalize value for color
      const value = tensor[i][j]
      const normalizedValue = (value - min) / (max - min || 1)

      // Color based on value
      const r = Math.floor(normalizedValue * 100)
      const g = Math.floor(normalizedValue * 150)
      const b = Math.floor(normalizedValue * 255)

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, cellSize, cellSize)

      // Draw grid
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
    }
  }

  ctx.restore()
}

function drawPlaceholderGrid(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number) {
  const gridSize = 10
  const cellSize = size / gridSize

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(Math.PI / 6) // Fixed rotation for placeholder
  ctx.translate(-centerX, -centerY)

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = centerX - size / 2 + i * cellSize
      const y = centerY - size / 2 + j * cellSize

      // Generate a color based on position
      const r = Math.floor((i / gridSize) * 100)
      const g = Math.floor((j / gridSize) * 150)
      const b = Math.floor(((i + j) / (2 * gridSize)) * 255)

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, cellSize, cellSize)

      // Draw grid
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
    }
  }

  ctx.restore()
}

function draw3DInteractiveTensor(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
  data: TensorData,
) {
  const tensor = data.tensor as number[][]
  if (!tensor || tensor.length === 0) {
    drawPlaceholder3D(ctx, centerX, centerY, size, rotation)
    return
  }

  const layers = Math.min(5, Math.ceil(Math.sqrt(tensor.length)))
  const cellsPerLayer = Math.min(8, Math.floor(Math.sqrt(tensor[0]?.length || 1)))
  const cellSize = size / cellsPerLayer

  // Find min and max values for color scaling
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (const row of tensor) {
    for (const value of row) {
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  // Sort layers by depth for proper rendering
  const layerIndices = Array.from({ length: layers }, (_, i) => i)

  // Calculate layer positions based on rotation
  const layerPositions = layerIndices.map((k) => {
    const layerOffset = (k - layers / 2) * 20
    const angle = rotation + Math.PI / 4
    const offsetX = Math.cos(angle) * layerOffset
    const offsetY = Math.sin(angle) * layerOffset
    return {
      index: k,
      x: offsetX,
      y: offsetY,
      depth: -layerOffset, // Negative because we want layers with positive offset to be in the back
    }
  })

  // Sort by depth for proper rendering (back to front)
  layerPositions.sort((a, b) => a.depth - b.depth)

  // Draw from back to front
  for (const layer of layerPositions) {
    const k = layer.index
    const layerOffset = (k - layers / 2) * 20
    const layerIndex = Math.floor((k * tensor.length) / layers)
    if (layerIndex >= tensor.length) continue

    for (let i = 0; i < cellsPerLayer; i++) {
      for (let j = 0; j < cellsPerLayer; j++) {
        // Apply rotation
        const angle = rotation
        const x0 = i - cellsPerLayer / 2
        const y0 = j - cellsPerLayer / 2

        const x1 = x0 * Math.cos(angle) - y0 * Math.sin(angle)
        const y1 = x0 * Math.sin(angle) + y0 * Math.cos(angle)

        const x = centerX + x1 * cellSize + layer.x
        const y = centerY + y1 * cellSize + layer.y

        // Get value from tensor if available
        const valueIndex = i * cellsPerLayer + j
        const value = valueIndex < tensor[layerIndex].length ? tensor[layerIndex][valueIndex] : 0

        // Normalize value
        const normalizedValue = (value - min) / (max - min || 1)

        // Color based on value and layer
        const r = Math.floor(normalizedValue * 100 + k * 30)
        const g = Math.floor(normalizedValue * 150)
        const b = Math.floor(normalizedValue * 255 - k * 20)
        const alpha = 0.7 + k * 0.06

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

        // Draw as rounded rectangle
        ctx.beginPath()
        ctx.roundRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize, 2)
        ctx.fill()

        // Draw border
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + k * 0.1})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Add value label for larger cells
        if (cellSize > 20) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.font = "8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(value.toFixed(1), x, y)
        }
      }
    }

    // Draw layer label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`Layer ${k + 1}`, centerX + layer.x, centerY + layer.y - size / 2 - 10)
  }

  // Draw connecting lines between layers
  ctx.globalAlpha = 0.2
  for (let i = 0; i < layerPositions.length - 1; i++) {
    const layer1 = layerPositions[i]
    const layer2 = layerPositions[i + 1]

    // Connect corresponding corners
    for (let corner = 0; corner < 4; corner++) {
      const xOffset = ((corner % 2 === 0 ? -1 : 1) * size) / 2
      const yOffset = ((corner < 2 ? -1 : 1) * size) / 2

      const x1 = centerX + layer1.x + xOffset
      const y1 = centerY + layer1.y + yOffset
      const x2 = centerX + layer2.x + xOffset
      const y2 = centerY + layer2.y + yOffset

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1.0
}

function drawPlaceholder3D(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
) {
  const layers = 5
  const cellsPerLayer = 8
  const cellSize = size / cellsPerLayer

  // Calculate layer positions based on rotation
  const layerPositions = Array.from({ length: layers }, (_, k) => {
    const layerOffset = (k - layers / 2) * 20
    const angle = rotation + Math.PI / 4
    const offsetX = Math.cos(angle) * layerOffset
    const offsetY = Math.sin(angle) * layerOffset
    return {
      index: k,
      x: offsetX,
      y: offsetY,
      depth: -layerOffset,
    }
  })

  // Sort by depth for proper rendering (back to front)
  layerPositions.sort((a, b) => a.depth - b.depth)

  // Draw from back to front
  for (const layer of layerPositions) {
    const k = layer.index

    for (let i = 0; i < cellsPerLayer; i++) {
      for (let j = 0; j < cellsPerLayer; j++) {
        // Apply rotation
        const angle = rotation
        const x0 = i - cellsPerLayer / 2
        const y0 = j - cellsPerLayer / 2

        const x1 = x0 * Math.cos(angle) - y0 * Math.sin(angle)
        const y1 = x0 * Math.sin(angle) + y0 * Math.cos(angle)

        const x = centerX + x1 * cellSize + layer.x
        const y = centerY + y1 * cellSize + layer.y

        // Generate a color based on position and layer
        const r = Math.floor((i / cellsPerLayer) * 100 + k * 30)
        const g = Math.floor((j / cellsPerLayer) * 150)
        const b = Math.floor(((i + j) / (2 * cellsPerLayer)) * 255 - k * 20)
        const alpha = 0.7 + k * 0.06

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

        // Draw as rounded rectangle
        ctx.beginPath()
        ctx.roundRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize, 2)
        ctx.fill()

        // Draw border
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + k * 0.1})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Draw layer label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`Layer ${k + 1}`, centerX + layer.x, centerY + layer.y - size / 2 - 10)
  }

  // Draw connecting lines between layers
  ctx.globalAlpha = 0.2
  for (let i = 0; i < layerPositions.length - 1; i++) {
    const layer1 = layerPositions[i]
    const layer2 = layerPositions[i + 1]

    // Connect corresponding corners
    for (let corner = 0; corner < 4; corner++) {
      const xOffset = ((corner % 2 === 0 ? -1 : 1) * size) / 2
      const yOffset = ((corner < 2 ? -1 : 1) * size) / 2

      const x1 = centerX + layer1.x + xOffset
      const y1 = centerY + layer1.y + yOffset
      const x2 = centerX + layer2.x + xOffset
      const y2 = centerY + layer2.y + yOffset

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1.0
}

function drawHighDimensionalTensor(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
  data: TensorData,
) {
  const dimensions = data.dimensions
  const tensor = data.tensor as number[][]
  if (!tensor || tensor.length === 0) {
    drawPlaceholderHighDim(ctx, centerX, centerY, size, rotation, dimensions)
    return
  }

  // Draw central node
  ctx.fillStyle = "#4f46e5"
  ctx.beginPath()
  ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
  ctx.fill()

  // Draw dimension rings
  for (let d = 0; d < dimensions; d++) {
    const radius = 50 + d * 30

    ctx.strokeStyle = `rgba(79, 70, 229, ${1 - d * 0.15})`
    ctx.lineWidth = 3 - d * 0.4

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw nodes on this dimension
    const nodes = Math.min(5 + d * 3, tensor.length)
    for (let i = 0; i < nodes; i++) {
      const angle = rotation + (i / nodes) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Node size decreases with dimension
      const nodeSize = 10 - d * 1.5

      // Node color varies based on tensor value if available
      const value = i < tensor.length && d < tensor[i].length ? tensor[i][d] : 0
      const hue = (d * 30 + i * 20 + value * 10) % 360
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`

      ctx.beginPath()
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      ctx.fill()

      // Connect to center with fading lines
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  // Draw some connecting lines between dimensions
  ctx.globalAlpha = 0.2
  for (let d = 0; d < dimensions - 1; d++) {
    const radius1 = 50 + d * 30
    const radius2 = 50 + (d + 1) * 30

    const nodes1 = 5 + d * 3
    const nodes2 = 5 + (d + 1) * 3

    for (let i = 0; i < nodes1; i += 2) {
      const angle1 = rotation + (i / nodes1) * Math.PI * 2
      const x1 = centerX + Math.cos(angle1) * radius1
      const y1 = centerY + Math.sin(angle1) * radius1

      for (let j = 0; j < nodes2; j += 3) {
        const angle2 = rotation + (j / nodes2) * Math.PI * 2
        const x2 = centerX + Math.cos(angle2) * radius2
        const y2 = centerY + Math.sin(angle2) * radius2

        ctx.strokeStyle = "#4f46e5"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1.0
}

function drawPlaceholderHighDim(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  rotation: number,
  dimensions: number,
) {
  // Draw central node
  ctx.fillStyle = "#4f46e5"
  ctx.beginPath()
  ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
  ctx.fill()

  // Draw dimension rings
  for (let d = 0; d < dimensions; d++) {
    const radius = 50 + d * 30

    ctx.strokeStyle = `rgba(79, 70, 229, ${1 - d * 0.15})`
    ctx.lineWidth = 3 - d * 0.4

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw nodes on this dimension
    const nodes = 5 + d * 3
    for (let i = 0; i < nodes; i++) {
      const angle = rotation + (i / nodes) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Node size decreases with dimension
      const nodeSize = 10 - d * 1.5

      // Node color varies based on position
      const hue = (d * 30 + i * 20) % 360
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`

      ctx.beginPath()
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
      ctx.fill()

      // Connect to center with fading lines
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  // Draw some connecting lines between dimensions
  ctx.globalAlpha = 0.2
  for (let d = 0; d < dimensions - 1; d++) {
    const radius1 = 50 + d * 30
    const radius2 = 50 + (d + 1) * 30

    const nodes1 = 5 + d * 3
    const nodes2 = 5 + (d + 1) * 3

    for (let i = 0; i < nodes1; i += 2) {
      const angle1 = rotation + (i / nodes1) * Math.PI * 2
      const x1 = centerX + Math.cos(angle1) * radius1
      const y1 = centerY + Math.sin(angle1) * radius1

      for (let j = 0; j < nodes2; j += 3) {
        const angle2 = rotation + (j / nodes2) * Math.PI * 2
        const x2 = centerX + Math.cos(angle2) * radius2
        const y2 = centerY + Math.sin(angle2) * radius2

        ctx.strokeStyle = "#4f46e5"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1.0
}

function TensorHeatmap({ data }: { data: TensorData }) {
  const tensor = data.tensor as number[][]
  if (!tensor || tensor.length === 0) {
    return (
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gridTemplateRows: "repeat(10, minmax(0, 1fr))" }}
      >
        {Array(100)
          .fill(0)
          .map((_, i) => {
            const value = Math.random()
            const hue = value * 240
            return (
              <div
                key={i}
                className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-mono text-white/90"
                style={{
                  backgroundColor: `hsl(${hue}, 80%, 50%)`,
                  opacity: 0.7 + value * 0.3,
                }}
              >
                {(value * 10).toFixed(1)}
              </div>
            )
          })}
      </div>
    )
  }

  // Determine grid size based on data
  const gridSize = Math.min(20, tensor.length)

  // Find min and max for color scaling
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (let i = 0; i < gridSize; i++) {
    if (i >= tensor.length) break
    for (let j = 0; j < Math.min(gridSize, tensor[i].length); j++) {
      const value = tensor[i][j]
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  // Prepare heatmap data
  const heatmapData = []

  for (let i = 0; i < gridSize; i++) {
    if (i >= tensor.length) break
    for (let j = 0; j < Math.min(gridSize, tensor[i].length); j++) {
      const value = tensor[i][j]
      const normalizedValue = (value - min) / (max - min || 1)

      heatmapData.push({
        row: i,
        col: j,
        value,
        normalizedValue,
      })
    }
  }

  const colCount = Math.min(gridSize, tensor[0]?.length || 0)

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {heatmapData.map((cell, i) => {
        // Color based on value
        const hue = cell.normalizedValue * 240 // Blue to red

        return (
          <div
            key={i}
            className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-mono text-white/90"
            style={{
              backgroundColor: `hsl(${hue}, 80%, 50%)`,
              opacity: 0.7 + cell.normalizedValue * 0.3,
            }}
          >
            {cell.value.toFixed(1)}
          </div>
        )
      })}
    </div>
  )
}
