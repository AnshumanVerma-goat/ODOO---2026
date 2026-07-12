import { API_BASE_URL, API_TIMEOUT_MS } from './config'
import { notImplemented } from './placeholder'

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * Thin HTTP client wrapper.
 * All methods are placeholders until backend integration is added.
 */
class ApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private buildUrl(path: string, params?: RequestOptions['params']): string {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) url.searchParams.set(key, String(value))
      }
    }
    return url.toString()
  }

  private defaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const token = localStorage.getItem('transportops_token')
    if (token) headers.Authorization = `Bearer ${token}`

    return headers
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    void this.buildUrl(path, options.params)
    void API_TIMEOUT_MS
    void this.defaultHeaders()
    return notImplemented<T>(`GET ${path}`)
  }

  async post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    void body
    void options
    return notImplemented<T>(`POST ${path}`)
  }

  async put<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    void body
    void options
    return notImplemented<T>(`PUT ${path}`)
  }

  async patch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    void body
    void options
    return notImplemented<T>(`PATCH ${path}`)
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    void options
    return notImplemented<T>(`DELETE ${path}`)
  }
}

export const apiClient = new ApiClient()
