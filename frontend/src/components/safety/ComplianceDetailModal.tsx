import { SafetyBar } from '../SafetyBar'
import { StatusBadge } from '../StatusBadge'
import type { ComplianceRecord } from '../../types'

interface ComplianceDetailModalProps {
  record: ComplianceRecord
  onClose: () => void
}

export function ComplianceDetailModal({ record, onClose }: ComplianceDetailModalProps) {
  const initials = record.driverName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Compliance Review</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="safety-detail-header">
          <div className="safety-avatar">{initials}</div>
          <div>
            <h3>{record.driverName}</h3>
            <p className="mono muted">{record.driverId}</p>
            <StatusBadge status={record.status} />
          </div>
        </div>

        <div className="safety-detail-grid">
          <div className="safety-detail-stat">
            <span className="safety-detail-label">Safety Score</span>
            <SafetyBar score={record.safetyScore} />
          </div>
          <div className="safety-detail-stat">
            <span className="safety-detail-label">Last Review</span>
            <strong>{record.lastReview}</strong>
          </div>
          <div className="safety-detail-stat">
            <span className="safety-detail-label">Training</span>
            <StatusBadge status={record.trainingComplete ? 'completed' : 'pending'} />
          </div>
          <div className="safety-detail-stat">
            <span className="safety-detail-label">Medical Clearance</span>
            <StatusBadge status={record.medicalClearance ? 'active' : 'off_duty'} />
          </div>
        </div>

        <div className="safety-detail-section">
          <h4>License Information</h4>
          <div className="safety-detail-rows">
            <p>
              <span>License Number</span>
              <span className="mono">{record.license}</span>
            </p>
            <p>
              <span>Expiry Date</span>
              <span>{record.licenseExpiry}</span>
            </p>
            <p>
              <span>License Status</span>
              <StatusBadge status={record.licenseStatus} />
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn--primary">
            Schedule Review
          </button>
        </div>
      </div>
    </div>
  )
}
