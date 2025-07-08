"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Terminal, Package, Server, Code } from "lucide-react"

export function PlatformGettingStarted() {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Getting Started</h2>
          <p className="text-xl text-muted-foreground">Follow these steps to start using Tensorus in your projects</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <span>Installation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Install Tensorus using pip, the Python package manager:
                  </p>
                  <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono">
                    pip install tensorus
                  </pre>
                  <p className="text-sm text-muted-foreground">For GPU support, install the CUDA version:</p>
                  <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono">
                    pip install tensorus[gpu]
                  </pre>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Requirements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>Python 3.8 or newer</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>NumPy and PyTorch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>HDF5 for storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>FAISS for similarity search</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>CUDA 11.0+ (optional, for GPU support)</span>
                    </li>
                  </ul>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <span>Quick Start</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Create your first Tensorus database:</p>
                  <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono">
                    {`import numpy as np
from tensorus import TensorDatabase

# Initialize database
db = TensorDatabase("my_db.h5")

# Save a tensor
tensor = np.random.randn(10, 10)
tensor_id = db.save(tensor, {"name": "test"})

# Retrieve the tensor
result, metadata = db.get(tensor_id)
print(result.shape)  # (10, 10)`}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <span>Deployment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Deploy Tensorus as a service:</p>
                  <pre className="text-xs overflow-x-auto bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono">
                    {`# server.py
from flask import Flask, request, jsonify
from tensorus import TensorDatabase

app = Flask(__name__)
db = TensorDatabase("tensors.h5")

@app.route("/tensor/<tensor_id>", methods=["GET"])
def get_tensor(tensor_id):
    tensor, metadata = db.get(tensor_id)
    return jsonify({
        "shape": tensor.shape,
        "metadata": metadata
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)`}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Button asChild size="lg">
              <Link href="/guide" className="gap-2">
                <span>Read the Full Documentation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
