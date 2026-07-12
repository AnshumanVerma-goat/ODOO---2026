import type { Driver, Expense, MaintenanceRecord, Trip, UserRole, Vehicle } from '../types'
import { ROLE_CONFIG } from '../config/roles'

export const vehicles: Vehicle[] = [
  { id: 'V001', name: 'Truck Alpha', plate: 'MH-12-AB-4521', status: 'active', mileage: 45200, lastService: '2026-05-15' },
  { id: 'V002', name: 'Van Beta', plate: 'MH-14-CD-7832', status: 'maintenance', mileage: 32100, lastService: '2026-06-01' },
  { id: 'V003', name: 'Truck Gamma', plate: 'MH-12-EF-9012', status: 'active', mileage: 67800, lastService: '2026-04-20' },
  { id: 'V004', name: 'Van Delta', plate: 'MH-14-GH-3344', status: 'idle', mileage: 18900, lastService: '2026-06-10' },
  { id: 'V005', name: 'Truck Epsilon', plate: 'MH-12-IJ-5566', status: 'active', mileage: 89000, lastService: '2026-03-08' },
]

export const drivers: Driver[] = [
  { id: 'D001', name: 'Rajesh Kumar', license: 'DL-0420180012345', licenseExpiry: '2027-08-15', safetyScore: 92, status: 'on_trip', tripsCompleted: 156 },
  { id: 'D002', name: 'Amit Sharma', license: 'DL-0320190056789', licenseExpiry: '2026-09-20', safetyScore: 78, status: 'available', tripsCompleted: 98 },
  { id: 'D003', name: 'Suresh Patel', license: 'DL-0120200034567', licenseExpiry: '2028-01-10', safetyScore: 95, status: 'on_trip', tripsCompleted: 203 },
  { id: 'D004', name: 'Vikram Singh', license: 'DL-0220170098765', licenseExpiry: '2026-07-01', safetyScore: 65, status: 'off_duty', tripsCompleted: 67 },
  { id: 'D005', name: 'Anil Desai', license: 'DL-0520210024680', licenseExpiry: '2029-03-22', safetyScore: 88, status: 'available', tripsCompleted: 112 },
]

export const trips: Trip[] = [
  { id: 'T001', route: 'Mumbai → Pune', driverId: 'D001', driver: 'Rajesh Kumar', vehicle: 'Truck Alpha', status: 'active', startTime: '08:30', eta: '12:45' },
  { id: 'T002', route: 'Pune → Nashik', driverId: 'D003', driver: 'Suresh Patel', vehicle: 'Truck Gamma', status: 'active', startTime: '09:15', eta: '13:30' },
  { id: 'T003', route: 'Mumbai → Ahmedabad', driverId: 'D005', driver: 'Anil Desai', vehicle: 'Truck Epsilon', status: 'scheduled', startTime: '14:00', eta: '22:00' },
  { id: 'T004', route: 'Pune → Mumbai', driverId: 'D002', driver: 'Amit Sharma', vehicle: 'Van Delta', status: 'scheduled', startTime: '16:00', eta: '19:30' },
  { id: 'T005', route: 'Nashik → Mumbai', driverId: 'D001', driver: 'Rajesh Kumar', vehicle: 'Truck Alpha', status: 'completed', startTime: '06:00', eta: '10:15' },
  { id: 'T006', route: 'Mumbai → Goa', driverId: 'D001', driver: 'Rajesh Kumar', vehicle: 'Truck Alpha', status: 'scheduled', startTime: '18:00', eta: '02:30' },
]

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'M001', vehicle: 'Van Beta', type: 'Engine Overhaul', scheduledDate: '2026-07-10', status: 'in_progress', cost: 45000 },
  { id: 'M002', vehicle: 'Truck Alpha', type: 'Tire Replacement', scheduledDate: '2026-07-20', status: 'pending', cost: 12000 },
  { id: 'M003', vehicle: 'Truck Gamma', type: 'Oil Change', scheduledDate: '2026-07-05', status: 'completed', cost: 3500 },
  { id: 'M004', vehicle: 'Truck Epsilon', type: 'Brake Inspection', scheduledDate: '2026-07-25', status: 'pending', cost: 8000 },
  { id: 'M005', vehicle: 'Van Delta', type: 'AC Service', scheduledDate: '2026-06-28', status: 'completed', cost: 2500 },
]

export const expenses: Expense[] = [
  { id: 'E001', category: 'fuel', vehicle: 'Truck Alpha', amount: 8500, date: '2026-07-11', description: 'Mumbai-Pune route fill-up' },
  { id: 'E002', category: 'fuel', vehicle: 'Truck Gamma', amount: 7200, date: '2026-07-11', description: 'Pune-Nashik route fill-up' },
  { id: 'E003', category: 'maintenance', vehicle: 'Van Beta', amount: 45000, date: '2026-07-10', description: 'Engine overhaul' },
  { id: 'E004', category: 'insurance', vehicle: 'Truck Epsilon', amount: 28000, date: '2026-07-01', description: 'Annual insurance renewal' },
  { id: 'E005', category: 'fuel', vehicle: 'Truck Epsilon', amount: 9100, date: '2026-07-09', description: 'Long haul fuel' },
  { id: 'E006', category: 'other', vehicle: 'Van Delta', amount: 1500, date: '2026-07-08', description: 'Toll charges' },
]

/** Simulated user database — role is resolved from credentials, not user selection. */
export const demoUsers = [
  {
    email: 'admin@transportops.com',
    password: 'admin123',
    name: 'Arjun Mehta',
    role: 'fleet_manager' as UserRole,
  },
  {
    email: 'driver@transportops.com',
    password: 'demo123',
    name: 'Rajesh Kumar',
    role: 'driver' as UserRole,
    driverId: 'D001',
  },
  {
    email: 'safety@transportops.com',
    password: 'demo123',
    name: 'Priya Nair',
    role: 'safety_officer' as UserRole,
  },
  {
    email: 'finance@transportops.com',
    password: 'demo123',
    name: 'Karan Joshi',
    role: 'finance_analytics_manager' as UserRole,
  },
]

export const roleLabels = Object.fromEntries(
  (Object.entries(ROLE_CONFIG) as [UserRole, (typeof ROLE_CONFIG)[UserRole]][]).map(
    ([role, config]) => [role, config.label],
  ),
) as Record<UserRole, string>

export const roleDescriptions = Object.fromEntries(
  (Object.entries(ROLE_CONFIG) as [UserRole, (typeof ROLE_CONFIG)[UserRole]][]).map(
    ([role, config]) => [role, config.description],
  ),
) as Record<UserRole, string>
