import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getDashboardPath } from '../config/roles'
import { ApiRequestError } from '../api/client'
import * as authService from '../services/authService'
import type { UserRole } from '../types'

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  driverId?: string
}

interface LoginResult {
  success: boolean
  error?: string
  redirectTo?: string
}

interface AuthContextType {
  user: AuthUser | null
  role: UserRole | null
  isInitializing: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!authService.hasStoredSession()) {
      setIsInitializing(false)
      return
    }

    authService
      .getCurrentUser()
      .then((authUser) => setUser(authUser))
      .catch(() => authService.clearTokens())
      .finally(() => setIsInitializing(false))
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const authUser = await authService.login({ email: email.trim(), password })
      setUser(authUser)
      return {
        success: true,
        redirectTo: getDashboardPath(authUser.role),
      }
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function useRole() {
  const { role } = useAuth()
  return { role }
}
