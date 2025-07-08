export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}