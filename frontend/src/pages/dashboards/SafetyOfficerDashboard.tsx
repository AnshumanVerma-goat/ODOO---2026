import { drivers } from '../../data/mockData'
import { StatCard } from '../../components/StatCard'

export function SafetyOfficerDashboard() {
  const avgSafety = Math.round(drivers.reduce((s, d) => s + d.safetyScore, 0) / drivers.length)
  const expiringLicenses = drivers.filter(
    (d) => new Date(d.licenseExpiry) < new Date('2026-10-01'),
  ).length

  return (
    <div className="page">
      <h1 className="page-title">Safety Officer Dashboard</h1>
      <p className="page-subtitle">Driver compliance, safety scores, and license monitoring.</p>

      <div className="stats-grid">
        <StatCard
          label="Avg Safety Score"
          value={`${avgSafety}%`}
          variant={avgSafety >= 80 ? 'success' : 'warning'}
        />
        <StatCard
          label="Licenses Expiring Soon"
          value={expiringLicenses}
          variant={expiringLicenses > 0 ? 'danger' : 'success'}
        />
        <StatCard
          label="Drivers On Trip"
          value={drivers.filter((d) => d.status === 'on_trip').length}
        />
        <StatCard
          label="Low Score Drivers"
          value={drivers.filter((d) => d.safetyScore < 75).length}
          variant="warning"
        />
      </div>

      <section className="section">
        <h2>Compliance Alerts</h2>
        <div className="card-list">
          {drivers
            .filter(
              (d) => d.safetyScore < 75 || new Date(d.licenseExpiry) < new Date('2026-10-01'),
            )
            .map((d) => (
              <div key={d.id} className="card card--alert">
                <strong>{d.name}</strong>
                <p>
                  Safety Score: {d.safetyScore}% · License expires {d.licenseExpiry}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
