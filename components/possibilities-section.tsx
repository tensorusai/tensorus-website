"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Microscope, BookOpen, LineChart, Stethoscope, ShieldCheck } from "lucide-react"

export function PossibilitiesSection() {
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Unlock Limitless Possibilities</h2>
          <p className="text-xl text-primary font-medium mb-4">
            From Healthcare to Finance, From Research to Education
          </p>
          <p className="text-muted-foreground">
            Tensorus is not just for tech companies. Imagine a system that can understand complex medical data, predict
            market trends with greater accuracy, or even create personalized learning experiences. The potential uses
            for Tensorus are vast and span across many different fields. Tensorus is designed to be the ultimate data
            solution, adapting to any challenge or dataset.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UseCaseCard
            icon={<Stethoscope className="h-6 w-6" />}
            title="Healthcare"
            description="Process complex patient data to identify patterns, predict outcomes, and personalize treatment plans."
            examples={["Disease prediction", "Treatment optimization", "Medical imaging analysis"]}
            delay={0.1}
          />
          <UseCaseCard
            icon={<LineChart className="h-6 w-6" />}
            title="Finance"
            description="Analyze market trends, detect fraud, and optimize investment strategies with unprecedented accuracy."
            examples={["Risk assessment", "Fraud detection", "Algorithmic trading"]}
            delay={0.2}
          />
          <UseCaseCard
            icon={<Microscope className="h-6 w-6" />}
            title="Scientific Research"
            description="Accelerate discoveries by finding patterns in complex experimental data across multiple dimensions."
            examples={["Genomic analysis", "Material science", "Climate modeling"]}
            delay={0.3}
          />
          <UseCaseCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Education"
            description="Create personalized learning experiences that adapt to each student's unique needs and learning style."
            examples={["Adaptive learning", "Performance prediction", "Content recommendation"]}
            delay={0.4}
          />
          <UseCaseCard
            icon={<Activity className="h-6 w-6" />}
            title="Manufacturing"
            description="Optimize production processes, predict maintenance needs, and ensure quality control."
            examples={["Predictive maintenance", "Quality assurance", "Supply chain optimization"]}
            delay={0.5}
          />
          <UseCaseCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Cybersecurity"
            description="Detect and respond to threats in real-time by analyzing patterns across vast amounts of network data."
            examples={["Anomaly detection", "Threat intelligence", "Behavioral analysis"]}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  )
}

interface UseCaseCardProps {
  icon: React.ReactNode
  title: string
  description: string
  examples: string[]
  delay: number
}

function UseCaseCard({ icon, title, description, examples, delay }: UseCaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="space-y-2">
            <div className="text-sm font-medium">Applications:</div>
            <ul className="space-y-1">
              {examples.map((example, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
