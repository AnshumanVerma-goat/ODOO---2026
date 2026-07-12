import type { ReactNode } from 'react'
import type { AsyncStatus } from '../../hooks/useAsyncData'

interface DataStateProps {
  status: AsyncStatus
  error?: string | null
  isEmpty?: boolean
  emptyMessage?: string
  emptyIcon?: string
  onRetry?: () => void
  children: ReactNode
}

export function DataState({
  status,
  error,
  isEmpty = false,
  emptyMessage = 'No data available.',
  emptyIcon = '📭',
  onRetry,
  children,
}: DataStateProps) {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="data-state data-state--loading">
        <div className="skeleton-grid">
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
        </div>
        <div className="skeleton skeleton--chart" />
        <div className="skeleton skeleton--table" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="data-state data-state--error">
        <span className="data-state-icon">⚠️</span>
        <h3>Unable to load data</h3>
        <p>{error ?? 'Something went wrong. Please try again.'}</p>
        {onRetry && (
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="data-state data-state--empty">
        <span className="data-state-icon">{emptyIcon}</span>
        <h3>No records found</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}
