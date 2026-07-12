import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../api/client'
import { maintenanceRecords, trips, vehicles } from '../../data/mockData'
import { KpiCard } from '../../components/finance/KpiCard'
import { FleetQuickLinks } from '../../components/fleet/FleetQuickLinks'
import { StatusBadge } from '../../components/StatusBadge'
import { formatRelativeDate } from '../../utils/finance'

interface DashboardKPIs {
  active_vehicles: number
  available_vehicles: number
  vehicles_in_shop: number
  retired_vehicles: number
  drivers_available: number
  drivers_on_trip: number
  drivers_suspended: number
  pending_trips: number
  completed_trips: number
  fleet_utilization: number
  total_fuel_cost: number
  total_maintenance_cost: number
  operational_cost: number
  average_fuel_efficiency: number
  vehicle_roi: number
}

interface DashboardKpisResponse {
  success: boolean
  message: string
  data: DashboardKPIs
}

interface FleetActivity {
  id: string
  icon: string
  title: string
  description: string
  timestamp: string
  status?: string
}

function buildRecentActivity(): FleetActivity[] {
  const activities: FleetActivity[] = []

  trips
    .filter((trip) => trip.status === 'active' || trip.status === 'completed')
    .forEach((trip) => {
      activities.push({
        id: `trip-${trip.id}`,
        icon: trip.status === 'active' ? '🚛' : '✅',
        title:
          trip.status === 'active'
            ? `${trip.vehicle} en route`
            : `Trip completed — ${trip.vehicle}`,
        description: `${trip.route} · ${trip.driver}`,
        timestamp: `2026-07-12T${trip.startTime}:00`,
        status: trip.status,
      })
    })

  maintenanceRecords.forEach((record) => {
    activities.push({
      id: `maint-${record.id}`,
      icon: record.status === 'completed' ? '✅' : '🔧',
      title: record.type,
      description: `${record.vehicle} · ₹${record.cost.toLocaleString('en-IN')}`,
      timestamp: `${record.scheduledDate}T10:00:00`,
      status: record.status,
    })
  })

  vehicles
    .filter((vehicle) => vehicle.status === 'maintenance' || vehicle.status === 'idle')
    .forEach((vehicle) => {
      activities.push({
        id: `vehicle-${vehicle.id}`,
        icon: vehicle.status === 'maintenance' ? '⚠️' : '⏸️',
        title: `${vehicle.name} — ${vehicle.status}`,
        description: `${vehicle.plate} · ${vehicle.mileage.toLocaleString()} km`,
        timestamp: `${vehicle.lastService}T08:00:00`,
        status: vehicle.status,
      })
    })

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)
}

