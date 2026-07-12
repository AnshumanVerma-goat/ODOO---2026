interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSegment[]
  title?: string
  centerLabel?: string
  centerValue?: string
}

export function DonutChart({ data, title, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let cumulative = 0

  const segments = data.map((segment) => {
    const pct = total > 0 ? (segment.value / total) * 100 : 0
    const start = cumulative
    cumulative += pct
    return { ...segment, pct, start }
  })

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
    .join(', ')

  return (
    <div className="finance-chart finance-donut-chart">
      {title && <h3 className="finance-chart-title">{title}</h3>}
      <div className="finance-donut-wrap">
        <div
          className="finance-donut"
          style={{ background: total > 0 ? `conic-gradient(${gradient})` : 'var(--border)' }}
        >
          <div className="finance-donut-hole">
            {centerValue && <span className="finance-donut-center-value">{centerValue}</span>}
            {centerLabel && <span className="finance-donut-center-label">{centerLabel}</span>}
          </div>
        </div>
        <div className="finance-donut-legend">
          {segments.map((s) => (
            <div key={s.label} className="finance-donut-legend-item">
              <span className="finance-donut-swatch" style={{ background: s.color }} />
              <span className="finance-donut-legend-label">{s.label}</span>
              <span className="finance-donut-legend-value">
                {total > 0 ? `${s.pct.toFixed(1)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
