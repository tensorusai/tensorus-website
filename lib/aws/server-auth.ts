import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserFromDatabase, createUserInDatabase } from './user-management';

export interface ServerUser {
  id: string;
  cognito_sub: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export const serverAuthService = {
  async getCurrentUser(): Promise<ServerUser | null> {
    try {
      const cookieStore = cookies();
      
      // Look for AWS Cognito tokens in cookies
      // These would be set by the client-side Amplify auth
      const idToken = cookieStore.get('cognito-id-token')?.value;
      const accessToken = cookieStore.get('cognito-access-token')?.value;
      
      if (!idToken || !accessToken) {
        return null;
      }

      // Decode the JWT token (in production, you should verify the signature)
      // For now, we'll decode without verification for development
      const decodedToken = jwt.decode(idToken) as any;
      
      if (!decodedToken || !decodedToken.sub) {
        return null;
      }

      // Get user from database
      const { user, error } = await getUserFromDatabase(decodedToken.sub);
      
      if (error || !user) {
        // Try to create user if they don't exist
        const createResult = await createUserInDatabase({
          attributes: {
            sub: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
            picture: decodedToken.picture
          }
        });
        
        if (createResult.error) {
          console.error('Failed to create user:', createResult.error);
          return null;
        }
        
        return {
          id: createResult.user!.id,
          cognito_sub: createResult.user!.cognito_sub,
          email: createResult.user!.email,
          name: createResult.user!.name,
          avatar_url: createResult.user!.avatar_url,
          plan: createResult.user!.plan,
        };
      }

      return {
        id: user.id,
        cognito_sub: user.cognito_sub,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        plan: user.plan,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};