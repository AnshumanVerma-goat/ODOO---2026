import { useAuth } from '../../context/AuthContext'
import { useTrips } from '../../context/TripsContext'
import { DriverTripsPanel } from '../../components/DriverTripsPanel'
import { StatCard } from '../../components/StatCard'
import { StatusBadge } from '../../components/StatusBadge'

export function DriverDashboard() {
  const { user } = useAuth()
  const { getTripsForDriver, getIssuesForDriver } = useTrips()

  const driverId = user?.driverId ?? ''
  const myTrips = driverId ? getTripsForDriver(driverId) : []
  const myIssues = driverId ? getIssuesForDriver(driverId) : []

  const activeTrips = myTrips.filter((trip) => trip.status === 'active').length
  const scheduledTrips = myTrips.filter((trip) => trip.status === 'scheduled').length
  const completedTrips = myTrips.filter((trip) => trip.status === 'completed').length
  const openIssues = myIssues.filter((issue) => issue.status === 'open').length

  return (
    <div className="page">
      <h1 className="page-title">Driver Dashboard</h1>
      <p className="page-subtitle">
        Welcome back, {user?.name}. Manage your assigned trips and report issues on the road.
      </p>

      <div className="stats-grid">
        <StatCard label="Active Deliveries" value={activeTrips} variant="success" />
        <StatCard label="Scheduled Trips" value={scheduledTrips} />
        <StatCard label="Completed Trips" value={completedTrips} />
        <StatCard label="Open Issues" value={openIssues} variant={openIssues > 0 ? 'warning' : 'default'} />
      </div>

      <DriverTripsPanel title="Assigned Trips" />

      {myIssues.length > 0 && (
        <section className="section">
          <h2>Reported Issues</h2>
          <div className="card-list">
            {myIssues.map((issue) => (
              <div key={issue.id} className="card">
                <div className="card-header">
                  <strong>
                    <span className="mono">{issue.tripId}</span> · {issue.category}
                  </strong>
                  <StatusBadge status={issue.status} />
                </div>
                <p>{issue.description}</p>
                <p className="muted">
                  Reported {new Date(issue.reportedAt).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
