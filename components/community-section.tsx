"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Users, Code, MessageSquare } from "lucide-react"

export function CommunitySection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Be Part of the Future of Data</h2>
            <p className="text-xl text-primary font-medium">An Open-Source Project For The Future</p>
            <p className="text-muted-foreground">
              Tensorus is an open-source project, and we invite you to join our growing community. Whether you are a
              developer, data scientist, or simply an innovator, there is a place for you. Together, we can make data
              more powerful, more accessible, and more meaningful.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild>
                <Link href="https://github.com/tensorus" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="https://huggingface.co/tensorus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span className="text-2xl">🤗</span>
                  Huggingface
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <CommunityCard
              icon={<Code className="h-6 w-6" />}
              title="For Developers"
              description="Contribute to the codebase, build integrations, or create applications powered by Tensorus."
              delay={0.1}
            />
            <CommunityCard
              icon={<Users className="h-6 w-6" />}
              title="For Organizations"
              description="Implement Tensorus in your workflow to transform how you handle and analyze data."
              delay={0.2}
            />
            <CommunityCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="For Researchers"
              description="Explore new possibilities in data science and machine learning with tensor-based approaches."
              delay={0.3}
            />
            <CommunityCard
              icon={<Github className="h-6 w-6" />}
              title="For Contributors"
              description="Help shape the future of Tensorus by contributing documentation, examples, or feedback."
              delay={0.4}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Join Our Growing Community</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Be part of a community that's redefining how we work with data. Share ideas, collaborate on projects, and
            help shape the future of Tensorus.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

interface CommunityCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function CommunityCard({ icon, title, description, delay }: CommunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}
