import { useMemo, useState } from 'react'
import { fuelRecords, monthlyFuelTrend } from '../../data/financeData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { KpiCard } from '../../components/finance/KpiCard'
import { BarChart } from '../../components/finance/BarChart'
import { DataTable } from '../../components/finance/DataTable'
import { DataState } from '../../components/finance/DataState'
import { ExportButton } from '../../components/finance/ExportButton'
import { PeriodSelector } from '../../components/finance/PeriodSelector'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrency, simulateDelay } from '../../utils/finance'
import type { FinancePeriod, FuelRecord } from '../../types'

export function FuelCostManagement() {
  const [period, setPeriod] = useState<FinancePeriod>('30d')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')

  const { data, status, error, refetch } = useAsyncData(
    () => simulateDelay({ records: fuelRecords, trend: monthlyFuelTrend }),
    [period],
  )

  const vehicles = useMemo(
    () => [...new Set((data?.records ?? []).map((r) => r.vehicle))],
    [data],
  )

  const filtered = useMemo(() => {
    if (!data) return []
    if (vehicleFilter === 'all') return data.records
    return data.records.filter((r) => r.vehicle === vehicleFilter)
  }, [data, vehicleFilter])

  const totalFuel = filtered.reduce((s, r) => s + r.amount, 0)
  const totalLiters = filtered.reduce((s, r) => s + r.liters, 0)
  const avgCostPerLiter = totalLiters > 0 ? totalFuel / totalLiters : 0

  const exportRows = filtered.map((r) => [
    r.date, r.vehicle, r.driver, r.route, r.liters, r.costPerLiter, r.amount,
  ])

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Fuel Cost Management"
        subtitle="Track fuel consumption, cost per liter, and spending by vehicle and route."
        action={
          <ExportButton
            filename="fuel-costs.csv"
            headers={['Date', 'Vehicle', 'Driver', 'Route', 'Liters', 'Cost/L', 'Amount']}
            rows={exportRows}
          />
        }
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      <DataState
        status={status}
        error={error}
        onRetry={refetch}
        isEmpty={!data || filtered.length === 0}
        emptyMessage="No fuel records found for the selected period."
        emptyIcon="⛽"
      >
        {data && (
          <>
            <div className="kpi-grid">
              <KpiCard
                label="Total Fuel Spend"
                value={formatCurrency(totalFuel)}
                trend="82% of monthly budget"
                trendDirection="up"
                variant="warning"
                icon="⛽"
              />
              <KpiCard
                label="Total Liters"
                value={`${totalLiters.toLocaleString()} L`}
                variant="default"
                icon="🛢️"
              />
              <KpiCard
                label="Avg Cost / Liter"
                value={`₹${avgCostPerLiter.toFixed(2)}`}
                trend="-0.3% vs last month"
                trendDirection="down"
                variant="success"
                icon="📊"
              />
              <KpiCard
                label="Fill-ups"
                value={filtered.length}
                variant="info"
                icon="🚛"
              />
            </div>

            <div className="filter-row">
              <select
                className="finance-select"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="all">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="finance-dashboard-charts">
              <div className="finance-panel finance-panel--wide">
                <BarChart
                  title="Monthly Fuel Spend"
                  data={data.trend.map((m) => ({
                    label: m.month,
                    value: m.amount,
                    displayValue: formatCurrency(m.amount),
                  }))}
                  variant="fuel"
                  height={220}
                />
              </div>
            </div>

            <section className="section">
              <div className="section-header">
                <h2>Fuel Records</h2>
                <span className="muted">{filtered.length} records</span>
              </div>
              <DataTable<FuelRecord>
                columns={[
                  { key: 'date', header: 'Date', render: (r) => r.date },
                  { key: 'vehicle', header: 'Vehicle', render: (r) => r.vehicle },
                  { key: 'driver', header: 'Driver', render: (r) => r.driver },
                  { key: 'route', header: 'Route', render: (r) => r.route },
                  { key: 'liters', header: 'Liters', render: (r) => `${r.liters} L`, align: 'right' },
                  { key: 'costPerLiter', header: 'Cost/L', render: (r) => `₹${r.costPerLiter.toFixed(2)}`, align: 'right' },
                  { key: 'amount', header: 'Amount', render: (r) => <strong>{formatCurrency(r.amount)}</strong>, align: 'right' },
                ]}
                data={filtered}
                keyField="id"
              />
            </section>
          </>
        )}
      </DataState>
    </div>
  )
}
