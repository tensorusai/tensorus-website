import type { User, LoginCredentials, SignupCredentials, AuthResponse, UpdateProfileData } from './types'

// Demo users for development
const DEMO_USERS: User[] = [
  {
    id: 'user_1',
    email: 'demo@tensorus.com',
    name: 'Demo User',
    avatar: undefined,
    plan: 'pro',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: 'user_2',
    email: 'admin@tensorus.com',
    name: 'Admin User',
    avatar: undefined,
    plan: 'enterprise',
    createdAt: '2024-01-01T00:00:00Z',
    emailVerified: true,
    twoFactorEnabled: true
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate demo JWT token
function generateDemoToken(user: User): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }
  
  return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.demo_signature`
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000) // Simulate network delay
    
    const { email, password } = credentials
    
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' }
      }
    }
    
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address', field: 'email' }
      }
    }
    
    // Demo authentication
    const user = DEMO_USERS.find(u => u.email === email)
    
    if (!user) {
      return {
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'No account found with this email address', field: 'email' }
      }
    }
    
    // Demo password check (in real app, use proper password hashing)
    const validPasswords = ['password', 'demo123', 'tensorus2024']
    if (!validPasswords.includes(password)) {
      return {
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Incorrect password', field: 'password' }
      }
    }
    
    // Update last login
    const updatedUser = { ...user, lastLoginAt: new Date().toISOString() }
    const token = generateDemoToken(updatedUser)
    
    return {
      success: true,
      user: updatedUser,
      token
    }
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    await delay(1500) // Simulate network delay
    
    const { name, email, password, confirmPassword, acceptTerms } = credentials
    
    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'All fields are required' }
      }
    }
    
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address', field: 'email' }
      }
    }
    
    if (!isValidPassword(password)) {
      return {
        success: false,
        error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters long', field: 'password' }
      }
    }
    
    if (password !== confirmPassword) {
      return {
        success: false,
        error: { code: 'PASSWORD_MISMATCH', message: 'Passwords do not match', field: 'confirmPassword' }
      }
    }
    
    if (!acceptTerms) {
      return {
        success: false,
        error: { code: 'TERMS_NOT_ACCEPTED', message: 'You must accept the terms and conditions', field: 'acceptTerms' }
      }
    }
    
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === email)
    if (existingUser) {
      return {
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists', field: 'email' }
      }
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      avatar: undefined,
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      emailVerified: false,
      twoFactorEnabled: false
    }
    
    // In real app, save to database
    DEMO_USERS.push(newUser)
    
    const token = generateDemoToken(newUser)
    
    return {
      success: true,
      user: newUser,
      token
    }
  },

  async logout(): Promise<void> {
    await delay(500)
    // In real app, invalidate token on server
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    await delay(1000)
    
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address' }
      }
    }
    
    const user = DEMO_USERS.find(u => u.email === email)
    if (!user) {
      return {
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'No account found with this email address' }
      }
    }
    
    // In real app, send password reset email
    return { success: true }
  },

  async updateProfile(data: Partial<UpdateProfileData>): Promise<AuthResponse> {
    await delay(800)
    
    // Get current user from localStorage (in real app, use actual user ID)
    const currentUserData = localStorage.getItem('tensorus_user')
    if (!currentUserData) {
      return {
        success: false,
        error: { code: 'NOT_AUTHENTICATED', message: 'You must be signed in to update your profile' }
      }
    }
    
    const currentUser = JSON.parse(currentUserData) as User
    
    // Validate email if provided
    if (data.email && !isValidEmail(data.email)) {
      return {
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address', field: 'email' }
      }
    }
    
    // Check if email is already taken (if different from current)
    if (data.email && data.email !== currentUser.email) {
      const existingUser = DEMO_USERS.find(u => u.email === data.email && u.id !== currentUser.id)
      if (existingUser) {
        return {
          success: false,
          error: { code: 'EMAIL_TAKEN', message: 'This email is already associated with another account', field: 'email' }
        }
      }
    }
    
    // Update user
    const updatedUser: User = {
      ...currentUser,
      ...data
    }
    
    // Update in demo users array
    const userIndex = DEMO_USERS.findIndex(u => u.id === currentUser.id)
    if (userIndex !== -1) {
      DEMO_USERS[userIndex] = updatedUser
    }
    
    return {
      success: true,
      user: updatedUser
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    await delay(1000)
    
    if (!isValidPassword(newPassword)) {
      return {
        success: false,
        error: { code: 'WEAK_PASSWORD', message: 'New password must be at least 8 characters long' }
      }
    }
    
    // In real app, verify current password and update
    return { success: true }
  },

  async verifyEmail(): Promise<AuthResponse> {
    await delay(1000)
    // In real app, send verification email
    return { success: true }
  }
}
