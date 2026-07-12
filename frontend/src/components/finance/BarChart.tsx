interface BarChartItem {
  label: string
  value: number
  displayValue?: string
  color?: string
}

interface BarChartProps {
  data: BarChartItem[]
  title?: string
  height?: number
  variant?: 'default' | 'revenue' | 'fuel' | 'maintenance'
}

export function BarChart({ data, title, height = 200, variant = 'default' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={`finance-chart finance-bar-chart finance-bar-chart--${variant}`}>
      {title && <h3 className="finance-chart-title">{title}</h3>}
      <div className="finance-bar-chart-body" style={{ height }}>
        {data.map((item) => (
          <div key={item.label} className="finance-bar-group">
            {item.displayValue && <span className="finance-bar-value">{item.displayValue}</span>}
            <div
              className="finance-bar"
              style={{
                height: `${(item.value / max) * 100}%`,
                background: item.color,
              }}
              title={item.displayValue ?? String(item.value)}
            />
            <span className="finance-bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
