import { maintenanceRecords, trips, vehicles } from '../../data/mockData'
import { StatCard } from '../../components/StatCard'
import { StatusBadge } from '../../components/StatusBadge'

export function FleetManagerDashboard() {
  const activeTrips = trips.filter((t) => t.status === 'active').length

  return (
    <div className="page">
      <h1 className="page-title">Fleet Manager Dashboard</h1>
      <p className="page-subtitle">Overview of fleet assets, maintenance, and operations.</p>

      <div className="stats-grid">
        <StatCard label="Total Vehicles" value={vehicles.length} trend="3 active" />
        <StatCard label="Active Trips" value={activeTrips} variant="success" />
        <StatCard
          label="In Maintenance"
          value={vehicles.filter((v) => v.status === 'maintenance').length}
          variant="warning"
        />
        <StatCard
          label="Pending Maintenance"
          value={maintenanceRecords.filter((m) => m.status === 'pending').length}
          variant="warning"
        />
      </div>

      <section className="section">
        <h2>Fleet Overview</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Plate</th>
                <th>Status</th>
                <th>Mileage</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.plate}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>{v.mileage.toLocaleString()} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
