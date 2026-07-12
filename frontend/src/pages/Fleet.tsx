import { vehicles } from '../data/mockData'
import { StatusBadge } from '../components/StatusBadge'

export function Fleet() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Fleet</h1>
        <button className="btn btn--primary">+ Add Vehicle</button>
      </div>
      <p className="page-subtitle">Manage fleet assets, vehicle lifecycle, and operational status.</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Mileage</th>
              <th>Last Service</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="mono">{v.id}</td>
                <td><strong>{v.name}</strong></td>
                <td>{v.plate}</td>
                <td><StatusBadge status={v.status} /></td>
                <td>{v.mileage.toLocaleString()} km</td>
                <td>{v.lastService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
