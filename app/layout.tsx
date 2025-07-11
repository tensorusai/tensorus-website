import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/supabase/context'
import { Toaster } from '@/components/ui/toaster'
import AuthErrorHandler from '@/components/auth-error-handler'

export const metadata: Metadata = {
  title: 'Tensorus: Agentic Tensor Database',
  description: 'A revolutionary way to store and use information powered by AI agents',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthErrorHandler />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
