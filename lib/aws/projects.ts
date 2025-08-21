import { query } from './database';
import { uploadFile } from './storage';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_name?: string;
  file_url?: string;
  file_size?: number;
  tensor_id?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

export const projectService = {
  async getProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
      return { success: true, projects: result.rows };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { success: false, error: 'Failed to fetch projects' };
    }
  },

  async getProject(id: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Project not found' };
      }
      return { success: true, project: result.rows[0] };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, error: 'Failed to fetch project' };
    }
  },

  async createProject(params: {
    name: string;
    description?: string;
    file?: File;
  }): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { name, description, file } = params;
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      let fileSize: number | undefined;

      // Handle file upload if provided
      if (file) {
        const fileKey = `projects/${uuidv4()}/${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await uploadFile(fileKey, buffer, file.type);
        
        if (uploadResult.error) {
          return { success: false, error: 'Failed to upload file' };
        }
        
        fileUrl = uploadResult.url!;
        fileName = file.name;
        fileSize = file.size;
      }

      const result = await query(
        `INSERT INTO projects (name, description, file_name, file_url, file_size, status) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, fileName, fileUrl, fileSize, 'uploading']
      );

      return { success: true, project: result.rows[0] };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: 'Failed to create project' };
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
      const values = fields.map(field => updates[field as keyof Project]);
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

      const result = await query(
        `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Project not found' };
      }

      return { success: true, project: result.rows[0] };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: 'Failed to update project' };
    }
  },

  async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await query('DELETE FROM projects WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        return { success: false, error: 'Project not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: 'Failed to delete project' };
    }
  }
};