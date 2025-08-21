import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Database, Loader2 } from 'lucide-react'

export default function CallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Database className="h-8 w-8 text-primary" />
            Tensorus
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Processing Authentication</h2>
              <p className="text-muted-foreground">Please wait while we confirm your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}