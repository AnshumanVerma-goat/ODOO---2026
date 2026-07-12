import type {
  Driver,
  Expense,
  MaintenanceRecord,
  Trip,
  TripIssue,
  TripIssueCategory,
  UserRole,
  Vehicle,
} from '../types'

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUserDto {
  name: string
  email: string
  role: UserRole
  driverId?: string
}

export interface LoginResponse {
  user: AuthUserDto
  token: string
}

// ─── Vehicles ──────────────────────────────────────────────────────────────

export interface CreateVehicleInput {
  name: string
  plate: string
  status: Vehicle['status']
  mileage: number
  lastService: string
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>

// ─── Drivers ───────────────────────────────────────────────────────────────

export interface CreateDriverInput {
  name: string
  license: string
  licenseExpiry: string
  safetyScore: number
  status: Driver['status']
}

export type UpdateDriverInput = Partial<CreateDriverInput>

// ─── Trips ─────────────────────────────────────────────────────────────────

export interface CreateTripInput {
  route: string
  driverId: string
  vehicleId: string
  startTime: string
  eta: string
}

export type UpdateTripInput = Partial<
  Pick<Trip, 'route' | 'driverId' | 'vehicle' | 'status' | 'startTime' | 'eta'>
>

export interface ReportTripIssueInput {
  tripId: string
  driverId: string
  category: TripIssueCategory
  description: string
}

// ─── Maintenance ─────────────────────────────────────────────────────────────

export interface CreateMaintenanceInput {
  vehicle: string
  type: string
  scheduledDate: string
  status: MaintenanceRecord['status']
  cost: number
}

export type UpdateMaintenanceInput = Partial<CreateMaintenanceInput>

// ─── Expenses ──────────────────────────────────────────────────────────────

export interface CreateExpenseInput {
  category: Expense['category']
  vehicle: string
  amount: number
  date: string
  description: string
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>

// ─── Generic API envelope (for future backend responses) ─────────────────────

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export type VehicleList = Vehicle[]
export type DriverList = Driver[]
export type TripList = Trip[]
export type MaintenanceList = MaintenanceRecord[]
export type ExpenseList = Expense[]
export type TripIssueList = TripIssue[]
