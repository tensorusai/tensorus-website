'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Auth, Hub } from 'aws-amplify'
import { User } from './auth'
import './config'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkUser()

    // Listen for authentication events
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          checkUser()
          break
        case 'signOut':
          setUser(null)
          break
      }
    })

    return () => unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser()
      const user: User = {
        id: cognitoUser.attributes.sub,
        email: cognitoUser.attributes.email,
        name: cognitoUser.attributes.name || 'User',
        avatar_url: cognitoUser.attributes.picture,
        plan: 'free', // Default plan
      }
      setUser(user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}