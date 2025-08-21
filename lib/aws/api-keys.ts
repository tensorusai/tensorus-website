import { query } from './database';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  masked_key: string;
  description?: string;
  status: 'active' | 'revoked';
  usage_count: number;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const apiKeyService = {
  async getApiKeys(userId: string): Promise<{ success: boolean; apiKeys?: ApiKey[]; error?: string }> {
    try {
      const result = await query(
        'SELECT * FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return { success: true, apiKeys: result.rows };
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return { success: false, error: 'Failed to fetch API keys' };
    }
  },

  async createApiKey(params: {
    userId: string;
    name: string;
    description?: string;
    expiresAt?: Date;
  }): Promise<{ success: boolean; apiKey?: ApiKey & { plainKey: string }; error?: string }> {
    try {
      const { userId, name, description, expiresAt } = params;
      
      // Generate API key
      const plainKey = `tk_${crypto.randomBytes(32).toString('hex')}`;
      const keyHash = crypto.createHash('sha256').update(plainKey).digest('hex');
      const maskedKey = `${plainKey.slice(0, 7)}${'*'.repeat(plainKey.length - 11)}${plainKey.slice(-4)}`;

      const result = await query(
        `INSERT INTO api_keys (user_id, name, key_hash, masked_key, description, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, name, keyHash, maskedKey, description, expiresAt]
      );

      return { 
        success: true, 
        apiKey: { ...result.rows[0], plainKey } 
      };
    } catch (error) {
      console.error('Error creating API key:', error);
      return { success: false, error: 'Failed to create API key' };
    }
  },

  async revokeApiKey(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await query(
        'UPDATE api_keys SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3',
        ['revoked', id, userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'API key not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error revoking API key:', error);
      return { success: false, error: 'Failed to revoke API key' };
    }
  },

  async deleteApiKey(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await query(
        'DELETE FROM api_keys WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'API key not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { success: false, error: 'Failed to delete API key' };
    }
  }
};