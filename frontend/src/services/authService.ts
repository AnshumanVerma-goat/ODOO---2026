import { apiClient, ApiRequestError } from '../api/client'
import {
  ACCESS_TOKEN_KEY,
  API_ENDPOINTS,
  REFRESH_TOKEN_KEY,
} from '../api/config'
import type {
  AuthUserDto,
  BackendUserDto,
  LoginCredentials,
  MeResponse,
  TokenPairResponse,
} from '../api/types'
import type { UserRole } from '../types'

const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  'Fleet Manager': 'fleet_manager',
  'Safety Officer': 'safety_officer',
  'Financial Analyst': 'finance_analytics_manager',
  Dispatcher: 'driver',
}

function mapUserDto(dto: BackendUserDto): AuthUserDto {
  const roleName = dto.role?.name ?? ''
  const role = BACKEND_ROLE_MAP[roleName]
  if (!role) {
    throw new ApiRequestError(`Unsupported role: ${roleName || 'unknown'}`, 403, 'forbidden')
  }
  return {
    name: dto.name,
    email: dto.email,
    role,
  }
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function hasStoredSession(): boolean {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Authenticate a user and return session data.
 * POST /auth/login
 */
export async function login(credentials: LoginCredentials): Promise<AuthUserDto> {
  try {
    const response = await apiClient.post<TokenPairResponse>(
      API_ENDPOINTS.auth.login,
      credentials,
      { skipAuth: true },
    )
    setTokens(response.access_token, response.refresh_token)
    return mapUserDto(response.user)
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) {
      throw new ApiRequestError('Invalid email or password.', 401, 'unauthorized')
    }
    throw err
  }
}

/**
 * Clear stored tokens (no backend logout endpoint).
 */
export async function logout(): Promise<void> {
  clearTokens()
}

/**
 * Fetch the currently authenticated user.
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<AuthUserDto> {
  const response = await apiClient.get<MeResponse>(API_ENDPOINTS.auth.me)
  return mapUserDto(response.data)
}
