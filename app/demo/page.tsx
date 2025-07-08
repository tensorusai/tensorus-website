import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"
import { Header } from "@/components/header"
import { DemoIntro } from "@/components/demo-intro"

export const metadata: Metadata = {
  title: "Tensorus Demo | Agentic Tensor Database",
  description: "Experience the power of Tensorus with our interactive demo",
}

export default function DemoPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <DemoIntro />
      <Dashboard />
    </main>
  )
}
