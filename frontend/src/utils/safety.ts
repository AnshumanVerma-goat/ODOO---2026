import type { ComplianceStatus, ComplianceRecord, Driver, LicenseStatus } from '../types'

const EXPIRING_SOON_DAYS = 90
const REFERENCE_DATE = new Date('2026-07-12')

export function daysUntilExpiry(expiry: string, reference = REFERENCE_DATE): number {
  const expiryDate = new Date(expiry)
  return Math.ceil((expiryDate.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24))
}

export function getLicenseStatus(expiry: string, reference = REFERENCE_DATE): LicenseStatus {
  const days = daysUntilExpiry(expiry, reference)
  if (days < 0) return 'expired'
  if (days <= EXPIRING_SOON_DAYS) return 'expiring_soon'
  return 'valid'
}

export function getComplianceStatus(
  driver: Driver,
  options: { trainingComplete?: boolean; medicalClearance?: boolean } = {},
): ComplianceStatus {
  const licenseStatus = getLicenseStatus(driver.licenseExpiry)
  const trainingComplete = options.trainingComplete ?? driver.safetyScore >= 75
  const medicalClearance = options.medicalClearance ?? true

  if (
    licenseStatus === 'expired' ||
    driver.safetyScore < 70 ||
    !medicalClearance
  ) {
    return 'non_compliant'
  }

  if (
    licenseStatus === 'expiring_soon' ||
    driver.safetyScore < 80 ||
    !trainingComplete
  ) {
    return 'at_risk'
  }

  return 'compliant'
}

export function buildComplianceRecord(
  driver: Driver,
  options: {
    trainingComplete?: boolean
    medicalClearance?: boolean
    lastReview?: string
  } = {},
): ComplianceRecord {
  const licenseStatus = getLicenseStatus(driver.licenseExpiry)

  return {
    driverId: driver.id,
    driverName: driver.name,
    safetyScore: driver.safetyScore,
    license: driver.license,
    licenseExpiry: driver.licenseExpiry,
    licenseStatus,
    trainingComplete: options.trainingComplete ?? driver.safetyScore >= 75,
    medicalClearance: options.medicalClearance ?? driver.id !== 'D004',
    lastReview: options.lastReview ?? '2026-06-15',
    status: getComplianceStatus(driver, options),
  }
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diffMs = REFERENCE_DATE.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    default:
      return 'muted'
  }
}
