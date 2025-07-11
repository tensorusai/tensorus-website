"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, CheckCircle, XCircle, AlertCircle, ArrowLeft, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ConfigCheckPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
    setTimeout(() => setCopied(''), 2000)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tensorus.com'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const redirectUrls = [
    `${siteUrl}/auth/callback`,
    `${siteUrl}/auth/callback?*`,
    `https://tensorus.com/auth/callback`,
    `https://tensorus.com/auth/callback?*`,
    `http://localhost:3000/auth/callback`,
    `http://localhost:3000/auth/callback?*`,
  ]

  const emailTemplates = {
    signup: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup&next=/dashboard`,
    recovery: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password`,
    emailChange: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email_change&next=/dashboard`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Database className="h-8 w-8 text-primary" />
            Tensorus
          </Link>
          <p className="text-muted-foreground mt-2">
            Supabase Configuration Checker
          </p>
        </div>

        <div className="space-y-6">
          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {supabaseUrl && supabaseAnonKey ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {supabaseUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
                </div>
                <code className="text-sm bg-muted p-2 rounded block break-all">
                  {supabaseUrl || 'Not configured'}
                </code>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {supabaseAnonKey ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
                <code className="text-sm bg-muted p-2 rounded block break-all">
                  {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not configured'}
                </code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">NEXT_PUBLIC_SITE_URL</span>
                </div>
                <code className="text-sm bg-muted p-2 rounded block break-all">
                  {siteUrl}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Dashboard Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Required Supabase Dashboard Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to configure these settings in your Supabase dashboard for email links to work properly.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Site URL (Authentication → URL Configuration)</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm bg-muted p-2 rounded flex-1">{siteUrl}</code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(siteUrl, 'Site URL')}
                    >
                      <Copy className="h-4 w-4" />
                      {copied === 'Site URL' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Redirect URLs (Authentication → URL Configuration)</h3>
                  <p className="text-sm text-muted-foreground mb-2">Add these URLs to "Additional Redirect URLs":</p>
                  <div className="space-y-2">
                    {redirectUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <code className="text-sm bg-muted p-2 rounded flex-1">{url}</code>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(url, `Redirect URL ${index + 1}`)}
                        >
                          <Copy className="h-4 w-4" />
                          {copied === `Redirect URL ${index + 1}` ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => copyToClipboard(redirectUrls.join('\n'), 'All Redirect URLs')}
                  >
                    Copy All URLs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Email Templates (Authentication → Email Templates)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Update your email templates to use the correct callback URLs. Replace the existing redirect URLs with these:
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Confirm Signup Template</h3>
                  <p className="text-sm text-muted-foreground mb-2">Replace the existing link with:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted p-2 rounded flex-1 break-all">
                      {emailTemplates.signup}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(emailTemplates.signup, 'Signup Template')}
                    >
                      <Copy className="h-4 w-4" />
                      {copied === 'Signup Template' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Reset Password Template</h3>
                  <p className="text-sm text-muted-foreground mb-2">Replace the existing link with:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted p-2 rounded flex-1 break-all">
                      {emailTemplates.recovery}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(emailTemplates.recovery, 'Recovery Template')}
                    >
                      <Copy className="h-4 w-4" />
                      {copied === 'Recovery Template' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Email Change Template</h3>
                  <p className="text-sm text-muted-foreground mb-2">Replace the existing link with:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted p-2 rounded flex-1 break-all">
                      {emailTemplates.emailChange}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(emailTemplates.emailChange, 'Email Change Template')}
                    >
                      <Copy className="h-4 w-4" />
                      {copied === 'Email Change Template' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Additional Authentication Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Enable these settings in Authentication → Settings:</p>
                <ul className="space-y-1 text-sm">
                  <li>✅ Enable email confirmations</li>
                  <li>✅ Double confirm email changes (recommended)</li>
                  <li>✅ Secure email change (recommended)</li>
                  <li>✅ Enable sign ups</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Open Supabase Dashboard</h3>
                <p className="text-sm text-muted-foreground">Go to your project dashboard at supabase.com</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">2. Configure URLs</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Authentication → URL Configuration and set the Site URL and Redirect URLs above
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">3. Update Email Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Authentication → Email Templates and update the templates with the URLs above
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">4. Test</h3>
                <p className="text-sm text-muted-foreground">
                  Try signing up with a new email or requesting a password reset
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 space-y-4">
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/signup">Test Signup</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/reset-password">Test Password Reset</Link>
            </Button>
          </div>
          
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}