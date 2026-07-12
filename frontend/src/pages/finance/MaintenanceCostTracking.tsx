import { useMemo, useState } from 'react'
import { maintenanceByVehicle, maintenanceCostRecords } from '../../data/financeData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { KpiCard } from '../../components/finance/KpiCard'
import { BarChart } from '../../components/finance/BarChart'
import { DataTable } from '../../components/finance/DataTable'
import { DataState } from '../../components/finance/DataState'
import { ExportButton } from '../../components/finance/ExportButton'
import { PeriodSelector } from '../../components/finance/PeriodSelector'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrency, simulateDelay } from '../../utils/finance'
import type { FinancePeriod, MaintenanceCostRecord } from '../../types'

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed'

export function MaintenanceCostTracking() {
  const [period, setPeriod] = useState<FinancePeriod>('30d')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data, status, error, refetch } = useAsyncData(
    () => simulateDelay({ records: maintenanceCostRecords, byVehicle: maintenanceByVehicle }),
    [period],
  )

  const filtered = useMemo(() => {
    if (!data) return []
    if (statusFilter === 'all') return data.records
    return data.records.filter((r) => r.status === statusFilter)
  }, [data, statusFilter])

  const totalCost = filtered.reduce((s, r) => s + r.cost, 0)
  const pendingCost = filtered.filter((r) => r.status === 'pending').reduce((s, r) => s + r.cost, 0)
  const completedCost = filtered.filter((r) => r.status === 'completed').reduce((s, r) => s + r.cost, 0)
  const inProgressCost = filtered.filter((r) => r.status === 'in_progress').reduce((s, r) => s + r.cost, 0)

  const exportRows = filtered.map((r) => [
    r.date, r.vehicle, r.type, r.vendor, r.status, r.cost, r.description,
  ])

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Maintenance Cost Tracking"
        subtitle="Monitor maintenance expenditures, vendor costs, and scheduled service budgets."
        action={
          <ExportButton
            filename="maintenance-costs.csv"
            headers={['Date', 'Vehicle', 'Type', 'Vendor', 'Status', 'Cost', 'Description']}
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
        emptyMessage="No maintenance records found for the selected filters."
        emptyIcon="🔧"
      >
        {data && (
          <>
            <div className="kpi-grid">
              <KpiCard
                label="Total Maintenance"
                value={formatCurrency(totalCost)}
                variant="default"
                icon="🔧"
              />
              <KpiCard
                label="Pending"
                value={formatCurrency(pendingCost)}
                variant="warning"
                icon="⏳"
              />
              <KpiCard
                label="In Progress"
                value={formatCurrency(inProgressCost)}
                variant="info"
                icon="🔄"
              />
              <KpiCard
                label="Completed"
                value={formatCurrency(completedCost)}
                variant="success"
                icon="✅"
              />
            </div>

            <div className="filter-tabs">
              {(['all', 'pending', 'in_progress', 'completed'] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`filter-tab ${statusFilter === s ? 'filter-tab--active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  <span className="capitalize">{s === 'all' ? 'All' : s.replace('_', ' ')}</span>
                </button>
              ))}
            </div>

            <div className="finance-dashboard-charts">
              <div className="finance-panel finance-panel--wide">
                <BarChart
                  title="Maintenance Cost by Vehicle"
                  data={data.byVehicle.map((v) => ({
                    label: v.vehicle.replace('Truck ', 'T-').replace('Van ', 'V-'),
                    value: v.cost,
                    displayValue: formatCurrency(v.cost),
                  }))}
                  variant="maintenance"
                  height={220}
                />
              </div>
            </div>

            <section className="section">
              <div className="section-header">
                <h2>Maintenance Records</h2>
                <span className="muted">{filtered.length} records</span>
              </div>
              <DataTable<MaintenanceCostRecord>
                columns={[
                  { key: 'date', header: 'Date', render: (r) => r.date },
                  { key: 'vehicle', header: 'Vehicle', render: (r) => r.vehicle },
                  { key: 'type', header: 'Service', render: (r) => r.type },
                  { key: 'vendor', header: 'Vendor', render: (r) => r.vendor },
                  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                  { key: 'cost', header: 'Cost', render: (r) => <strong>{formatCurrency(r.cost)}</strong>, align: 'right' },
                  { key: 'description', header: 'Details', render: (r) => <span className="muted">{r.description}</span> },
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
