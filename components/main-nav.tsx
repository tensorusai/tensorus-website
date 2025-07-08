import Link from "next/link"
import { Database } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Tensorus</span>
      </Link>
    </div>
  )
}
