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
  vehicleId?: string
  status: 'active' | 'scheduled' | 'completed' | 'cancelled'
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

// ─── Finance Manager portal ──────────────────────────────────────────────────

export type FinanceNotificationType =
  | 'budget_alert'
  | 'expense_spike'
  | 'maintenance_due'
  | 'revenue_milestone'
  | 'approval_required'
  | 'system'

export type FinanceReportFrequency = 'weekly' | 'monthly' | 'quarterly' | 'on_demand'
export type ReportFormat = 'pdf' | 'csv' | 'xlsx'
export type FinancePeriod = '7d' | '30d' | '90d' | 'ytd' | '12m'

export interface FinanceNotification {
  id: string
  type: FinanceNotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: NotificationPriority
  link?: string
  amount?: number
}

export interface FinanceReportTemplate {
  id: string
  name: string
  description: string
  frequency: FinanceReportFrequency
  formats: ReportFormat[]
  lastGenerated?: string
  category: 'revenue' | 'expense' | 'fuel' | 'maintenance' | 'summary'
}

export interface RevenueRecord {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export interface FuelRecord {
  id: string
  vehicle: string
  date: string
  liters: number
  costPerLiter: number
  amount: number
  route: string
  driver: string
}

export interface MaintenanceCostRecord {
  id: string
  vehicle: string
  type: string
  date: string
  cost: number
  status: 'pending' | 'in_progress' | 'completed'
  vendor: string
  description: string
}

export interface FinanceSettings {
  currency: 'INR' | 'USD' | 'EUR'
  fiscalYearStart: string
  budgetAlerts: boolean
  expenseThreshold: number
  fuelAlerts: boolean
  maintenanceAlerts: boolean
  weeklyDigest: boolean
  autoExport: boolean
  defaultReportFormat: ReportFormat
}

export interface FinanceKpi {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  icon?: string
}
