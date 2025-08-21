import { Auth } from 'aws-amplify';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name,
      },
    });
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const user = await Auth.signIn(email, password);
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    await Auth.signOut();
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function resetPassword(email: string) {
  try {
    await Auth.forgotPassword(email);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function confirmResetPassword(email: string, code: string, newPassword: string) {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
    return { error: null };
  } catch (error) {
    return { error };
  }
}