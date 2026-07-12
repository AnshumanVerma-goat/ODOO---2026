import type { ReactNode } from 'react'

interface SafetyPageHeaderProps {
  title: string
  subtitle: string
  action?: ReactNode
}

export function SafetyPageHeader({ title, subtitle, action }: SafetyPageHeaderProps) {
  return (
    <div className="page-header safety-page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
