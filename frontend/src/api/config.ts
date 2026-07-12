/**
 * API configuration.
 * Set VITE_API_BASE_URL in .env when the backend is available.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const API_TIMEOUT_MS = 30_000

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  vehicles: '/vehicles',
  drivers: '/drivers',
  trips: '/trips',
  maintenance: '/maintenance',
  expenses: '/expenses',
} as const
