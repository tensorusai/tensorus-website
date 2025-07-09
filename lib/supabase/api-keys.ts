import { createClient } from './client'
import { createRouteClient } from './server'
import type { Database } from './database.types'

type APIKey = Database['public']['Tables']['api_keys']['Row']
type APIKeyInsert = Database['public']['Tables']['api_keys']['Insert']
type APIKeyUpdate = Database['public']['Tables']['api_keys']['Update']

export interface APIKeyForm {
  name: string
  description?: string
  expiresAt?: Date
}

export interface APIKeyResponse {
  success: boolean
  apiKey?: APIKey & { key?: string }
  error?: string
}

export interface APIKeysResponse {
  success: boolean
  apiKeys?: APIKey[]
  error?: string
}

// Generate a secure API key
export function generateAPIKey(): string {
  const prefix = 'tsr_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// Mask API key for display
export function maskAPIKey(key: string): string {
  if (key.length <= 12) return key
  return key.substring(0, 8) + '...' + key.substring(key.length - 4)
}

// Hash API key for storage
export function hashAPIKey(key: string): string {
  // Simple hash for demo - in production use crypto.subtle.digest or bcrypt
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export const apiKeyService = {
  // Create new API key
  async createAPIKey(form: APIKeyForm): Promise<APIKeyResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const key = generateAPIKey()
      const keyHash = hashAPIKey(key)
      const maskedKey = maskAPIKey(key)

      const insertData: APIKeyInsert = {
        user_id: user.id,
        name: form.name,
        description: form.description,
        key_hash: keyHash,
        masked_key: maskedKey,
        expires_at: form.expiresAt?.toISOString(),
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Return the full key only once during creation
      return { 
        success: true, 
        apiKey: { ...data, key } 
      }
    } catch (error) {
      return { success: false, error: 'Failed to create API key' }
    }
  },

  // Get user's API keys
  async getAPIKeys(): Promise<APIKeysResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, apiKeys: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch API keys' }
    }
  },

  // Update API key
  async updateAPIKey(keyId: string, updates: APIKeyUpdate): Promise<APIKeyResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', keyId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, apiKey: data }
    } catch (error) {
      return { success: false, error: 'Failed to update API key' }
    }
  },

  // Revoke API key
  async revokeAPIKey(keyId: string): Promise<APIKeyResponse> {
    return this.updateAPIKey(keyId, { status: 'revoked' })
  },

  // Delete API key
  async deleteAPIKey(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete API key' }
    }
  },

  // Increment usage count
  async incrementUsage(keyId: string): Promise<void> {
    try {
      const supabase = createClient()
      
      await supabase.rpc('increment_api_key_usage', { 
        key_id: keyId 
      })
    } catch (error) {
      console.error('Failed to increment API key usage:', error)
    }
  }
}

// Server-side API key service
export const serverApiKeyService = {
  // Validate API key
  async validateAPIKey(key: string): Promise<APIKey | null> {
    try {
      const supabase = createRouteClient()
      const keyHash = hashAPIKey(key)
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .eq('status', 'active')
        .single()

      if (error || !data) {
        return null
      }

      // Check if key is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  },

  // Get API key by ID (server-side)
  async getAPIKey(keyId: string): Promise<APIKey | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('id', keyId)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  },

  // Update last used timestamp
  async updateLastUsed(keyId: string): Promise<void> {
    try {
      const supabase = createRouteClient()
      
      await supabase
        .from('api_keys')
        .update({ 
          last_used_at: new Date().toISOString(),
          usage_count: supabase.rpc('increment_usage_count', { key_id: keyId })
        })
        .eq('id', keyId)
    } catch (error) {
      console.error('Failed to update last used timestamp:', error)
    }
  }
}