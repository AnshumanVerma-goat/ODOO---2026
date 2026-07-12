import { useCallback, useEffect, useState } from 'react'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseAsyncDataOptions {
  delay?: number
  simulateError?: boolean
}

interface UseAsyncDataResult<T> {
  data: T | null
  status: AsyncStatus
  error: string | null
  refetch: () => void
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncDataOptions = {},
): UseAsyncDataResult<T> {
  const { simulateError = false } = options
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setError(null)

      try {
        if (simulateError) throw new Error('Failed to load data. Please try again.')
        const result = await fetcher()
        if (!cancelled) {
          setData(result)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred')
          setStatus('error')
        }
      }
    }

    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  return { data, status, error, refetch }
}
