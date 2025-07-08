"use client"

import { motion } from "framer-motion"
import { TensorAnimation } from "./tensor-animation"

export function TransformSection() {
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transforming Data Into Dynamic Insights</h2>
            <p className="text-xl text-primary font-medium">From Simple Storage to Dynamic Analysis</p>
            <p className="text-muted-foreground">
              At its core, Tensorus treats all data as interconnected pieces of a puzzle. We call these pieces "tensors"
              – multi-dimensional building blocks. Tensorus learns how to transform and connect data, allowing AI agents
              to pull exactly what's needed. It's not just about storing information; it's about how that information
              actively helps you solve real problems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="font-medium mb-2">Multi-dimensional Analysis</div>
                <p className="text-sm text-muted-foreground">
                  Process complex data structures with multiple dimensions and relationships
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="font-medium mb-2">Adaptive Learning</div>
                <p className="text-sm text-muted-foreground">
                  System continuously improves its understanding of your data patterns
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="font-medium mb-2">Intelligent Connections</div>
                <p className="text-sm text-muted-foreground">
                  Automatically discover and leverage relationships between data points
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="font-medium mb-2">Real-time Processing</div>
                <p className="text-sm text-muted-foreground">
                  Transform and analyze data on-the-fly as it enters the system
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border overflow-hidden shadow-xl h-[400px]">
              <div className="h-full">
                <TensorAnimation />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="text-sm font-medium text-primary mb-2">Tensor Visualization</div>
                <div className="font-semibold mb-1">Multi-dimensional Data Structure</div>
                <p className="text-sm text-muted-foreground">
                  Visual representation of how Tensorus transforms and connects your data
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
