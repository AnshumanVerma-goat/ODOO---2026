import { useMemo, useState } from 'react'
import {
  expenseBreakdown,
  monthlyRevenue,
} from '../../data/financeData'
import { expenses } from '../../data/mockData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { KpiCard } from '../../components/finance/KpiCard'
import { AreaChart } from '../../components/finance/AreaChart'
import { DonutChart } from '../../components/finance/DonutChart'
import { DataTable } from '../../components/finance/DataTable'
import { DataState } from '../../components/finance/DataState'
import { ExportButton } from '../../components/finance/ExportButton'
import { PeriodSelector } from '../../components/finance/PeriodSelector'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrency, simulateDelay, calcTrend } from '../../utils/finance'
import type { FinancePeriod } from '../../types'

export function RevenueExpenseOverview() {
  const [period, setPeriod] = useState<FinancePeriod>('30d')

  const { data, status, error, refetch } = useAsyncData(
    () => simulateDelay({ revenue: monthlyRevenue, expenses, breakdown: expenseBreakdown }),
    [period],
  )

  const kpis = useMemo(() => {
    if (!data) return null
    const current = data.revenue[data.revenue.length - 1]
    const prior = data.revenue[data.revenue.length - 2]
    const revTrend = calcTrend(current.revenue, prior.revenue)
    const expTrend = calcTrend(current.expenses, prior.expenses)
    const profitTrend = calcTrend(current.profit, prior.profit)
    return { current, revTrend, expTrend, profitTrend }
  }, [data])

  const exportRows = useMemo(
    () => (data?.expenses ?? []).map((e) => [e.date, e.category, e.vehicle, e.description, e.amount]),
    [data],
  )

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Revenue & Expense Overview"
        subtitle="Comprehensive view of income streams, operating costs, and profitability."
        action={
          <ExportButton
            filename="revenue-expenses.csv"
            headers={['Date', 'Category', 'Vehicle', 'Description', 'Amount']}
            rows={exportRows}
          />
        }
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      <DataState status={status} error={error} onRetry={refetch} isEmpty={!data}>
        {data && kpis && (
          <>
            <div className="kpi-grid">
              <KpiCard
                label="Total Revenue"
                value={formatCurrency(kpis.current.revenue)}
                trend={kpis.revTrend.text}
                trendDirection={kpis.revTrend.direction}
                variant="success"
                icon="📈"
              />
              <KpiCard
                label="Total Expenses"
                value={formatCurrency(kpis.current.expenses)}
                trend={kpis.expTrend.text}
                trendDirection={kpis.expTrend.direction === 'up' ? 'down' : 'up'}
                variant="warning"
                icon="📉"
              />
              <KpiCard
                label="Net Profit"
                value={formatCurrency(kpis.current.profit)}
                trend={kpis.profitTrend.text}
                trendDirection={kpis.profitTrend.direction}
                variant="info"
                icon="💰"
              />
              <KpiCard
                label="Margin"
                value={`${((kpis.current.profit / kpis.current.revenue) * 100).toFixed(1)}%`}
                variant="default"
                icon="📊"
              />
            </div>

            <div className="finance-dashboard-charts">
              <div className="finance-panel finance-panel--wide">
                <AreaChart
                  title="Revenue vs Expenses Trend"
                  data={data.revenue.map((m) => ({
                    label: m.month,
                    value: m.revenue,
                    secondaryValue: m.expenses,
                  }))}
                  formatValue={(v) => formatCurrency(v)}
                />
              </div>
              <div className="finance-panel">
                <DonutChart
                  title="Expense Distribution"
                  data={data.breakdown.map((e) => ({
                    label: e.category,
                    value: e.amount,
                    color: e.color,
                  }))}
                  centerLabel="Total"
                  centerValue={formatCurrency(data.breakdown.reduce((s, e) => s + e.amount, 0))}
                />
              </div>
            </div>

            <section className="section">
              <div className="section-header">
                <h2>All Expense Records</h2>
                <span className="muted">{data.expenses.length} records</span>
              </div>
              <DataTable
                columns={[
                  { key: 'date', header: 'Date', render: (e) => e.date },
                  { key: 'category', header: 'Category', render: (e) => <span className="capitalize">{e.category}</span> },
                  { key: 'vehicle', header: 'Vehicle', render: (e) => e.vehicle },
                  { key: 'description', header: 'Description', render: (e) => e.description },
                  { key: 'amount', header: 'Amount', render: (e) => <strong>{formatCurrency(e.amount)}</strong>, align: 'right' },
                ]}
                data={data.expenses}
                keyField="id"
              />
            </section>
          </>
        )}
      </DataState>
    </div>
  )
}
