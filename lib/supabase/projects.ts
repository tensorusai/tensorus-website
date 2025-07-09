import { createClient } from './client'
import { createRouteClient } from './server'
import type { Database } from './database.types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export interface ProjectForm {
  name: string
  description?: string
  file?: File
}

export interface ProjectResponse {
  success: boolean
  project?: Project
  error?: string
}

export interface ProjectsResponse {
  success: boolean
  projects?: Project[]
  error?: string
}

export const projectService = {
  // Create new project
  async createProject(form: ProjectForm): Promise<ProjectResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      let fileUrl = null
      let fileName = null
      let fileSize = null

      // Upload file if provided
      if (form.file) {
        const fileExt = form.file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(fileName, form.file)

        if (uploadError) {
          return { success: false, error: 'File upload failed' }
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(uploadData.path)

        fileUrl = publicUrl
        fileName = form.file.name
        fileSize = form.file.size
      }

      const insertData: ProjectInsert = {
        user_id: user.id,
        name: form.name,
        description: form.description,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        status: 'uploading',
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, project: data }
    } catch (error) {
      return { success: false, error: 'Failed to create project' }
    }
  },

  // Get user's projects
  async getProjects(): Promise<ProjectsResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, projects: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch projects' }
    }
  },

  // Get project by ID
  async getProject(projectId: string): Promise<ProjectResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, project: data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch project' }
    }
  },

  // Update project
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<ProjectResponse> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, project: data }
    } catch (error) {
      return { success: false, error: 'Failed to update project' }
    }
  },

  // Delete project
  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      // Get project to check for files to delete
      const { data: project } = await supabase
        .from('projects')
        .select('file_url')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

      // Delete project record
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Delete associated file if exists
      if (project?.file_url) {
        // Extract file path from URL and delete from storage
        const path = project.file_url.split('/').pop()
        if (path) {
          await supabase.storage
            .from('project-files')
            .remove([`${user.id}/${path}`])
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete project' }
    }
  },

  // Update project status
  async updateProjectStatus(projectId: string, status: 'uploading' | 'processing' | 'completed' | 'error'): Promise<ProjectResponse> {
    return this.updateProject(projectId, { status })
  }
}

// Server-side project service
export const serverProjectService = {
  // Get project by ID (server-side)
  async getProject(projectId: string, userId: string): Promise<Project | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
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

  // Get all projects for user (server-side)
  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
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

  // Update project (server-side)
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project | null> {
    try {
      const supabase = createRouteClient()
      
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
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