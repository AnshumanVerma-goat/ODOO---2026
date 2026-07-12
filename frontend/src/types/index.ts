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
}
