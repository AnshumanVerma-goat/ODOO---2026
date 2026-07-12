import type { ReactNode } from 'react'

interface FinancePageHeaderProps {
  title: string
  subtitle: string
  action?: ReactNode
}

export function FinancePageHeader({ title, subtitle, action }: FinancePageHeaderProps) {
  return (
    <div className="page-header finance-page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
