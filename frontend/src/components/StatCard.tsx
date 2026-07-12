interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function StatCard({ label, value, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {trend && <span className="stat-trend">{trend}</span>}
    </div>
  )
}
