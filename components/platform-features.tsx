"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Cpu,
  Search,
  Zap,
  Layers,
  Braces,
  Server,
  Lock,
  BarChart,
  GitBranch,
  FileCode,
  Fingerprint,
  Gauge,
  Brain,
} from "lucide-react"

export function PlatformFeatures() {
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Comprehensive Feature Set</h2>
          <p className="text-xl text-muted-foreground">
            Tensorus provides a rich set of features designed specifically for AI and machine learning workflows
          </p>
        </motion.div>

        <Tabs defaultValue="core" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="core">Core Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="core" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Database className="h-5 w-5" />}
                title="Native Tensor Support"
                description="Store and query multi-dimensional tensor data without flattening or loss of structure"
              />
              <FeatureCard
                icon={<Search className="h-5 w-5" />}
                title="Advanced Indexing"
                description="Fast similarity search optimized for high-dimensional tensor data using FAISS"
              />
              <FeatureCard
                icon={<Cpu className="h-5 w-5" />}
                title="GPU Acceleration"
                description="Hardware-accelerated tensor operations for real-time processing and analysis"
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Seamless AI/ML Integration"
                description="Direct compatibility with popular deep learning frameworks like PyTorch and TensorFlow"
              />
              <FeatureCard
                icon={<Braces className="h-5 w-5" />}
                title="Comprehensive API"
                description="RESTful interface for easy integration with various applications and services"
              />
              <FeatureCard
                icon={<Server className="h-5 w-5" />}
                title="Scalable Architecture"
                description="Built for distributed environments and high-throughput workloads"
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Brain className="h-5 w-5" />}
                title="Agentic Reconfiguration"
                description="Self-optimizing database that learns from access patterns using reinforcement learning"
              />
              <FeatureCard
                icon={<GitBranch className="h-5 w-5" />}
                title="Blockchain Provenance"
                description="Immutable audit trail of all tensor operations for data provenance"
              />
              <FeatureCard
                icon={<FileCode className="h-5 w-5" />}
                title="Tensor Query Language"
                description="SQL-like language specifically designed for tensor operations"
              />
              <FeatureCard
                icon={<Layers className="h-5 w-5" />}
                title="Distributed Processing"
                description="Horizontal scaling with partitioning and federated learning capabilities"
              />
              <FeatureCard
                icon={<Lock className="h-5 w-5" />}
                title="Enterprise Security"
                description="Authentication, authorization, and comprehensive audit logging"
              />
              <FeatureCard
                icon={<Fingerprint className="h-5 w-5" />}
                title="Differential Privacy"
                description="Noise-based privacy protection mechanisms for sensitive tensor data"
              />
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}
