"use client"

import { useEffect, useRef } from "react"

export function TensorAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    // Animation loop
    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = Math.min(canvas.width, canvas.height) * 0.4

      drawTensorVisualization(ctx, centerX, centerY, size, time)

      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[300px]"
      aria-label="Tensor visualization showing multi-dimensional data structure"
    />
  )
}

function drawTensorVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  time: number,
) {
  // Draw 3D tensor visualization
  const layers = 5
  const cellsPerLayer = 8
  const cellSize = size / cellsPerLayer
  const rotation = time * 0.5

  // Draw from back to front
  for (let k = layers - 1; k >= 0; k--) {
    const layerOffset = (k - layers / 2) * 20

    for (let i = 0; i < cellsPerLayer; i++) {
      for (let j = 0; j < cellsPerLayer; j++) {
        // Apply rotation
        const angle = rotation
        const x0 = i - cellsPerLayer / 2
        const y0 = j - cellsPerLayer / 2

        const x1 = x0 * Math.cos(angle) - y0 * Math.sin(angle)
        const y1 = x0 * Math.sin(angle) + y0 * Math.cos(angle)

        const x = centerX + x1 * cellSize + layerOffset
        const y = centerY + y1 * cellSize + layerOffset

        // Generate a value based on position and time
        const value = Math.sin(i * 0.5 + k * 0.3 + time) * Math.cos(j * 0.5 + k * 0.3 + time)
        const intensity = (value + 1) / 2 // Normalize to 0-1

        // Color based on value and layer
        const h = 246 // Primary color hue
        const s = 80
        const l = 30 + intensity * 40
        const alpha = 0.7 + k * 0.06

        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${alpha})`

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
  }

  // Add some connecting lines to show relationships
  ctx.globalAlpha = 0.2
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) continue

      const angle1 = rotation + (i / 4) * Math.PI * 2
      const angle2 = rotation + (j / 4) * Math.PI * 2

      const radius1 = 70 + Math.sin(time * 0.5) * 10
      const radius2 = 100 + Math.cos(time * 0.3) * 15

      const x1 = centerX + Math.cos(angle1) * radius1
      const y1 = centerY + Math.sin(angle1) * radius1
      const x2 = centerX + Math.cos(angle2) * radius2
      const y2 = centerY + Math.sin(angle2) * radius2

      ctx.strokeStyle = "rgba(79, 70, 229, 0.5)"
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1.0
}
