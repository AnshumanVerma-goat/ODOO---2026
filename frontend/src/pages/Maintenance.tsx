import { maintenanceRecords } from '../data/mockData'
import { StatusBadge } from '../components/StatusBadge'

export function Maintenance() {
  const totalCost = maintenanceRecords.reduce((s, m) => s + m.cost, 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Maintenance</h1>
        <button className="btn btn--primary">+ Schedule Service</button>
      </div>
      <p className="page-subtitle">Oversee vehicle maintenance schedules and service history.</p>

      <div className="summary-bar">
        <span>Total scheduled cost: <strong>₹{totalCost.toLocaleString()}</strong></span>
        <span>Pending: <strong>{maintenanceRecords.filter((m) => m.status === 'pending').length}</strong></span>
        <span>In Progress: <strong>{maintenanceRecords.filter((m) => m.status === 'in_progress').length}</strong></span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Service Type</th>
              <th>Scheduled</th>
              <th>Status</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRecords.map((m) => (
              <tr key={m.id}>
                <td className="mono">{m.id}</td>
                <td>{m.vehicle}</td>
                <td>{m.type}</td>
                <td>{m.scheduledDate}</td>
                <td><StatusBadge status={m.status} /></td>
                <td>₹{m.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
