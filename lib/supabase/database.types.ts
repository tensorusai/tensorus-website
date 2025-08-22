export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          masked_key: string
          description: string | null
          status: 'active' | 'revoked'
          usage_count: number
          last_used_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          masked_key: string
          description?: string | null
          status?: 'active' | 'revoked'
          usage_count?: number
          last_used_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_hash?: string
          masked_key?: string
          description?: string | null
          status?: 'active' | 'revoked'
          usage_count?: number
          last_used_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          file_name: string | null
          file_url: string | null
          file_size: number | null
          tensor_id: string | null
          status: 'uploading' | 'processing' | 'completed' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          file_size?: number | null
          tensor_id?: string | null
          status?: 'uploading' | 'processing' | 'completed' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          file_size?: number | null
          tensor_id?: string | null
          status?: 'uploading' | 'processing' | 'completed' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
      tensors: {
        Row: {
          id: string
          project_id: string
          user_id: string
          dimensions: number
          shape: number[]
          data_type: string
          sparsity: number
          transformation_method: string
          fields: string[]
          stats: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          dimensions: number
          shape: number[]
          data_type: string
          sparsity: number
          transformation_method: string
          fields: string[]
          stats: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          dimensions?: number
          shape?: number[]
          data_type?: string
          sparsity?: number
          transformation_method?: string
          fields?: string[]
          stats?: Json
          created_at?: string
          updated_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string
          project_id: string
          tensor_id: string
          query_text: string
          result: string | null
          visual_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          tensor_id: string
          query_text: string
          result?: string | null
          visual_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          tensor_id?: string
          query_text?: string
          result?: string | null
          visual_data?: Json | null
          created_at?: string
        }
      }
      agent_messages: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          agent_type: string
          message: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          agent_type: string
          message: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          agent_type?: string
          message?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_plan: 'free' | 'pro' | 'enterprise'
      api_key_status: 'active' | 'revoked'
      project_status: 'uploading' | 'processing' | 'completed' | 'error'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
