import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <main className="flex h-dvh w-full items-center justify-center">
      {/* Accessible loading text for screen-reader users */}
      <span className="sr-only">Signing in…</span>

      {/* Animated spinner */}
      <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-muted-foreground" />
    </main>
  )
}
