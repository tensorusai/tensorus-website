"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { AgentMessage } from "@/types/database"
import { Brain, Database, Calculator, Search, Cpu, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentNetworkProps {
  messages: AgentMessage[]
}

export function AgentNetwork({ messages }: AgentNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [highlightedMessages, setHighlightedMessages] = useState<Record<string, boolean>>({})
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})
  const [previousMessagesCount, setPreviousMessagesCount] = useState<number>(0)

  // Highlight new messages
  useEffect(() => {
    if (messages.length > previousMessagesCount) {
      const newHighlights: Record<string, boolean> = { ...highlightedMessages }

      messages.slice(previousMessagesCount).forEach((msg) => {
        newHighlights[msg.id] = true
      })

      setHighlightedMessages(newHighlights)
      setPreviousMessagesCount(messages.length)

      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        const resetHighlights: Record<string, boolean> = { ...newHighlights }
        messages.slice(previousMessagesCount).forEach((msg) => {
          resetHighlights[msg.id] = false
        })
        setHighlightedMessages(resetHighlights)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [messages, previousMessagesCount, highlightedMessages])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up animation loop
    let animationFrameId: number

    const render = () => {
      drawAgentNetwork(ctx, canvas.width, canvas.height, messages)
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [messages])

  const toggleMessageExpand = (id: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AgentCard
          name="Data Ingestion Agent"
          icon={<Database className="h-5 w-5" />}
          description="Processes and validates incoming data files"
          messageCount={countAgentMessages(messages, "Data Ingestion Agent")}
          messages={filterAgentMessages(messages, "Data Ingestion Agent")}
          highlightedMessages={highlightedMessages}
          expandedMessages={expandedMessages}
          onToggleExpand={toggleMessageExpand}
        />
        <AgentCard
          name="Tensor Transformation Agent"
          icon={<Cpu className="h-5 w-5" />}
          description="Converts data into optimal tensor representations"
          messageCount={countAgentMessages(messages, "Tensor Transformation Agent")}
          messages={filterAgentMessages(messages, "Tensor Transformation Agent")}
          highlightedMessages={highlightedMessages}
          expandedMessages={expandedMessages}
          onToggleExpand={toggleMessageExpand}
        />
        <AgentCard
          name="Operation Learning Agent"
          icon={<Brain className="h-5 w-5" />}
          description="Learns and optimizes tensor operations"
          messageCount={countAgentMessages(messages, "Operation Learning Agent")}
          messages={filterAgentMessages(messages, "Operation Learning Agent")}
          highlightedMessages={highlightedMessages}
          expandedMessages={expandedMessages}
          onToggleExpand={toggleMessageExpand}
        />
        <AgentCard
          name="Query Processing Agent"
          icon={<Search className="h-5 w-5" />}
          description="Interprets natural language queries"
          messageCount={countAgentMessages(messages, "Query Processing Agent")}
          messages={filterAgentMessages(messages, "Query Processing Agent")}
          highlightedMessages={highlightedMessages}
          expandedMessages={expandedMessages}
          onToggleExpand={toggleMessageExpand}
        />
        <AgentCard
          name="Orchestration Agent"
          icon={<Calculator className="h-5 w-5" />}
          description="Coordinates all agent activities"
          messageCount={countAgentMessages(messages, "Orchestration Agent")}
          messages={filterAgentMessages(messages, "Orchestration Agent")}
          highlightedMessages={highlightedMessages}
          expandedMessages={expandedMessages}
          onToggleExpand={toggleMessageExpand}
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-[500px]" />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          The agent network visualization shows how specialized AI agents collaborate to process your tensor data. Lines
          represent communication between agents, with brighter lines indicating more recent activity.
        </p>
      </div>
    </div>
  )
}

interface AgentCardProps {
  name: string
  icon: React.ReactNode
  description: string
  messageCount: number
  messages: AgentMessage[]
  highlightedMessages: Record<string, boolean>
  expandedMessages: Record<string, boolean>
  onToggleExpand: (id: string) => void
}

function AgentCard({
  name,
  icon,
  description,
  messageCount,
  messages,
  highlightedMessages,
  expandedMessages,
  onToggleExpand,
}: AgentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${messageCount > 0 ? "bg-primary" : "bg-muted"}`}></div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-primary">{icon}</div>
          <h3 className="font-medium text-sm">{name}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {messageCount > 0 && (
          <div className="mt-2 text-xs font-medium text-primary">
            {messageCount} message{messageCount !== 1 ? "s" : ""}
          </div>
        )}

        {/* Recent messages */}
        {messages.length > 0 && (
          <div className="mt-3 space-y-2">
            {messages.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={`text-xs p-2 rounded-md transition-all duration-500 ${
                  highlightedMessages[msg.id] ? "bg-primary/20 border-l-4 border-primary" : "bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  {msg.message.length > 100 && (
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => onToggleExpand(msg.id)}>
                      {expandedMessages[msg.id] ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
                <p className={`mt-1 ${!expandedMessages[msg.id] && msg.message.length > 100 ? "line-clamp-2" : ""}`}>
                  {msg.message}
                </p>
                {!expandedMessages[msg.id] && msg.message.length > 100 && (
                  <Button variant="link" size="sm" className="h-5 p-0 text-xs" onClick={() => onToggleExpand(msg.id)}>
                    Show more
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function countAgentMessages(messages: AgentMessage[], agentName: string): number {
  return messages.filter((msg) => msg.agent === agentName).length
}

function filterAgentMessages(messages: AgentMessage[], agentName: string): AgentMessage[] {
  return messages.filter((msg) => msg.agent === agentName)
}

function drawAgentNetwork(ctx: CanvasRenderingContext2D, width: number, height: number, messages: AgentMessage[]) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Define agent positions
  const agents = [
    { name: "Data Ingestion Agent", x: width * 0.2, y: height * 0.3 },
    { name: "Tensor Transformation Agent", x: width * 0.4, y: height * 0.2 },
    { name: "Operation Learning Agent", x: width * 0.6, y: height * 0.2 },
    { name: "Query Processing Agent", x: width * 0.8, y: height * 0.3 },
    { name: "Orchestration Agent", x: width * 0.5, y: height * 0.6 },
  ]

  // Draw connections between agents
  ctx.lineWidth = 1

  // Draw static connections
  ctx.strokeStyle = "rgba(100, 116, 139, 0.2)"
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      ctx.beginPath()
      ctx.moveTo(agents[i].x, agents[i].y)
      ctx.lineTo(agents[j].x, agents[j].y)
      ctx.stroke()
    }
  }

  // Draw dynamic connections based on messages
  const now = new Date().getTime()

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const sourceAgent = agents.find((a) => a.name === msg.agent)

    if (!sourceAgent) continue

    // Find target agent (usually the orchestration agent if not specified)
    const targetAgent = agents.find((a) => a.name === "Orchestration Agent")

    if (!targetAgent || sourceAgent.name === targetAgent.name) continue

    // Calculate message age (in seconds)
    const msgTime = new Date(msg.timestamp).getTime()
    const ageInSeconds = (now - msgTime) / 1000

    // Only show recent messages (last 30 seconds)
    if (ageInSeconds > 30) continue

    // Opacity based on age
    const opacity = Math.max(0.1, 1 - ageInSeconds / 30)

    // Draw connection
    ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(sourceAgent.x, sourceAgent.y)
    ctx.lineTo(targetAgent.x, targetAgent.y)
    ctx.stroke()

    // Draw moving particle along the line
    const progress = (Date.now() % 2000) / 2000
    const particleX = sourceAgent.x + (targetAgent.x - sourceAgent.x) * progress
    const particleY = sourceAgent.y + (targetAgent.y - sourceAgent.y) * progress

    ctx.fillStyle = `rgba(79, 70, 229, ${opacity})`
    ctx.beginPath()
    ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw agents
  for (const agent of agents) {
    // Check if this agent has any messages
    const hasMessages = messages.some((msg) => msg.agent === agent.name)

    // Draw agent node
    ctx.fillStyle = hasMessages ? "#4f46e5" : "#94a3b8"
    ctx.beginPath()
    ctx.arc(agent.x, agent.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw agent label
    ctx.fillStyle = "#f8fafc"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw first letter of each word
    const initials = agent.name
      .split(" ")
      .map((word) => word[0])
      .join("")

    ctx.fillText(initials, agent.x, agent.y)

    // Draw agent name below
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.fillText(agent.name.split(" ")[0], agent.x, agent.y + 35)
    ctx.fillText(agent.name.split(" ").slice(1).join(" "), agent.x, agent.y + 50)
  }
}
