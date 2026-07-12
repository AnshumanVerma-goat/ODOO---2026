import { useMemo, useState } from 'react'
import { drivers } from '../../data/mockData'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { daysUntilExpiry, getLicenseStatus } from '../../utils/safety'
import type { LicenseStatus } from '../../types'

type Filter = 'all' | LicenseStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Licenses' },
  { value: 'valid', label: 'Valid' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
]

export function LicenseTracking() {
  const [filter, setFilter] = useState<Filter>('all')

  const licenseRecords = useMemo(
    () =>
      [...drivers]
        .map((driver) => ({
          ...driver,
          licenseStatus: getLicenseStatus(driver.licenseExpiry),
          daysLeft: daysUntilExpiry(driver.licenseExpiry),
        }))
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [],
  )

  const filtered =
    filter === 'all'
      ? licenseRecords
      : licenseRecords.filter((record) => record.licenseStatus === filter)

  const expiringSoon = licenseRecords.filter((r) => r.licenseStatus === 'expiring_soon').length
  const expired = licenseRecords.filter((r) => r.licenseStatus === 'expired').length

  return (
    <div className="page">
      <SafetyPageHeader
        title="License Tracking"
        subtitle="Track driver license validity, renewal deadlines, and regulatory compliance."
        action={
          <button type="button" className="btn btn--primary">
            Export License Audit
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card stat-card--success">
          <span className="stat-label">Valid Licenses</span>
          <span className="stat-value">
            {licenseRecords.filter((r) => r.licenseStatus === 'valid').length}
          </span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-label">Expiring Soon</span>
          <span className="stat-value">{expiringSoon}</span>
        </div>
        <div className="stat-card stat-card--danger">
          <span className="stat-label">Expired</span>
          <span className="stat-value">{expired}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Drivers</span>
          <span className="stat-value">{licenseRecords.length}</span>
        </div>
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

      <div className="license-timeline">
        {filtered.map((record) => {
          const urgency =
            record.daysLeft < 0 ? 100 : record.daysLeft <= 30 ? 85 : record.daysLeft <= 90 ? 55 : 25

          return (
            <div key={record.id} className={`license-card license-card--${record.licenseStatus}`}>
              <div className="license-card-header">
                <div>
                  <strong>{record.name}</strong>
                  <p className="mono muted">{record.license}</p>
                </div>
                <StatusBadge status={record.licenseStatus} />
              </div>

              <div className="license-card-details">
                <div>
                  <span className="label">Expiry Date</span>
                  <span className={record.daysLeft < 90 ? 'text-danger' : ''}>
                    {record.licenseExpiry}
                  </span>
                </div>
                <div>
                  <span className="label">Days Remaining</span>
                  <span className={record.daysLeft < 0 ? 'text-danger' : ''}>
                    {record.daysLeft < 0 ? `${Math.abs(record.daysLeft)} days overdue` : `${record.daysLeft} days`}
                  </span>
                </div>
                <div>
                  <span className="label">Driver Status</span>
                  <StatusBadge status={record.status} />
                </div>
              </div>

              <div className="license-progress">
                <div
                  className={`license-progress-fill license-progress-fill--${record.licenseStatus}`}
                  style={{ width: `${urgency}%` }}
                />
              </div>

              {record.licenseStatus !== 'valid' && (
                <button type="button" className="btn btn--ghost btn--sm">
                  Send Renewal Reminder
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
