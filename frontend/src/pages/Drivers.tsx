import { useEffect, useMemo, useState } from 'react'
import { DriverDetailModal } from '../components/fleet/DriverDetailModal'
import { KpiCard } from '../components/finance/KpiCard'
import { SafetyBar } from '../components/SafetyBar'
import { StatusBadge } from '../components/StatusBadge'
import { getDrivers } from '../services/driverService'
import type { Driver } from '../types'

type StatusFilter = 'all' | Driver['status']

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'on_trip', label: 'On Trip' },
  { value: 'available', label: 'Available' },
  { value: 'off_duty', label: 'Off Duty' },
]

function getLicenseWarning(expiry: string): boolean {
  const expiryDate = new Date(expiry)
  const now = new Date('2026-07-12')
  const daysUntil = Math.ceil((expiryDate.getTime() - now.getTime()) / 86400000)
  return daysUntil <= 90
}

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDrivers() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDrivers()
        if (!cancelled) setDrivers(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load drivers')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDrivers()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return drivers.filter((driver) => {
      const matchesSearch =
        !query ||
        driver.name.toLowerCase().includes(query) ||
        driver.license.toLowerCase().includes(query) ||
        driver.id.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [drivers, search, statusFilter])

  const onTripCount = drivers.filter((d) => d.status === 'on_trip').length
  const availableCount = drivers.filter((d) => d.status === 'available').length
  const avgSafety =
    drivers.length > 0
      ? Math.round(drivers.reduce((sum, driver) => sum + driver.safetyScore, 0) / drivers.length)
      : 0
  const totalTrips = drivers.reduce((sum, d) => sum + d.tripsCompleted, 0)

  const statusCounts = {
    all: drivers.length,
    on_trip: onTripCount,
    available: availableCount,
    off_duty: drivers.filter((d) => d.status === 'off_duty').length,
  }

  return (
    <div className="page drivers-page">
      <div className="page-header">
        <h1 className="page-title">Driver Management</h1>
        <button type="button" className="btn btn--primary">
          + Add Driver
        </button>
      </div>
      <p className="page-subtitle">
        Track driver compliance, license validity, and safety performance.
      </p>

      <div className="kpi-grid drivers-performance-grid">
        <KpiCard
          label="Avg Safety Score"
          value={`${avgSafety}%`}
          trend={avgSafety >= 85 ? 'Above fleet target' : 'Below fleet target'}
          trendDirection={avgSafety >= 85 ? 'up' : 'down'}
          variant={avgSafety >= 85 ? 'success' : 'warning'}
          icon="🛡️"
        />
        <KpiCard
          label="Drivers On Trip"
          value={onTripCount}
          trend={`${onTripCount} active routes`}
          trendDirection={onTripCount > 0 ? 'up' : 'neutral'}
          variant="info"
          icon="🚛"
        />
        <KpiCard
          label="Available Drivers"
          value={availableCount}
          trend={`${statusCounts.off_duty} off duty`}
          trendDirection="neutral"
          variant="default"
          icon="👤"
        />
        <KpiCard
          label="Total Trips Completed"
          value={totalTrips}
          trend={`${drivers.length} drivers in roster`}
          trendDirection="up"
          variant="success"
          icon="📊"
        />
      </div>

      <div className="mgmt-toolbar">
        <div className="search-input-wrap">
          <span className="search-input-icon" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, license, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`filter-tab ${statusFilter === filter.value ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
              <span className="filter-tab-count">{statusCounts[filter.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap table-wrap--responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Expiry</th>
              <th>Safety Score</th>
              <th>Status</th>
              <th>Trips</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  Loading drivers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  No drivers match your search or filters.
                </td>
              </tr>
            ) : (
              filtered.map((driver) => (
                <tr key={driver.id}>
                  <td data-label="Name">
                    <strong>{driver.name}</strong>
                    <div className="mono muted">{driver.id}</div>
                  </td>
                  <td data-label="License" className="mono">
                    {driver.license}
                  </td>
                  <td
                    data-label="Expiry"
                    className={getLicenseWarning(driver.licenseExpiry) ? 'text-danger' : ''}
                  >
                    {driver.licenseExpiry}
                  </td>
                  <td data-label="Safety Score">
                    <SafetyBar score={driver.safetyScore} />
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={driver.status} />
                  </td>
                  <td data-label="Trips">{driver.tripsCompleted}</td>
                  <td data-label="Actions">
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => setSelectedDriver(driver)}
                      >
                        View
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="data-cards">
        {loading ? (
          <div className="empty-state">Loading drivers...</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No drivers match your search or filters.</div>
        ) : (
          filtered.map((driver) => (
            <div key={driver.id} className="data-card">
              <div className="data-card-header">
                <div>
                  <strong>{driver.name}</strong>
                  <div className="mono muted">{driver.id}</div>
                </div>
                <StatusBadge status={driver.status} />
              </div>
              <div className="data-card-body">
                <p>
                  <span>License</span>
                  <span className="mono">{driver.license}</span>
                </p>
                <p>
                  <span>Expiry</span>
                  <span className={getLicenseWarning(driver.licenseExpiry) ? 'text-danger' : ''}>
                    {driver.licenseExpiry}
                  </span>
                </p>
                <p>
                  <span>Safety Score</span>
                  <SafetyBar score={driver.safetyScore} />
                </p>
                <p>
                  <span>Trips</span>
                  <span>{driver.tripsCompleted}</span>
                </p>
              </div>
              <div className="table-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setSelectedDriver(driver)}
                >
                  View Details
                </button>
                <button type="button" className="btn btn--ghost btn--sm">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedDriver && (
        <DriverDetailModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}
    </div>
  )
}
