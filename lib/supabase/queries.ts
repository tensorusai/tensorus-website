import { createClient } from './client'
import { createRouteClient } from './server'
import type { Database } from './database.types'

type Query = Database['public']['Tables']['queries']['Row']
type QueryInsert = Database['public']['Tables']['queries']['Insert']

export interface QueryData {
  projectId: string
  tensorId: string
  queryText: string
  result?: string
  visualData?: any
}

export interface QueryResponse {
  success: boolean
  query?: Query
  error?: string
}

export interface QueriesResponse {
  success: boolean
  queries?: Query[]
  error?: string
}

export const queryService = {
  // Create new query
  async createQuery(queryData: QueryData): Promise<QueryResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const insertData: QueryInsert = {
        user_id: user.id,
        project_id: queryData.projectId,
        tensor_id: queryData.tensorId,
        query_text: queryData.queryText,
        result: queryData.result,
        visual_data: queryData.visualData,
      }

      const { data, error } = await supabase
        .from('queries')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, query: data }
    } catch (error) {
      return { success: false, error: 'Failed to create query' }
    }
  },

  // Get queries by project
  async getQueriesByProject(projectId: string): Promise<QueriesResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, queries: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch queries' }
    }
  },

  // Get all user queries
  async getQueries(): Promise<QueriesResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, queries: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch queries' }
    }
  },

  // Get query by ID
  async getQuery(queryId: string): Promise<QueryResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('id', queryId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, query: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch query' }
    }
  },

  // Delete query
  async deleteQuery(queryId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { error } = await supabase
        .from('queries')
        .delete()
        .eq('id', queryId)
        .eq('user_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete query' }
    }
  }
}

// Server-side query service
export const serverQueryService = {
  // Get query by ID (server-side)
  async getQuery(queryId: string, userId: string): Promise<Query | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('id', queryId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  },

  // Get queries by project (server-side)
  async getQueriesByProject(projectId: string, userId: string): Promise<Query[]> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return []
      }

      return data
    } catch (error) {
      return []
    }
  }
}
