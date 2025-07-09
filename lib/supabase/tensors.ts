import { createClient } from './client'
import { createRouteClient } from './server'
import type { Database } from './database.types'

type Tensor = Database['public']['Tables']['tensors']['Row']
type TensorInsert = Database['public']['Tables']['tensors']['Insert']
type TensorUpdate = Database['public']['Tables']['tensors']['Update']

export interface TensorData {
  id: string
  projectId: string
  dimensions: number
  shape: number[]
  dataType: string
  sparsity: number
  transformationMethod: string
  fields: string[]
  stats: {
    min: number[]
    max: number[]
    mean: number[]
    stdDev: number[]
    fields: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface TensorResponse {
  success: boolean
  tensor?: Tensor
  error?: string
}

export interface TensorsResponse {
  success: boolean
  tensors?: Tensor[]
  error?: string
}

export const tensorService = {
  // Create new tensor
  async createTensor(tensorData: Omit<TensorData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TensorResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const insertData: TensorInsert = {
        project_id: tensorData.projectId,
        user_id: user.id,
        dimensions: tensorData.dimensions,
        shape: tensorData.shape,
        data_type: tensorData.dataType,
        sparsity: tensorData.sparsity,
        transformation_method: tensorData.transformationMethod,
        fields: tensorData.fields,
        stats: tensorData.stats,
      }

      const { data, error } = await supabase
        .from('tensors')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, tensor: data }
    } catch (error) {
      return { success: false, error: 'Failed to create tensor' }
    }
  },

  // Get tensor by ID
  async getTensor(tensorId: string): Promise<TensorResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('tensors')
        .select('*')
        .eq('id', tensorId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, tensor: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch tensor' }
    }
  },

  // Get tensors by project ID
  async getTensorsByProject(projectId: string): Promise<TensorsResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('tensors')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, tensors: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch tensors' }
    }
  },

  // Get all user tensors
  async getTensors(): Promise<TensorsResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('tensors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, tensors: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch tensors' }
    }
  },

  // Update tensor
  async updateTensor(tensorId: string, updates: TensorUpdate): Promise<TensorResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('tensors')
        .update(updates)
        .eq('id', tensorId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, tensor: data }
    } catch (error) {
      return { success: false, error: 'Failed to update tensor' }
    }
  },

  // Delete tensor
  async deleteTensor(tensorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { error } = await supabase
        .from('tensors')
        .delete()
        .eq('id', tensorId)
        .eq('user_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete tensor' }
    }
  }
}

// Server-side tensor service
export const serverTensorService = {
  // Get tensor by ID (server-side)
  async getTensor(tensorId: string, userId: string): Promise<Tensor | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('tensors')
        .select('*')
        .eq('id', tensorId)
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

  // Get tensors by project (server-side)
  async getTensorsByProject(projectId: string, userId: string): Promise<Tensor[]> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('tensors')
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
  },

  // Update tensor (server-side)
  async updateTensor(tensorId: string, updates: TensorUpdate): Promise<Tensor | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('tensors')
        .update(updates)
        .eq('id', tensorId)
        .select()
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  }
}