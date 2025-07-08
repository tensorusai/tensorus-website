export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
  lastLoginAt?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileData {
  name: string
  email: string
  avatar?: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: AuthError
}

export type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: AuthError }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }