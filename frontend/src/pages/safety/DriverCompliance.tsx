import { useState } from 'react'
import { complianceRecords } from '../../data/safetyData'
import { SafetyBar } from '../../components/SafetyBar'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import type { ComplianceStatus } from '../../types'

type Filter = 'all' | ComplianceStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Drivers' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'non_compliant', label: 'Non-Compliant' },
]

export function DriverCompliance() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered =
    filter === 'all'
      ? complianceRecords
      : complianceRecords.filter((record) => record.status === filter)

  const compliantCount = complianceRecords.filter((r) => r.status === 'compliant').length
  const atRiskCount = complianceRecords.filter((r) => r.status === 'at_risk').length
  const nonCompliantCount = complianceRecords.filter((r) => r.status === 'non_compliant').length

  return (
    <div className="page">
      <SafetyPageHeader
        title="Driver Compliance"
        subtitle="Monitor driver compliance, training status, and medical clearance."
        action={
          <button type="button" className="btn btn--primary">
            Schedule Review
          </button>
        }
      />

      <div className="summary-bar safety-summary-bar">
        <span>
          <strong>{compliantCount}</strong> Compliant
        </span>
        <span>
          <strong>{atRiskCount}</strong> At Risk
        </span>
        <span>
          <strong>{nonCompliantCount}</strong> Non-Compliant
        </span>
        <span>
          <strong>
            {Math.round((compliantCount / complianceRecords.length) * 100)}%
          </strong>{' '}
          Compliance Rate
        </span>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`filter-tab ${filter === item.value ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="table-wrap table-wrap--responsive">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Safety Score</th>
              <th>License</th>
              <th>Training</th>
              <th>Medical</th>
              <th>Last Review</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.driverId}>
                <td data-label="Driver">
                  <strong>{record.driverName}</strong>
                  <div className="mono muted">{record.driverId}</div>
                </td>
                <td data-label="Safety Score">
                  <SafetyBar score={record.safetyScore} />
                </td>
                <td data-label="License">
                  <StatusBadge status={record.licenseStatus} />
                </td>
                <td data-label="Training">
                  <StatusBadge status={record.trainingComplete ? 'completed' : 'pending'} />
                </td>
                <td data-label="Medical">
                  <StatusBadge status={record.medicalClearance ? 'active' : 'off_duty'} />
                </td>
                <td data-label="Last Review">{record.lastReview}</td>
                <td data-label="Status">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-cards">
        {filtered.map((record) => (
          <div key={record.driverId} className="data-card">
            <div className="data-card-header">
              <strong>{record.driverName}</strong>
              <StatusBadge status={record.status} />
            </div>
            <div className="data-card-body">
              <p>
                <span>Safety Score</span>
                <SafetyBar score={record.safetyScore} />
              </p>
              <p>
                <span>License</span>
                <StatusBadge status={record.licenseStatus} />
              </p>
              <p>
                <span>Training</span>
                <StatusBadge status={record.trainingComplete ? 'completed' : 'pending'} />
              </p>
              <p>
                <span>Medical</span>
                <StatusBadge status={record.medicalClearance ? 'active' : 'off_duty'} />
              </p>
              <p>
                <span>Last Review</span>
                {record.lastReview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
