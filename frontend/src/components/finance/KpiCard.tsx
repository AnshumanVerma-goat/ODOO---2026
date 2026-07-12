interface KpiCardProps {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
}

export function KpiCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  variant = 'default',
  icon,
}: KpiCardProps) {
  return (
    <div className={`kpi-card kpi-card--${variant}`}>
      <div className="kpi-card-top">
        {icon && <span className="kpi-card-icon">{icon}</span>}
        <span className="kpi-card-label">{label}</span>
      </div>
      <span className="kpi-card-value">{value}</span>
      {trend && (
        <span className={`kpi-card-trend kpi-card-trend--${trendDirection}`}>
          {trendDirection === 'up' && '↑ '}
          {trendDirection === 'down' && '↓ '}
          {trend}
        </span>
      )}
    </div>
  )
}
