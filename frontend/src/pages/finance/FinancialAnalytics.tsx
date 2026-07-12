import { useState } from 'react'
import {
  monthlyRevenue,
  vehicleProfitability,
  expenseBreakdown,
  monthlyFuelTrend,
} from '../../data/financeData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { KpiCard } from '../../components/finance/KpiCard'
import { BarChart } from '../../components/finance/BarChart'
import { DonutChart } from '../../components/finance/DonutChart'
import { AreaChart } from '../../components/finance/AreaChart'
import { DataState } from '../../components/finance/DataState'
import { PeriodSelector } from '../../components/finance/PeriodSelector'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrency, formatPercent, simulateDelay } from '../../utils/finance'
import type { FinancePeriod } from '../../types'

export function FinancialAnalytics() {
  const [period, setPeriod] = useState<FinancePeriod>('12m')

  const { data, status, error, refetch } = useAsyncData(
    () =>
      simulateDelay({
        revenue: monthlyRevenue,
        profitability: vehicleProfitability,
        breakdown: expenseBreakdown,
        fuelTrend: monthlyFuelTrend,
      }),
    [period],
  )

  const ytdRevenue = data?.revenue.reduce((s, m) => s + m.revenue, 0) ?? 0
  const ytdExpenses = data?.revenue.reduce((s, m) => s + m.expenses, 0) ?? 0
  const ytdProfit = ytdRevenue - ytdExpenses
  const avgMargin = data
    ? data.profitability.reduce((s, v) => s + v.margin, 0) / data.profitability.length
    : 0

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Financial Analytics"
        subtitle="Deep-dive into profitability trends, cost efficiency, and fleet financial performance."
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      <DataState status={status} error={error} onRetry={refetch} isEmpty={!data}>
        {data && (
          <>
            <div className="kpi-grid">
              <KpiCard
                label="YTD Revenue"
                value={formatCurrency(ytdRevenue)}
                trend="+8.4% YoY"
                trendDirection="up"
                variant="success"
                icon="📈"
              />
              <KpiCard
                label="YTD Expenses"
                value={formatCurrency(ytdExpenses)}
                trend="+5.2% YoY"
                trendDirection="down"
                variant="warning"
                icon="📉"
              />
              <KpiCard
                label="YTD Profit"
                value={formatCurrency(ytdProfit)}
                trend="+12.1% YoY"
                trendDirection="up"
                variant="info"
                icon="💰"
              />
              <KpiCard
                label="Avg Fleet Margin"
                value={formatPercent(avgMargin)}
                variant="default"
                icon="📊"
              />
            </div>

            <div className="finance-analytics-grid">
              <div className="finance-panel finance-panel--wide">
                <AreaChart
                  title="Revenue & Expense Trend"
                  data={data.revenue.map((m) => ({
                    label: m.month,
                    value: m.revenue,
                    secondaryValue: m.expenses,
                  }))}
                  formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
              </div>

              <div className="finance-panel">
                <DonutChart
                  title="Cost Distribution"
                  data={data.breakdown.map((e) => ({
                    label: e.category,
                    value: e.amount,
                    color: e.color,
                  }))}
                  centerLabel="Operating"
                  centerValue={formatCurrency(data.breakdown.reduce((s, e) => s + e.amount, 0))}
                />
              </div>

              <div className="finance-panel finance-panel--wide">
                <BarChart
                  title="Monthly Fuel Spend Trend"
                  data={data.fuelTrend.map((m) => ({
                    label: m.month,
                    value: m.amount,
                    displayValue: formatCurrency(m.amount),
                  }))}
                  variant="fuel"
                  height={200}
                />
              </div>

              <div className="finance-panel finance-panel--wide">
                <h3 className="finance-chart-title">Vehicle Profitability Ranking</h3>
                <div className="finance-ranking-list">
                  {[...data.profitability]
                    .sort((a, b) => b.margin - a.margin)
                    .map((v, i) => (
                      <div key={v.vehicle} className="finance-ranking-item">
                        <span className="finance-ranking-rank">#{i + 1}</span>
                        <div className="finance-ranking-info">
                          <strong>{v.vehicle}</strong>
                          <span className="muted">
                            Rev {formatCurrency(v.revenue)} · Cost {formatCurrency(v.cost)}
                          </span>
                        </div>
                        <div className="finance-ranking-bar-wrap">
                          <div
                            className="finance-ranking-bar"
                            style={{ width: `${v.margin}%` }}
                          />
                        </div>
                        <span className={`finance-ranking-margin ${v.margin >= 70 ? 'finance-ranking-margin--good' : v.margin >= 50 ? 'finance-ranking-margin--mid' : 'finance-ranking-margin--low'}`}>
                          {formatPercent(v.margin)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DataState>
    </div>
  )
}
