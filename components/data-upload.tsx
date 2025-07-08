"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, Loader2, Download } from "lucide-react"
import type { DataFile } from "@/types/database"
import { parseFileContent } from "@/utils/data-processing"

interface DataUploadProps {
  onUpload: (file: DataFile, parsedContent: any) => void
  isProcessing: boolean
  existingFiles: DataFile[]
}

export function DataUpload({ onUpload, isProcessing, existingFiles }: DataUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Parse the file content
      const fileType = getFileType(file.name)
      const parsedContent = await parseFileContent(file, fileType)

      // Create a data file object
      const dataFile: DataFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        description: description.trim() || `Uploaded ${file.name}`,
        timestamp: new Date().toISOString(),
      }

      // Call the onUpload callback
      onUpload(dataFile, parsedContent)

      // Reset form
      setFile(null)
      setDescription("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(`Error processing file: ${(err as Error).message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    if (["csv", "tsv", "txt"].includes(extension)) {
      return "tabular"
    } else if (["json"].includes(extension)) {
      return "json"
    } else if (["md", "txt"].includes(extension)) {
      return "text"
    } else {
      return "tabular" // Default to tabular
    }
  }

  const generateSampleData = () => {
    // Generate sample CSV data
    const headers = ["date", "sales", "marketing_spend", "website_traffic", "conversion_rate", "customer_satisfaction"]
    const rows = []

    // Start date
    const startDate = new Date(2023, 0, 1)

    // Generate 1000 rows of data
    for (let i = 0; i < 1000; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      // Base values
      let sales = 1000 + Math.random() * 500
      let marketing = 200 + Math.random() * 100
      let traffic = 5000 + Math.random() * 2000
      let conversion = 0.02 + Math.random() * 0.03
      let satisfaction = 7 + Math.random() * 3

      // Add seasonal patterns
      const month = date.getMonth()
      const dayOfWeek = date.getDay()

      // Seasonal adjustments
      if (month >= 10) {
        // Holiday season
        sales *= 1.3
        traffic *= 1.4
        marketing *= 1.2
      } else if (month >= 5 && month <= 7) {
        // Summer
        sales *= 0.9
        traffic *= 0.8
      }

      // Day of week adjustments
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend
        traffic *= 0.7
        conversion *= 1.2
      } else if (dayOfWeek === 1) {
        // Monday
        traffic *= 0.9
      } else if (dayOfWeek === 5) {
        // Friday
        traffic *= 1.1
      }

      // Marketing affects traffic with a lag
      if (i > 0) {
        traffic += (rows[i - 1][2] - 200) * 5
      }

      // Traffic affects sales
      sales += (traffic - 5000) * 0.05

      // Add some random spikes and anomalies
      if (Math.random() < 0.01) {
        traffic *= 2 // Traffic spike
      }
      if (Math.random() < 0.01) {
        sales *= 0.5 // Sales drop
      }
      if (Math.random() < 0.01) {
        satisfaction *= 0.7 // Satisfaction issue
      }

      rows.push([
        date.toISOString().split("T")[0],
        sales.toFixed(2),
        marketing.toFixed(2),
        Math.round(traffic),
        conversion.toFixed(4),
        satisfaction.toFixed(1),
      ])
    }

    // Convert to CSV
    const csv = [headers.join(",")].concat(rows.map((row) => row.join(","))).join("\n")

    // Create and download the file
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_business_data.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Upload Data File</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept=".csv,.json,.txt,.tsv"
            onChange={handleFileChange}
            disabled={isProcessing || isUploading}
          />
          <p className="text-sm text-muted-foreground">Supported formats: CSV, JSON, TXT, TSV</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your data to help the AI understand it better..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isProcessing || isUploading}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={!file || isProcessing || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={generateSampleData} disabled={isProcessing || isUploading}>
            <Download className="mr-2 h-4 w-4" />
            Generate Sample Data
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {existingFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {existingFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <File className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{file.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{new Date(file.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
