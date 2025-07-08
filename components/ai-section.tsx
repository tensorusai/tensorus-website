"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Cpu, Network, Brain } from "lucide-react"

export function AISection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Revolutionary AI Technology</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Revolutionizing AI Through Tensors</h2>
          <p className="text-muted-foreground">
            Tensorus seamlessly connects tensor-based data structures with the power of autonomous AI agents. By
            bridging the gap between raw data and intelligent models, Tensorus enables revolutionary progress in deep
            learning, real-time analytics, and beyond. Experience a new paradigm where your database is an active
            collaborator in AI-driven solutions, constantly learning and evolving to meet tomorrow's challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Self-Learning Architecture</h3>
                <p className="text-muted-foreground">
                  Tensorus agents continuously learn from interactions, improving their understanding of your data and
                  optimizing operations over time without explicit programming.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Network className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Collaborative Intelligence</h3>
                <p className="text-muted-foreground">
                  Specialized agents work together, each handling specific aspects of data management while sharing
                  insights to create a unified, intelligent system greater than the sum of its parts.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tensor-Native Processing</h3>
                <p className="text-muted-foreground">
                  By storing and processing data as tensors, Tensorus enables direct integration with AI models,
                  eliminating conversion overhead and accelerating machine learning workflows.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
