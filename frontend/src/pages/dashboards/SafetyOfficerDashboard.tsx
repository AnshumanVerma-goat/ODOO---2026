import { Link } from 'react-router-dom'
import { complianceRecords, incidentsByCategory, monthlySafetyScores } from '../../data/safetyData'
import { useSafety } from '../../context/SafetyContext'
import { BarChart } from '../../components/finance/BarChart'
import { DonutChart } from '../../components/finance/DonutChart'
import { KpiCard } from '../../components/finance/KpiCard'
import { SafetyQuickLinks } from '../../components/safety/SafetyQuickLinks'
import { SafetyPanel } from '../../components/safety/SafetyPanel'
import { StatusBadge } from '../../components/StatusBadge'
import { formatRelativeDate, severityColor } from '../../utils/safety'

const COMPLIANCE_COLORS = {
  compliant: '#16a34a',
  at_risk: '#d97706',
  non_compliant: '#dc2626',
}

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
  const compliantRate = Math.round(
    (complianceRecords.filter((r) => r.status === 'compliant').length /
      complianceRecords.length) *
      100,
  )

  const priorScore = monthlySafetyScores[monthlySafetyScores.length - 2]?.score ?? avgSafety
  const currentScore = monthlySafetyScores[monthlySafetyScores.length - 1]?.score ?? avgSafety
  const scoreTrend = currentScore - priorScore

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const alertDrivers = complianceRecords.filter(
    (r) => r.status !== 'compliant' || r.licenseStatus !== 'valid',
  )

  const openIncidentList = incidents
    .filter((i) => i.status === 'open' || i.status === 'investigating')
    .slice(0, 4)

  const complianceBreakdown = [
    {
      label: 'Compliant',
      value: complianceRecords.filter((r) => r.status === 'compliant').length,
      color: COMPLIANCE_COLORS.compliant,
    },
    {
      label: 'At Risk',
      value: complianceRecords.filter((r) => r.status === 'at_risk').length,
      color: COMPLIANCE_COLORS.at_risk,
    },
    {
      label: 'Non-Compliant',
      value: complianceRecords.filter((r) => r.status === 'non_compliant').length,
      color: COMPLIANCE_COLORS.non_compliant,
    },
  ]

  return (
    <div className="page safety-page">
      <div className="page-header safety-page-header">
        <div>
          <h1 className="page-title">Safety Officer Dashboard</h1>
          <p className="page-subtitle">
            Enterprise overview of fleet safety, compliance, incidents, and regulatory readiness.
          </p>
        </div>
        <Link to="/safety/notifications" className="btn btn--ghost notification-btn">
          🔔 Notifications
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </Link>
      </div>

      <div className="kpi-grid">
        <KpiCard
          label="Avg Safety Score"
          value={`${avgSafety}%`}
          trend={`${scoreTrend >= 0 ? '+' : ''}${scoreTrend}% vs last month`}
          trendDirection={scoreTrend >= 0 ? 'up' : 'down'}
          variant={avgSafety >= 80 ? 'success' : 'warning'}
          icon="🛡️"
        />
        <KpiCard
          label="Open Incidents"
          value={openIncidents}
          trend={`${incidents.filter((i) => i.severity === 'critical').length} critical`}
          trendDirection={openIncidents > 0 ? 'down' : 'up'}
          variant={openIncidents > 0 ? 'danger' : 'success'}
          icon="⚠️"
        />
        <KpiCard
          label="License Alerts"
          value={expiringLicenses}
          trend={`${complianceRecords.filter((r) => r.licenseStatus === 'expired').length} expired`}
          trendDirection={expiringLicenses > 0 ? 'down' : 'up'}
          variant={expiringLicenses > 0 ? 'warning' : 'success'}
          icon="🪪"
        />
        <KpiCard
          label="Compliance Rate"
          value={`${compliantRate}%`}
          trend={`${nonCompliant} non-compliant`}
          trendDirection={compliantRate >= 80 ? 'up' : 'down'}
          variant={compliantRate >= 80 ? 'success' : 'warning'}
          icon="✓"
        />
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <SafetyQuickLinks />
      </section>

      <div className="safety-dashboard-charts">
        <SafetyPanel title="Monthly Safety Score Trend" wide>
          <BarChart
            data={monthlySafetyScores.map((m) => ({
              label: m.month,
              value: m.score,
              displayValue: `${m.score}%`,
            }))}
            height={180}
            variant="maintenance"
          />
        </SafetyPanel>
        <SafetyPanel title="Compliance Breakdown">
          <DonutChart
            data={complianceBreakdown}
            centerLabel="Compliant"
            centerValue={`${compliantRate}%`}
          />
        </SafetyPanel>
        <SafetyPanel title="Incidents by Category">
          <div className="safety-category-list">
            {incidentsByCategory.map((item) => {
              const max = Math.max(...incidentsByCategory.map((c) => c.count))
              return (
                <div key={item.category} className="safety-category-row">
                  <span>{item.category}</span>
                  <div className="safety-category-bar-wrap">
                    <div
                      className="safety-category-bar"
                      style={{ width: `${(item.count / max) * 100}%` }}
                    />
                  </div>
                  <span className="safety-category-count">{item.count}</span>
                </div>
              )
            })}
          </div>
        </SafetyPanel>
      </div>

      <div className="dashboard-split">
        <section className="section">
          <div className="section-header">
            <h2>Compliance Alerts</h2>
            <Link to="/safety/compliance" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="safety-alert-list">
            {alertDrivers.length === 0 ? (
              <div className="empty-state">All drivers are compliant.</div>
            ) : (
              alertDrivers.slice(0, 5).map((record) => (
                <div key={record.driverId} className="safety-alert-card">
                  <div className="safety-alert-card-header">
                    <strong>{record.driverName}</strong>
                    <StatusBadge status={record.status} />
                  </div>
                  <p>
                    Score: {record.safetyScore}% · License:{' '}
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
          <div className="safety-alert-list">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`safety-alert-card ${notification.read ? '' : 'safety-alert-card--unread'}`}
              >
                <div className="safety-alert-card-header">
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
        <div className="safety-incident-grid">
          {openIncidentList.length === 0 ? (
            <div className="empty-state">No open incidents at this time.</div>
          ) : (
            openIncidentList.map((incident) => (
              <div key={incident.id} className={`safety-incident-card safety-incident-card--${incident.severity}`}>
                <div className="safety-incident-card-header">
                  <div>
                    <span className="mono">{incident.id}</span>
                    <h3>{incident.title}</h3>
                  </div>
                  <div className="incident-badges">
                    <span className={`badge badge--${severityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <StatusBadge status={incident.status} />
                  </div>
                </div>
                <p className="incident-meta">
                  {incident.driverName} · {formatRelativeDate(incident.reportedAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
