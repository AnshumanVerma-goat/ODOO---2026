interface AreaChartPoint {
  label: string
  value: number
  secondaryValue?: number
}

interface AreaChartProps {
  data: AreaChartPoint[]
  title?: string
  primaryLabel?: string
  secondaryLabel?: string
  formatValue?: (v: number) => string
}

export function AreaChart({
  data,
  title,
  primaryLabel = 'Revenue',
  secondaryLabel = 'Expenses',
  formatValue = (v) => String(v),
}: AreaChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.value, d.secondaryValue ?? 0]), 1)
  const width = 100
  const height = 60
  const step = width / Math.max(data.length - 1, 1)

  const toPoints = (key: 'value' | 'secondaryValue') =>
    data
      .map((d, i) => {
        const val = key === 'value' ? d.value : (d.secondaryValue ?? 0)
        const x = i * step
        const y = height - (val / max) * height
        return `${x},${y}`
      })
      .join(' ')

  const revenuePoints = toPoints('value')
  const expensePoints = toPoints('secondaryValue')

  return (
    <div className="finance-chart finance-area-chart">
      {title && <h3 className="finance-chart-title">{title}</h3>}
      <div className="finance-area-chart-body">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="finance-area-svg">
          <polyline
            points={expensePoints}
            fill="none"
            stroke="var(--warning)"
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
          <polyline
            points={revenuePoints}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
          />
          <polygon
            points={`0,${height} ${revenuePoints} ${width},${height}`}
            fill="url(#revenueGradient)"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="finance-area-labels">
          {data.map((d) => (
            <span key={d.label} className="finance-area-label">{d.label}</span>
          ))}
        </div>
      </div>
      <div className="finance-area-legend">
        <span className="finance-area-legend-item">
          <span className="finance-area-swatch finance-area-swatch--primary" />
          {primaryLabel}
        </span>
        <span className="finance-area-legend-item">
          <span className="finance-area-swatch finance-area-swatch--secondary" />
          {secondaryLabel}
        </span>
      </div>
      <div className="finance-area-values">
        {data.map((d) => (
          <div key={d.label} className="finance-area-value-group">
            <span className="finance-area-value finance-area-value--primary">{formatValue(d.value)}</span>
            {d.secondaryValue !== undefined && (
              <span className="finance-area-value finance-area-value--secondary">
                {formatValue(d.secondaryValue)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
