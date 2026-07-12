import { trips } from '../../data/mockData'
import { SafetyBar } from '../SafetyBar'
import { StatusBadge } from '../StatusBadge'
import type { Driver } from '../../types'

function getLicenseStatus(expiry: string): 'valid' | 'expiring_soon' | 'expired' {
  const expiryDate = new Date(expiry)
  const now = new Date('2026-07-12')
  const daysUntil = Math.ceil((expiryDate.getTime() - now.getTime()) / 86400000)
  if (daysUntil < 0) return 'expired'
  if (daysUntil <= 90) return 'expiring_soon'
  return 'valid'
}

interface DriverDetailModalProps {
  driver: Driver
  onClose: () => void
}

export function DriverDetailModal({ driver, onClose }: DriverDetailModalProps) {
  const driverTrips = trips.filter((trip) => trip.driverId === driver.id)
  const activeTrips = driverTrips.filter((trip) => trip.status === 'active').length
  const completedTrips = driverTrips.filter((trip) => trip.status === 'completed').length
  const licenseStatus = getLicenseStatus(driver.licenseExpiry)
  const initials = driver.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Driver Details</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="driver-detail-header">
          <div className="driver-avatar">{initials}</div>
          <div>
            <h3>{driver.name}</h3>
            <p className="mono muted">{driver.id}</p>
            <StatusBadge status={driver.status} />
          </div>
        </div>

        <div className="driver-detail-grid">
          <div className="driver-detail-stat">
            <span className="driver-detail-label">Safety Score</span>
            <SafetyBar score={driver.safetyScore} />
          </div>
          <div className="driver-detail-stat">
            <span className="driver-detail-label">Trips Completed</span>
            <strong>{driver.tripsCompleted}</strong>
          </div>
          <div className="driver-detail-stat">
            <span className="driver-detail-label">Active Trips</span>
            <strong>{activeTrips}</strong>
          </div>
          <div className="driver-detail-stat">
            <span className="driver-detail-label">Completion Rate</span>
            <strong>
              {driverTrips.length > 0
                ? `${Math.round((completedTrips / driverTrips.length) * 100)}%`
                : '—'}
            </strong>
          </div>
        </div>

        <div className="driver-detail-section">
          <h4>License Information</h4>
          <div className="driver-detail-rows">
            <p>
              <span>License Number</span>
              <span className="mono">{driver.license}</span>
            </p>
            <p>
              <span>Expiry Date</span>
              <span>{driver.licenseExpiry}</span>
            </p>
            <p>
              <span>Status</span>
              <StatusBadge status={licenseStatus} />
            </p>
          </div>
        </div>

        <div className="driver-detail-section">
          <h4>Assigned Trips</h4>
          {driverTrips.length === 0 ? (
            <p className="muted">No trips assigned to this driver.</p>
          ) : (
            <div className="driver-trip-list">
              {driverTrips.map((trip) => (
                <div key={trip.id} className="driver-trip-item">
                  <div>
                    <strong>{trip.route}</strong>
                    <p className="muted">
                      {trip.vehicle} · {trip.startTime}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn--primary">
            Edit Driver
          </button>
        </div>
      </div>
    </div>
  )
}
