"use client"

import { motion } from "framer-motion"
import { Database, Cpu, Brain, Network } from "lucide-react"

export function PlatformHero() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              Advanced Agentic Tensor Database
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">The Future of AI-Native Data Storage</h1>
            <p className="text-xl text-muted-foreground">
              Tensorus is a specialized database designed for AI and machine learning applications. While traditional
              databases store simple data types and vector databases store flat arrays, Tensorus can store and process
              multi-dimensional arrays called tensors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="text-primary mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Native Tensor Support</h3>
              <p className="text-sm text-muted-foreground">
                Store and query multi-dimensional tensor data without flattening or loss of structure
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="text-primary mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">GPU Acceleration</h3>
              <p className="text-sm text-muted-foreground">
                Hardware-accelerated tensor operations for real-time processing and analysis
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="text-primary mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Self-Optimizing</h3>
              <p className="text-sm text-muted-foreground">
                Uses AI to improve its performance and adapt to your specific data patterns
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="text-primary mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">ML Integration</h3>
              <p className="text-sm text-muted-foreground">
                Seamless integration with popular deep learning frameworks and workflows
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
