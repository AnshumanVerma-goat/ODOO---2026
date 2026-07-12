export type UserRole =
  | 'fleet_manager'
  | 'driver'
  | 'safety_officer'
  | 'finance_analytics_manager'

export interface Vehicle {
  id: string
  name: string
  plate: string
  status: 'active' | 'maintenance' | 'idle'
  mileage: number
  lastService: string
}

export interface Driver {
  id: string
  name: string
  license: string
  licenseExpiry: string
  safetyScore: number
  status: 'on_trip' | 'available' | 'off_duty'
  tripsCompleted: number
}

export interface Trip {
  id: string
  route: string
  driverId: string
  driver: string
  vehicle: string
  status: 'active' | 'scheduled' | 'completed'
  startTime: string
  eta: string
}

export type TripIssueCategory = 'vehicle' | 'route' | 'safety' | 'other'

export interface TripIssue {
  id: string
  tripId: string
  driverId: string
  driverName: string
  category: TripIssueCategory
  description: string
  reportedAt: string
  status: 'open' | 'resolved'
}

export interface MaintenanceRecord {
  id: string
  vehicle: string
  type: string
  scheduledDate: string
  status: 'pending' | 'in_progress' | 'completed'
  cost: number
}

export interface Expense {
  id: string
  category: 'fuel' | 'maintenance' | 'insurance' | 'other'
  vehicle: string
  amount: number
  date: string
  description: string
}

export interface NavItem {
  path: string
  label: string
  roles: UserRole[]
  icon?: string
}

// ─── Safety Officer portal ───────────────────────────────────────────────────

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed'
export type ComplianceStatus = 'compliant' | 'at_risk' | 'non_compliant'
export type LicenseStatus = 'valid' | 'expiring_soon' | 'expired'
export type NotificationType =
  | 'license_expiry'
  | 'low_score'
  | 'incident'
  | 'compliance'
  | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high'

export interface SafetyIncident {
  id: string
  title: string
  driverId: string
  driverName: string
  tripId?: string
  category: TripIssueCategory | 'accident' | 'violation'
  severity: IncidentSeverity
  description: string
  reportedAt: string
  status: IncidentStatus
  location?: string
}

export interface SafetyNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: NotificationPriority
  link?: string
}

export interface ComplianceRecord {
  driverId: string
  driverName: string
  safetyScore: number
  license: string
  licenseExpiry: string
  licenseStatus: LicenseStatus
  trainingComplete: boolean
  medicalClearance: boolean
  lastReview: string
  status: ComplianceStatus
}

export interface SafetyReportTemplate {
  id: string
  name: string
  description: string
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'on_demand'
  lastGenerated?: string
}
