export interface APIKey {
  id: string
  name: string
  description?: string
  key: string
  maskedKey: string
  created: string
  lastUsed?: string
  expirationDate?: string
  status: 'active' | 'revoked'
  usageCount: number
}

export interface APIKeyForm {
  name: string
  description?: string
  expirationDate?: Date
}

export interface KeyGenerationResult {
  success: boolean
  key?: APIKey
  error?: string
}

export interface APIKeyStats {
  totalKeys: number
  activeKeys: number
  revokedKeys: number
  totalUsage: number
  lastUsed?: string
}

export interface StoredAPIKey {
  id: string
  name: string
  description?: string
  keyHash: string
  maskedKey: string
  created: string
  lastUsed?: string
  expirationDate?: string
  status: 'active' | 'revoked'
  usageCount: number
}
