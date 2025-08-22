import type { APIKey, APIKeyForm, StoredAPIKey, APIKeyStats } from "../types/api-keys"

const STORAGE_KEY = 'tensorus_api_keys'

export function generateAPIKey(): string {
  const prefix = 'tsr_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = prefix
  
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export function maskAPIKey(key: string): string {
  if (key.length <= 12) return key
  return key.substring(0, 8) + '...' + key.substring(key.length - 4)
}

export function hashAPIKey(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function createAPIKey(form: APIKeyForm): APIKey {
  const key = generateAPIKey()
  const id = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    id,
    name: form.name,
    description: form.description,
    key,
    maskedKey: maskAPIKey(key),
    created: new Date().toISOString(),
    expirationDate: form.expirationDate?.toISOString(),
    status: 'active',
    usageCount: 0
  }
}

export function saveAPIKey(apiKey: APIKey): void {
  const keys = getStoredAPIKeys()
  const storedKey: StoredAPIKey = {
    id: apiKey.id,
    name: apiKey.name,
    description: apiKey.description,
    keyHash: hashAPIKey(apiKey.key),
    maskedKey: apiKey.maskedKey,
    created: apiKey.created,
    lastUsed: apiKey.lastUsed,
    expirationDate: apiKey.expirationDate,
    status: apiKey.status,
    usageCount: apiKey.usageCount
  }
  
  keys.push(storedKey)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function getStoredAPIKeys(): StoredAPIKey[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function updateAPIKey(keyId: string, updates: Partial<StoredAPIKey>): void {
  const keys = getStoredAPIKeys()
  const updatedKeys = keys.map(key => 
    key.id === keyId ? { ...key, ...updates } : key
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys))
}

export function revokeAPIKey(keyId: string): void {
  updateAPIKey(keyId, { status: 'revoked' })
}

export function deleteAPIKey(keyId: string): void {
  const keys = getStoredAPIKeys()
  const filteredKeys = keys.filter(key => key.id !== keyId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredKeys))
}

export function getAPIKeyStats(): APIKeyStats {
  const keys = getStoredAPIKeys()
  
  return {
    totalKeys: keys.length,
    activeKeys: keys.filter(k => k.status === 'active').length,
    revokedKeys: keys.filter(k => k.status === 'revoked').length,
    totalUsage: keys.reduce((sum, key) => sum + key.usageCount, 0),
    lastUsed: keys
      .filter(k => k.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())[0]?.lastUsed
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

export function isKeyExpired(key: StoredAPIKey): boolean {
  if (!key.expirationDate) return false
  return new Date(key.expirationDate) < new Date()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
