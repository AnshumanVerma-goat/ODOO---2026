import { API_ENDPOINTS } from '../api/config'
import type { LoginCredentials, LoginResponse, AuthUserDto } from '../api/types'
import { notImplemented } from '../api/placeholder'

/**
 * Authenticate a user and return session data.
 * TODO: POST /auth/login
 */
export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  void API_ENDPOINTS.auth.login
  void credentials
  return notImplemented('login()')
}

/**
 * Invalidate the current session.
 * TODO: POST /auth/logout
 */
export function logout(): Promise<void> {
  void API_ENDPOINTS.auth.logout
  return notImplemented('logout()')
}

/**
 * Fetch the currently authenticated user.
 * TODO: GET /auth/me
 */
export function getCurrentUser(): Promise<AuthUserDto> {
  void API_ENDPOINTS.auth.me
  return notImplemented('getCurrentUser()')
}
