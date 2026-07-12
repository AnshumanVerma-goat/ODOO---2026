/**
 * API configuration.
 * Set VITE_API_BASE_URL in .env when the backend is available.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

export const API_TIMEOUT_MS = 30_000

export const ACCESS_TOKEN_KEY = 'transportops_token'
export const REFRESH_TOKEN_KEY = 'transportops_refresh_token'

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  vehicles: '/vehicles',
  drivers: '/drivers',
  trips: '/trips',
  tripActions: {
    dispatch: (id: string | number) => `/trips/${id}/dispatch`,
    complete: (id: string | number) => `/trips/${id}/complete`,
    cancel: (id: string | number) => `/trips/${id}/cancel`,
  },
  maintenance: '/maintenance',
  expenses: '/expenses',
} as const