export function FleetManagerDashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [kpisLoading, setKpisLoading] = useState(true)
  const [kpisError, setKpisError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadKpis() {
      try {
        setKpisLoading(true)
        setKpisError(null)
        const response = await apiClient.get<DashboardKpisResponse>('/dashboard/kpis')
        if (!cancelled) setKpis(response.data)
      } catch (err) {
        if (!cancelled) {
          setKpisError(err instanceof Error ? err.message : 'Failed to load dashboard KPIs')
        }
      } finally {
        if (!cancelled) setKpisLoading(false)
      }
    }

    loadKpis()
    return () => {
      cancelled = true
    }
  }, [])

  const activeTrips = trips.filter((t) => t.status === 'active').length
  const recentActivity = buildRecentActivity()

  const totalVehicles = kpis ? kpis.active_vehicles + kpis.retired_vehicles : 0
  const activeVehicleCount = kpis ? kpis.active_vehicles - kpis.vehicles_in_shop : 0
  const vehiclesInShop = kpis?.vehicles_in_shop ?? 0
  const activeTripCount = kpis?.drivers_on_trip ?? 0
  const pendingTrips = kpis?.pending_trips ?? 0
  const fleetUtilization = kpis ? Math.round(kpis.fleet_utilization) : 0
  const availableDrivers = kpis?.drivers_available ?? 0

  return (
    <div className="page fleet-page">
      <div className="page-header fleet-page-header">
        <div>
          <h1 className="page-title">Fleet Manager Dashboard</h1>
          <p className="page-subtitle">
            Real-time overview of fleet assets, trips, maintenance, and operations.
          </p>
        </div>
        <Link to="/trips" className="btn btn--primary">
          View Trips
        </Link>
      </div>

      <div className="kpi-grid">
        <KpiCard
          label="Total Vehicles"
          value={kpisLoading ? '—' : totalVehicles}
          trend={
            kpisLoading
              ? 'Loading...'
              : kpisError
                ? kpisError
                : `${activeVehicleCount} active · ${vehiclesInShop} in service`
          }
          trendDirection="neutral"
          variant="default"
          icon="🚛"
        />
        <KpiCard
          label="Active Trips"
          value={kpisLoading ? '—' : activeTripCount}
          trend={
            kpisLoading
              ? 'Loading...'
              : kpisError
                ? kpisError
                : `${pendingTrips} scheduled today`
          }
          trendDirection={activeTripCount > 0 ? 'up' : 'neutral'}
          variant="success"
          icon="🗺️"
        />
        <KpiCard
          label="Fleet Utilization"
          value={kpisLoading ? '—' : `${fleetUtilization}%`}
          trend={
            kpisLoading
              ? 'Loading...'
              : kpisError
                ? kpisError
                : `${availableDrivers} drivers available`
          }
          trendDirection={fleetUtilization >= 60 ? 'up' : 'down'}
          variant="info"
          icon="📊"
        />
        <KpiCard
          label="Pending Maintenance"
          value={kpisLoading ? '—' : vehiclesInShop}
          trend={
            kpisLoading
              ? 'Loading...'
              : kpisError
                ? kpisError
                : vehiclesInShop > 0
                  ? `${vehiclesInShop} vehicle in shop`
                  : 'All clear'
          }
          trendDirection={vehiclesInShop > 0 ? 'down' : 'up'}
          variant={vehiclesInShop > 0 ? 'warning' : 'success'}
          icon="🔧"
        />
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <FleetQuickLinks />
      </section>

      <div className="fleet-dashboard-grid">
        <section className="section">
          <div className="section-header">
            <h2>Fleet Overview</h2>
            <Link to="/fleet" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Plate</th>
                  <th>Status</th>
                  <th className="hide-sm">Mileage</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <strong>{vehicle.name}</strong>
                    </td>
                    <td>{vehicle.plate}</td>
                    <td>
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="hide-sm">{vehicle.mileage.toLocaleString()} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/maintenance" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="fleet-activity-list">
            {recentActivity.length === 0 ? (
              <div className="empty-state">No recent fleet activity.</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="fleet-activity-item">
                  <span className="fleet-activity-icon">{activity.icon}</span>
                  <div className="fleet-activity-body">
                    <div className="fleet-activity-header">
                      <strong>{activity.title}</strong>
                      <span className="muted">{formatRelativeDate(activity.timestamp)}</span>
                    </div>
                    <p>{activity.description}</p>
                    {activity.status && (
                      <StatusBadge status={activity.status} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Active Trips</h2>
          <Link to="/trips" className="btn btn--ghost btn--sm">
            View all
          </Link>
        </div>
        <div className="fleet-trip-cards">
          {trips
            .filter((trip) => trip.status === 'active')
            .map((trip) => (
              <div key={trip.id} className="fleet-trip-card">
                <div className="fleet-trip-card-header">
                  <div>
                    <span className="mono">{trip.id}</span>
                    <h3>{trip.route}</h3>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
                <p className="fleet-trip-meta">
                  {trip.vehicle} · {trip.driver} · ETA {trip.eta}
                </p>
              </div>
            ))}
          {activeTrips === 0 && (
            <div className="empty-state">No active trips at the moment.</div>
          )}
        </div>
      </section>
    </div>
  )
}
