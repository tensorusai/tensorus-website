"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ClientHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        // Handle the auth callback from URL hash
        const { data, error } = await supabase.auth.getSessionFromUrl()
        
        if (error) {
          console.error('Error getting session from URL:', error)
          router.push('/auth/signin?error=callback_error&message=' + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          console.log('Session established from URL')
          
          // Check if this is a password recovery
          const urlParams = new URLSearchParams(window.location.search)
          const type = urlParams.get('type')
          const next = urlParams.get('next') || '/dashboard'
          
          if (type === 'recovery') {
            router.push('/auth/reset-password?type=recovery')
          } else {
            router.push(next)
          }
        } else {
          console.log('No session from URL, redirecting to signin')
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Error handling auth callback:', error)
        router.push('/auth/signin?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return null
}