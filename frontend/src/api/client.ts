import {
  ACCESS_TOKEN_KEY,
  API_BASE_URL,
  API_ENDPOINTS,
  API_TIMEOUT_MS,
  REFRESH_TOKEN_KEY,
} from './config'

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  signal?: AbortSignal
  skipAuth?: boolean
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

let refreshPromise: Promise<boolean> | null = null

async function tryRefreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) return false

    const baseUrl = API_BASE_URL.replace(/\/$/, '')
    try {
      const res = await fetch(`${baseUrl}${API_ENDPOINTS.auth.refresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!res.ok) return false

      const data = (await res.json()) as {
        access_token: string
        refresh_token: string
      }
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Thin HTTP client wrapper for backend API calls.
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

  private defaultHeaders(skipAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (!skipAuth) {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (token) headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
    isRetry = false,
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

    try {
      const res = await fetch(this.buildUrl(path, options.params), {
        method,
        headers: { ...this.defaultHeaders(options.skipAuth), ...options.headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options.signal ?? controller.signal,
      })

      const json = await res.json().catch(() => null)

      if (res.status === 401 && !options.skipAuth && !isRetry) {
        const refreshed = await tryRefreshTokens()
        if (refreshed) {
          return this.request<T>(method, path, body, options, true)
        }
        clearStoredTokens()
      }

      if (!res.ok) {
        const message = json?.message ?? res.statusText ?? 'Request failed'
        throw new ApiRequestError(message, res.status, json?.code)
      }

      return json as T
    } catch (err) {
      if (err instanceof ApiRequestError) throw err
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiRequestError('Request timed out. Please try again.', 0, 'timeout')
      }
      if (err instanceof TypeError) {
        throw new ApiRequestError(
          'Network error. Check your connection and try again.',
          0,
          'network',
        )
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, undefined, options)
  }

  post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, body, options)
  }

  put<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', path, body, options)
  }

  patch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PATCH', path, body, options)
  }

  delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options)
  }
}

export const apiClient = new ApiClient()
