import { drivers } from '../../data/mockData'
import {
  complianceRecords,
  incidentsByCategory,
  monthlySafetyScores,
} from '../../data/safetyData'
import { SafetyBar } from '../../components/SafetyBar'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'

export function SafetyAnalytics() {
  const avgScore = Math.round(
    drivers.reduce((sum, driver) => sum + driver.safetyScore, 0) / drivers.length,
  )
  const compliantRate = Math.round(
    (complianceRecords.filter((r) => r.status === 'compliant').length /
      complianceRecords.length) *
      100,
  )
  const totalIncidents = incidentsByCategory.reduce((sum, item) => sum + item.count, 0)
  const maxScore = Math.max(...monthlySafetyScores.map((m) => m.score))
  const maxIncidents = Math.max(...incidentsByCategory.map((c) => c.count))

  return (
    <div className="page">
      <SafetyPageHeader
        title="Safety Analytics"
        subtitle="Fleet-wide safety trends, incident patterns, and compliance insights."
      />

      <div className="stats-grid">
        <div className="stat-card stat-card--success">
          <span className="stat-label">Avg Safety Score</span>
          <span className="stat-value">{avgScore}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Compliance Rate</span>
          <span className="stat-value">{compliantRate}%</span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-label">Total Incidents (YTD)</span>
          <span className="stat-value">{totalIncidents}</span>
        </div>
        <div className="stat-card stat-card--danger">
          <span className="stat-label">Low Score Drivers</span>
          <span className="stat-value">{drivers.filter((d) => d.safetyScore < 75).length}</span>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card analytics-card--wide">
          <h3>Monthly Safety Score Trend</h3>
          <div className="bar-chart">
            {monthlySafetyScores.map((item) => (
              <div key={item.month} className="bar-group">
                <div
                  className="bar bar--safety"
                  style={{ height: `${(item.score / maxScore) * 100}%` }}
                  title={`${item.score}%`}
                />
                <span className="bar-value">{item.score}%</span>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Compliance Breakdown</h3>
          <div className="big-metric">{compliantRate}%</div>
          <div className="progress-bar">
            <div className="progress-fill progress-fill--green" style={{ width: `${compliantRate}%` }} />
          </div>
          <div className="cost-breakdown" style={{ marginTop: '1rem' }}>
            <div className="cost-row">
              <span>Compliant</span>
              <span>{complianceRecords.filter((r) => r.status === 'compliant').length}</span>
            </div>
            <div className="cost-row">
              <span>At Risk</span>
              <span>{complianceRecords.filter((r) => r.status === 'at_risk').length}</span>
            </div>
            <div className="cost-row">
              <span>Non-Compliant</span>
              <span>{complianceRecords.filter((r) => r.status === 'non_compliant').length}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Incidents by Category</h3>
          <div className="incident-category-list">
            {incidentsByCategory.map((item) => (
              <div key={item.category} className="incident-category-row">
                <span>{item.category}</span>
                <div className="incident-category-bar-wrap">
                  <div
                    className="incident-category-bar"
                    style={{ width: `${(item.count / maxIncidents) * 100}%` }}
                  />
                </div>
                <span className="incident-category-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <h3>Driver Safety Rankings</h3>
          <div className="ranking-list">
            {[...drivers]
              .sort((a, b) => b.safetyScore - a.safetyScore)
              .map((driver, index) => (
                <div key={driver.id} className="ranking-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{driver.name}</span>
                  <SafetyBar score={driver.safetyScore} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
