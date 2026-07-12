import { createContext, useContext, useState, type ReactNode } from 'react'
import { getDashboardPath } from '../config/roles'
import { demoUsers } from '../data/mockData'
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
  login: (email: string, password: string) => LoginResult
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'transportops_auth'

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

  const login = (email: string, password: string): LoginResult => {
    const account = demoUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    )

    if (!account || password !== account.password) {
      return { success: false, error: 'Invalid email or password.' }
    }

    const authUser: AuthUser = {
      name: account.name,
      email: account.email,
      role: account.role,
      ...(account.driverId ? { driverId: account.driverId } : {}),
    }

    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))

    return {
      success: true,
      redirectTo: getDashboardPath(account.role),
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
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
