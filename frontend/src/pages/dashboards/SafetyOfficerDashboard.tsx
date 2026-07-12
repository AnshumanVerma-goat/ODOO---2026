import { Link } from 'react-router-dom'
import { complianceRecords } from '../../data/safetyData'
import { useSafety } from '../../context/SafetyContext'
import { StatCard } from '../../components/StatCard'
import { StatusBadge } from '../../components/StatusBadge'
import { SafetyQuickLinks } from '../../components/safety/SafetyQuickLinks'
import { formatRelativeDate } from '../../utils/safety'

export function SafetyOfficerDashboard() {
  const { incidents, notifications, unreadCount } = useSafety()

  const avgSafety = Math.round(
    complianceRecords.reduce((sum, record) => sum + record.safetyScore, 0) /
      complianceRecords.length,
  )
  const expiringLicenses = complianceRecords.filter(
    (r) => r.licenseStatus === 'expiring_soon' || r.licenseStatus === 'expired',
  ).length
  const openIncidents = incidents.filter(
    (i) => i.status === 'open' || i.status === 'investigating',
  ).length
  const nonCompliant = complianceRecords.filter((r) => r.status === 'non_compliant').length

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const alertDrivers = complianceRecords.filter(
    (r) => r.status !== 'compliant' || r.licenseStatus !== 'valid',
  )

  return (
    <div className="page">
      <div className="page-header safety-page-header">
        <div>
          <h1 className="page-title">Safety Officer Dashboard</h1>
          <p className="page-subtitle">
            Monitor driver compliance, track incidents, and manage fleet safety.
          </p>
        </div>
        <Link to="/safety/notifications" className="btn btn--ghost notification-btn">
          🔔 Notifications
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Avg Safety Score"
          value={`${avgSafety}%`}
          variant={avgSafety >= 80 ? 'success' : 'warning'}
        />
        <StatCard
          label="Open Incidents"
          value={openIncidents}
          variant={openIncidents > 0 ? 'danger' : 'success'}
        />
        <StatCard
          label="License Alerts"
          value={expiringLicenses}
          variant={expiringLicenses > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Non-Compliant"
          value={nonCompliant}
          variant={nonCompliant > 0 ? 'danger' : 'success'}
        />
      </div>

      <SafetyQuickLinks />

      <div className="dashboard-split">
        <section className="section">
          <div className="section-header">
            <h2>Compliance Alerts</h2>
            <Link to="/safety/compliance" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="card-list">
            {alertDrivers.length === 0 ? (
              <div className="empty-state">All drivers are compliant.</div>
            ) : (
              alertDrivers.map((record) => (
                <div key={record.driverId} className="card card--alert">
                  <div className="card-header">
                    <strong>{record.driverName}</strong>
                    <StatusBadge status={record.status} />
                  </div>
                  <p>
                    Safety Score: {record.safetyScore}% · License:{' '}
                    <StatusBadge status={record.licenseStatus} />
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Recent Notifications</h2>
            <Link to="/safety/notifications" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="card-list">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card ${notification.read ? '' : 'card--alert'}`}
              >
                <div className="card-header">
                  <strong>{notification.title}</strong>
                  <span className="muted">{formatRelativeDate(notification.createdAt)}</span>
                </div>
                <p>{notification.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Open Incidents</h2>
          <Link to="/safety/incidents" className="btn btn--ghost btn--sm">
            View all
          </Link>
        </div>
        <div className="incident-list incident-list--compact">
          {incidents
            .filter((i) => i.status === 'open' || i.status === 'investigating')
            .slice(0, 3)
            .map((incident) => (
              <div key={incident.id} className="incident-card incident-card--compact">
                <div className="incident-card-header">
                  <div>
                    <span className="mono">{incident.id}</span>
                    <h3>{incident.title}</h3>
                  </div>
                  <StatusBadge status={incident.status} />
                </div>
                <p className="incident-meta">
                  {incident.driverName} · {formatRelativeDate(incident.reportedAt)}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
