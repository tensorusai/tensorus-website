"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...')
        
        const supabase = createClient()
        
        // Test 1: Basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        
        if (error) {
          if (error.message.includes('relation "profiles" does not exist')) {
            setStatus('✅ Connection successful - Database exists but profiles table not created yet')
            setDetails({ 
              error: error.message,
              url: process.env.NEXT_PUBLIC_SUPABASE_URL,
              hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            })
          } else {
            setStatus('❌ Connection error')
            setDetails({ error: error.message })
          }
        } else {
          setStatus('✅ Connection successful - Profiles table exists')
          setDetails({ data })
        }
        
      } catch (err: any) {
        setStatus('❌ Connection failed')
        setDetails({ error: err.message })
        console.error('Supabase test error:', err)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold">Status:</h2>
        <p>{status}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold">Environment:</h2>
        <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
      </div>
      
      {details && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Details:</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}