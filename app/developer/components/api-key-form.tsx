"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Copy, Eye, EyeOff, Plus, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createAPIKey, saveAPIKey, copyToClipboard } from "../utils/api-keys"
import type { APIKeyForm, APIKey } from "../types/api-keys"

interface APIKeyFormProps {
  onKeyGenerated?: (key: APIKey) => void
}

export function APIKeyForm({ onKeyGenerated }: APIKeyFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<APIKeyForm>({
    name: '',
    description: '',
    expirationDate: undefined
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<APIKey | null>(null)
  const [showFullKey, setShowFullKey] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'API key name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'API key name must be at least 3 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'API key name must be less than 50 characters'
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters'
    }

    if (formData.expirationDate && formData.expirationDate < new Date()) {
      newErrors.expirationDate = 'Expiration date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsGenerating(true)
    
    try {
      setTimeout(() => {
        const newKey = createAPIKey(formData)
        saveAPIKey(newKey)
        setGeneratedKey(newKey)
        setShowFullKey(true)
        
        toast({
          title: "API Key Generated",
          description: "Your new API key has been created successfully. Make sure to copy it now!",
        })

        onKeyGenerated?.(newKey)
        setIsGenerating(false)
      }, 1500)
    } catch (error) {
      console.error('Error generating API key:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const handleCopyKey = async () => {
    if (!generatedKey) return
    
    const success = await copyToClipboard(generatedKey.key)
    if (success) {
      toast({
        title: "Copied to Clipboard",
        description: "API key has been copied to your clipboard.",
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy API key. Please copy it manually.",
        variant: "destructive",
      })
    }
  }

  const handleNewKey = () => {
    setGeneratedKey(null)
    setShowFullKey(false)
    setFormData({
      name: '',
      description: '',
      expirationDate: undefined
    })
    setErrors({})
  }

  if (generatedKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            API Key Generated
          </CardTitle>
          <CardDescription>
            Your API key has been generated successfully. Copy it now as it won't be shown again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This is the only time you'll see the full API key. 
              Copy it now and store it securely.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>API Key Name</Label>
            <Input value={generatedKey.name} readOnly />
          </div>

          {generatedKey.description && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={generatedKey.description} readOnly />
            </div>
          )}

          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input
                value={showFullKey ? generatedKey.key : generatedKey.maskedKey}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullKey(!showFullKey)}
              >
                {showFullKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyKey}
                disabled={!showFullKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Created</Label>
            <Input value={format(new Date(generatedKey.created), 'PPP p')} readOnly />
          </div>

          {generatedKey.expirationDate && (
            <div className="space-y-2">
              <Label>Expires</Label>
              <Input value={format(new Date(generatedKey.expirationDate), 'PPP')} readOnly />
            </div>
          )}

          <Button onClick={handleNewKey} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Generate Another Key
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New API Key</CardTitle>
        <CardDescription>
          Create a new API key to access Tensorus services. You can set an optional expiration date for security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Key Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Production API, Development Key"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this key will be used for..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={errors.description ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Expiration Date (Optional)</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expirationDate && "text-muted-foreground",
                    errors.expirationDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expirationDate ? (
                    format(formData.expirationDate, "PPP")
                  ) : (
                    <span>No expiration (recommended)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expirationDate}
                  onSelect={(date) => {
                    setFormData({...formData, expirationDate: date})
                    setIsCalendarOpen(false)
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
                {formData.expirationDate && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({...formData, expirationDate: undefined})
                        setIsCalendarOpen(false)
                      }}
                      className="w-full"
                    >
                      Clear Date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {errors.expirationDate && (
              <p className="text-sm text-destructive">{errors.expirationDate}</p>
            )}
          </div>

          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Key...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Generate API Key
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
