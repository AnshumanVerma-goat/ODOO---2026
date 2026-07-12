import type { ReactNode } from 'react'

interface SafetyPanelProps {
  title?: string
  action?: ReactNode
  children: ReactNode
  wide?: boolean
}

export function SafetyPanel({ title, action, children, wide }: SafetyPanelProps) {
  return (
    <div className={`safety-panel ${wide ? 'safety-panel--wide' : ''}`}>
      {(title || action) && (
        <div className="safety-panel-header">
          {title && <h3>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
