"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Brain, Database, Network, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Introducing Our Agentic Tensor Database
          </h2>
          <p className="text-xl text-muted-foreground">Where Innovation Meets Intelligent Data Management</p>
          <div className="mt-6">
            <p className="text-muted-foreground">
              Tensorus isn't just another data platform—it's a breakthrough in how we handle multi-dimensional
              information. Our agentic approach turns every piece of data into a proactive contributor to AI-driven
              insights. By fusing advanced tensor operations with self-learning agents, Tensorus redefines what's
              possible in big data, analytics, and real-time decision-making.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Brain className="h-10 w-10" />}
            title="AI-Powered Agents"
            description="Tensorus utilizes AI agents to organize and use data for customized solutions. The system learns your needs and adjusts accordingly."
            delay={0.1}
          />
          <FeatureCard
            icon={<Database className="h-10 w-10" />}
            title="Dynamic Data Processing"
            description="Unlike static databases, Tensorus actively transforms and connects data, allowing for much faster and more intuitive analysis."
            delay={0.2}
          />
          <FeatureCard
            icon={<Network className="h-10 w-10" />}
            title="Universal Data Handling"
            description="Whether it's text, numbers, images, or something else, Tensorus handles all types of data in a unified, dynamic way."
            delay={0.3}
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="Efficiency and Speed"
            description="Tensorus efficiently stores and retrieves data by breaking it into smaller, more manageable components, speeding up the analysis process."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-primary mb-4 bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
