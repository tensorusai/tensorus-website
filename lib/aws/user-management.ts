import { query } from './database';

export interface DatabaseUser {
  id: string;
  cognito_sub: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export async function createUserInDatabase(cognitoUser: any) {
  const { sub, email, name, picture } = cognitoUser.attributes;
  
  try {
    const result = await query(
      `INSERT INTO users (cognito_sub, email, name, avatar_url) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (cognito_sub) DO UPDATE SET
         email = EXCLUDED.email,
         name = EXCLUDED.name,
         avatar_url = EXCLUDED.avatar_url,
         updated_at = NOW()
       RETURNING *`,
      [sub, email, name || 'User', picture]
    );
    return { user: result.rows[0], error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function getUserFromDatabase(cognitoSub: string) {
  try {
    const result = await query(
      'SELECT * FROM users WHERE cognito_sub = $1',
      [cognitoSub]
    );
    return { user: result.rows[0] || null, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<DatabaseUser>) {
  const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'cognito_sub');
  const values = fields.map(field => updates[field as keyof DatabaseUser]);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  try {
    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [userId, ...values]
    );
    return { user: result.rows[0], error: null };
  } catch (error) {
    return { user: null, error };
  }
}