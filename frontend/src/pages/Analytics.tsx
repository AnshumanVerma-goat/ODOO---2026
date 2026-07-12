import { drivers, expenses, trips, vehicles } from '../data/mockData'

export function Analytics() {
  const fuelTotal = expenses.filter((e) => e.category === 'fuel').reduce((s, e) => s + e.amount, 0)
  const maintTotal = expenses.filter((e) => e.category === 'maintenance').reduce((s, e) => s + e.amount, 0)
  const tripCompletion = Math.round((trips.filter((t) => t.status === 'completed').length / trips.length) * 100)
  const fleetUtilization = Math.round((vehicles.filter((v) => v.status === 'active').length / vehicles.length) * 100)

  const monthlyFuel = [
    { month: 'Mar', amount: 62000 },
    { month: 'Apr', amount: 71000 },
    { month: 'May', amount: 68000 },
    { month: 'Jun', amount: 74000 },
    { month: 'Jul', amount: fuelTotal },
  ]
  const maxFuel = Math.max(...monthlyFuel.map((m) => m.amount))

  return (
    <div className="page">
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Operational insights, profitability, and performance metrics.</p>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Fleet Utilization</h3>
          <div className="big-metric">{fleetUtilization}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${fleetUtilization}%` }} />
          </div>
        </div>

        <div className="analytics-card">
          <h3>Trip Completion Rate</h3>
          <div className="big-metric">{tripCompletion}%</div>
          <div className="progress-bar">
            <div className="progress-fill progress-fill--green" style={{ width: `${tripCompletion}%` }} />
          </div>
        </div>

        <div className="analytics-card">
          <h3>Cost Breakdown</h3>
          <div className="cost-breakdown">
            <div className="cost-row">
              <span>Fuel</span>
              <span>₹{fuelTotal.toLocaleString()}</span>
            </div>
            <div className="cost-row">
              <span>Maintenance</span>
              <span>₹{maintTotal.toLocaleString()}</span>
            </div>
            <div className="cost-row cost-row--total">
              <span>Total</span>
              <span>₹{(fuelTotal + maintTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <h3>Monthly Fuel Consumption</h3>
          <div className="bar-chart">
            {monthlyFuel.map((m) => (
              <div key={m.month} className="bar-group">
                <div
                  className="bar"
                  style={{ height: `${(m.amount / maxFuel) * 100}%` }}
                  title={`₹${m.amount.toLocaleString()}`}
                />
                <span className="bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <h3>Driver Safety Rankings</h3>
          <div className="ranking-list">
            {[...drivers]
              .sort((a, b) => b.safetyScore - a.safetyScore)
              .map((d, i) => (
                <div key={d.id} className="ranking-item">
                  <span className="rank">#{i + 1}</span>
                  <span className="name">{d.name}</span>
                  <span className="score">{d.safetyScore}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
