import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DemoIntro() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Tensor Database Demo</CardTitle>
          <CardDescription>Experience the power of Agentic Tensor Database with real data processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This demo allows you to experience the capabilities of our Agentic Tensor Database with real data
            processing. Follow these steps to get started:
          </p>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Download the sample data</strong> - Use the "Download Sample Data" button to get a CSV file with
              realistic business metrics including sales, website traffic, and more.
            </li>
            <li>
              <strong>Upload the file</strong> - Upload the downloaded file (or your own data) with a brief description.
            </li>
            <li>
              <strong>Explore the tensor visualization</strong> - See how your data is transformed into a
              multidimensional tensor representation with interactive visualizations.
            </li>
            <li>
              <strong>Ask questions using natural language</strong> - Use the query interface to ask questions about
              your data in plain English. Our AI agents will analyze the tensor data and provide insights.
            </li>
            <li>
              <strong>Discover insights</strong> - View automatically generated insights about your data, including
              patterns, anomalies, and correlations.
            </li>
          </ol>

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Note:</strong> This demo processes your data entirely in the browser. Your data is not sent to any
              server, ensuring privacy and security. The AI analysis is powered by Google's Gemma-3 model via the
              Hugging Face API.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
