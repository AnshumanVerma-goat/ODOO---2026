import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { getVehicles } from '../services/vehicleService'
import type { Vehicle } from '../types'

type StatusFilter = 'all' | Vehicle['status']

const PAGE_SIZE = 4

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'idle', label: 'Idle' },
]

export function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function loadVehicles() {
      try {
        setLoading(true)
        setError(null)
        const data = await getVehicles()
        if (!cancelled) setVehicles(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load vehicles')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVehicles()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.plate.toLowerCase().includes(query) ||
        vehicle.id.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [vehicles, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const statusCounts = {
    all: vehicles.length,
    active: vehicles.filter((v) => v.status === 'active').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
    idle: vehicles.filter((v) => v.status === 'idle').length,
  }

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="page vehicle-page">
      <div className="page-header">
        <h1 className="page-title">Vehicle Management</h1>
        <button type="button" className="btn btn--primary">
          + Add Vehicle
        </button>
      </div>
      <p className="page-subtitle">
        Manage fleet assets, vehicle lifecycle, and operational status.
      </p>

      <div className="summary-bar vehicle-summary-bar">
        <span>
          Total: <strong>{vehicles.length}</strong>
        </span>
        <span>
          Active: <strong>{statusCounts.active}</strong>
        </span>
        <span>
          In Maintenance: <strong>{statusCounts.maintenance}</strong>
        </span>
        <span>
          Idle: <strong>{statusCounts.idle}</strong>
        </span>
      </div>

      <div className="mgmt-toolbar">
        <div className="search-input-wrap">
          <span className="search-input-icon" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, plate, or ID..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`filter-tab ${statusFilter === filter.value ? 'filter-tab--active' : ''}`}
              onClick={() => handleFilterChange(filter.value)}
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
              <th>ID</th>
              <th>Vehicle</th>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Mileage</th>
              <th>Last Service</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  Loading vehicles...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  {error}
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  No vehicles match your search or filters.
                </td>
              </tr>
            ) : (
              paginated.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td data-label="ID" className="mono">
                    {vehicle.id}
                  </td>
                  <td data-label="Vehicle">
                    <strong>{vehicle.name}</strong>
                  </td>
                  <td data-label="Plate">{vehicle.plate}</td>
                  <td data-label="Status">
                    <StatusBadge status={vehicle.status} />
                  </td>
                  <td data-label="Mileage">{vehicle.mileage.toLocaleString()} km</td>
                  <td data-label="Last Service">{vehicle.lastService}</td>
                  <td data-label="Actions">
                    <div className="table-actions">
                      <button type="button" className="btn btn--ghost btn--sm" title="View details">
                        View
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm" title="Edit vehicle">
                        Edit
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm" title="Schedule service">
                        Service
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
          <div className="empty-state">Loading vehicles...</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : paginated.length === 0 ? (
          <div className="empty-state">No vehicles match your search or filters.</div>
        ) : (
          paginated.map((vehicle) => (
            <div key={vehicle.id} className="data-card">
              <div className="data-card-header">
                <div>
                  <strong>{vehicle.name}</strong>
                  <div className="mono muted">{vehicle.id}</div>
                </div>
                <StatusBadge status={vehicle.status} />
              </div>
              <div className="data-card-body">
                <p>
                  <span>Plate</span>
                  <span>{vehicle.plate}</span>
                </p>
                <p>
                  <span>Mileage</span>
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </p>
                <p>
                  <span>Last Service</span>
                  <span>{vehicle.lastService}</span>
                </p>
              </div>
              <div className="table-actions">
                <button type="button" className="btn btn--ghost btn--sm">
                  View
                </button>
                <button type="button" className="btn btn--ghost btn--sm">
                  Edit
                </button>
                <button type="button" className="btn btn--ghost btn--sm">
                  Service
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  )
}
