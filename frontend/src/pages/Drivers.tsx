import { drivers } from '../data/mockData'
import { StatusBadge } from '../components/StatusBadge'

function SafetyBar({ score }: { score: number }) {
  const color = score >= 85 ? 'high' : score >= 70 ? 'mid' : 'low'
  return (
    <div className="safety-bar">
      <div className={`safety-bar-fill safety-bar-fill--${color}`} style={{ width: `${score}%` }} />
      <span>{score}%</span>
    </div>
  )
}

export function Drivers() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Drivers</h1>
        <button className="btn btn--primary">+ Add Driver</button>
      </div>
      <p className="page-subtitle">Track driver compliance, license validity, and safety scores.</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Expiry</th>
              <th>Safety Score</th>
              <th>Status</th>
              <th>Trips</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td><strong>{d.name}</strong></td>
                <td className="mono">{d.license}</td>
                <td className={new Date(d.licenseExpiry) < new Date('2026-10-01') ? 'text-danger' : ''}>
                  {d.licenseExpiry}
                </td>
                <td><SafetyBar score={d.safetyScore} /></td>
                <td><StatusBadge status={d.status} /></td>
                <td>{d.tripsCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
