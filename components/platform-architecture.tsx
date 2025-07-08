"use client"

import { motion } from "framer-motion"

export function PlatformArchitecture() {
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">System Architecture</h2>
          <p className="text-xl text-muted-foreground">
            Tensorus follows a layered architecture with clear separation of concerns
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-card border rounded-xl p-8 shadow-sm"
        >
          <pre className="text-xs md:text-sm overflow-x-auto font-mono text-muted-foreground">
            {`┌─────────────────────────────────────────────────────────────────┐
│                    Integration Layer (tensor_integration.py)     │
└─────────────────────────────────────────────────────────────────┘
          ▲               ▲                  ▲              ▲
          │               │                  │              │
┌─────────┴─────┐ ┌──────┴───────┐ ┌────────┴───────┐ ┌────┴─────┐
│   Database    │ │  Advanced    │ │  Security &    │ │ API Layer│
│  Core Layer   │ │  Features    │ │  Governance    │ │ (app.py) │
└───────────────┘ └──────────────┘ └────────────────┘ └──────────┘
      ▲ ▲ ▲              ▲                 ▲
      │ │ │              │                 │
┌─────┘ │ └──────┐ ┌─────┴─────┐ ┌─────────┴──────────┐
│       │        │ │           │ │                     │
▼       ▼        ▼ ▼           ▼ ▼                     ▼
┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Storage  │ │ Indexing │ │Processing│ │  Agent   │ │Blockchain│
│  Layer    │ │  Layer   │ │  Layer   │ │  Layer   │ │  Layer   │
└───────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
   (HDF5)       (FAISS)     (PyTorch)      (RL)        (Chain)`}
          </pre>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Core Components</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium">Storage Layer:</span>
                  <span>HDF5-based tensor storage with compression</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Indexing Layer:</span>
                  <span>FAISS-powered similarity search</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Processing Layer:</span>
                  <span>Tensor operations with PyTorch/TensorLy</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Database Layer:</span>
                  <span>Core integration of storage, indexing, and processing</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">API Layer:</span>
                  <span>RESTful endpoints for database interaction</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Components</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium">Agent Layer:</span>
                  <span>RL-based configuration optimizer</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Blockchain Layer:</span>
                  <span>Immutable operation logging</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Query Language:</span>
                  <span>TQL parser and executor</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Distributed System:</span>
                  <span>Multi-node capabilities</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium">Security System:</span>
                  <span>Auth, permissions, and privacy</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
