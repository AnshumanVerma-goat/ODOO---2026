import type { FinancePeriod } from '../../types'
import { periodLabel } from '../../utils/finance'

interface PeriodSelectorProps {
  value: FinancePeriod
  onChange: (period: FinancePeriod) => void
}

const PERIODS: FinancePeriod[] = ['7d', '30d', '90d', 'ytd', '12m']

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="period-selector">
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          className={`period-selector-btn ${value === period ? 'period-selector-btn--active' : ''}`}
          onClick={() => onChange(period)}
        >
          {periodLabel(period)}
        </button>
      ))}
    </div>
  )
}
