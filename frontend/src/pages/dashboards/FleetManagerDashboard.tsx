import { Link } from 'react-router-dom'
import { drivers, maintenanceRecords, trips, vehicles } from '../../data/mockData'
import { KpiCard } from '../../components/finance/KpiCard'
import { FleetQuickLinks } from '../../components/fleet/FleetQuickLinks'
import { StatusBadge } from '../../components/StatusBadge'
import { formatRelativeDate } from '../../utils/finance'

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
  const activeVehicles = vehicles.filter((v) => v.status === 'active').length
  const activeTrips = trips.filter((t) => t.status === 'active').length
  const scheduledTrips = trips.filter((t) => t.status === 'scheduled').length
  const inMaintenance = vehicles.filter((v) => v.status === 'maintenance').length
  const pendingMaintenance = maintenanceRecords.filter((m) => m.status === 'pending').length
  const availableDrivers = drivers.filter((d) => d.status === 'available').length
  const fleetUtilization = Math.round((activeVehicles / vehicles.length) * 100)
  const recentActivity = buildRecentActivity()

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
          value={vehicles.length}
          trend={`${activeVehicles} active · ${inMaintenance} in service`}
          trendDirection="neutral"
          variant="default"
          icon="🚛"
        />
        <KpiCard
          label="Active Trips"
          value={activeTrips}
          trend={`${scheduledTrips} scheduled today`}
          trendDirection={activeTrips > 0 ? 'up' : 'neutral'}
          variant="success"
          icon="🗺️"
        />
        <KpiCard
          label="Fleet Utilization"
          value={`${fleetUtilization}%`}
          trend={`${availableDrivers} drivers available`}
          trendDirection={fleetUtilization >= 60 ? 'up' : 'down'}
          variant="info"
          icon="📊"
        />
        <KpiCard
          label="Pending Maintenance"
          value={pendingMaintenance}
          trend={inMaintenance > 0 ? `${inMaintenance} vehicle in shop` : 'All clear'}
          trendDirection={pendingMaintenance > 0 ? 'down' : 'up'}
          variant={pendingMaintenance > 0 ? 'warning' : 'success'}
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
