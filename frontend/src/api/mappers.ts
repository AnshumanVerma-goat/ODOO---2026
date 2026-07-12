import type { CreateDriverInput, CreateTripInput, CreateVehicleInput, UpdateDriverInput, UpdateTripInput, UpdateVehicleInput } from './types'
import type { Driver, Trip, Vehicle } from '../types'

// ─── Backend DTOs ────────────────────────────────────────────────────────────

export interface VehicleDto {
  id: number
  registration_number: string
  vehicle_name: string
  vehicle_type: string
  maximum_load_capacity: number
  odometer: number
  acquisition_cost: number
  current_status: string
}

export interface DriverDto {
  id: number
  full_name: string
  license_number: string
  license_category: string
  license_expiry: string
  contact_number: string
  safety_score: number
  current_status: string
}

export interface TripDto {
  id: number
  source: string
  destination: string
  vehicle_id: number | null
  driver_id: number | null
  cargo_weight: number
  planned_distance: number
  actual_distance: number | null
  revenue: number
  fuel_used: number | null
  trip_status: string
  dispatch_time: string | null
  completion_time: string | null
}

export interface BackendListResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta?: {
    page: number
    size: number
    total: number
    pages: number
  }
}

export interface BackendItemResponse<T> {
  success: boolean
  message: string
  data: T
}

// ─── Status maps ─────────────────────────────────────────────────────────────

const VEHICLE_STATUS_TO_FRONTEND: Record<string, Vehicle['status']> = {
  Available: 'active',
  'On Trip': 'active',
  'In Shop': 'maintenance',
  Retired: 'idle',
}

const VEHICLE_STATUS_TO_BACKEND: Record<Vehicle['status'], string> = {
  active: 'Available',
  maintenance: 'In Shop',
  idle: 'Retired',
}

const DRIVER_STATUS_TO_FRONTEND: Record<string, Driver['status']> = {
  Available: 'available',
  'On Trip': 'on_trip',
  'Off Duty': 'off_duty',
  Suspended: 'off_duty',
}

const DRIVER_STATUS_TO_BACKEND: Record<Driver['status'], string> = {
  available: 'Available',
  on_trip: 'On Trip',
  off_duty: 'Off Duty',
}

const TRIP_STATUS_TO_FRONTEND: Record<string, Trip['status']> = {
  Draft: 'scheduled',
  Dispatched: 'active',
  Completed: 'completed',
  Cancelled: 'cancelled',
}

const TRIP_STATUS_TO_BACKEND: Record<Trip['status'], string> = {
  scheduled: 'Draft',
  active: 'Dispatched',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function parseRoute(route: string): { source: string; destination: string } {
  const parts = route.split('→').map((part) => part.trim())
  if (parts.length >= 2) {
    return { source: parts[0], destination: parts.slice(1).join(' → ') }
  }
  return { source: route.trim() || 'Unknown', destination: 'Unknown' }
}

// ─── DTO → domain mappers ────────────────────────────────────────────────────

export function mapVehicleDto(dto: VehicleDto): Vehicle {
  return {
    id: String(dto.id),
    name: dto.vehicle_name,
    plate: dto.registration_number,
    status: VEHICLE_STATUS_TO_FRONTEND[dto.current_status] ?? 'idle',
    mileage: dto.odometer,
    lastService: '—',
  }
}

export function mapDriverDto(dto: DriverDto, tripsCompleted = 0): Driver {
  return {
    id: String(dto.id),
    name: dto.full_name,
    license: dto.license_number,
    licenseExpiry: formatDate(dto.license_expiry),
    safetyScore: Math.round(dto.safety_score),
    status: DRIVER_STATUS_TO_FRONTEND[dto.current_status] ?? 'off_duty',
    tripsCompleted,
  }
}

export function mapTripDto(
  dto: TripDto,
  driverNames: Map<string, string> = new Map(),
  vehicleNames: Map<string, string> = new Map(),
): Trip {
  const driverId = dto.driver_id != null ? String(dto.driver_id) : ''
  const vehicleId = dto.vehicle_id != null ? String(dto.vehicle_id) : undefined

  return {
    id: String(dto.id),
    route: `${dto.source} → ${dto.destination}`,
    driverId,
    driver: driverId ? (driverNames.get(driverId) ?? 'Unassigned') : 'Unassigned',
    vehicle: vehicleId ? (vehicleNames.get(vehicleId) ?? 'Unassigned') : 'Unassigned',
    vehicleId,
    status: TRIP_STATUS_TO_FRONTEND[dto.trip_status] ?? 'scheduled',
    startTime: formatTime(dto.dispatch_time),
    eta: formatTime(dto.completion_time),
  }
}

// ─── Domain → backend payload mappers ────────────────────────────────────────

export function toVehicleCreatePayload(input: CreateVehicleInput) {
  return {
    registration_number: input.plate,
    vehicle_name: input.name,
    vehicle_type: 'Truck',
    maximum_load_capacity: 10000,
    odometer: input.mileage,
    acquisition_cost: 0,
    current_status: VEHICLE_STATUS_TO_BACKEND[input.status],
  }
}

export function toVehicleUpdatePayload(input: UpdateVehicleInput) {
  return {
    ...(input.name !== undefined && { vehicle_name: input.name }),
    ...(input.plate !== undefined && { registration_number: input.plate }),
    ...(input.mileage !== undefined && { odometer: input.mileage }),
    ...(input.status !== undefined && {
      current_status: VEHICLE_STATUS_TO_BACKEND[input.status],
    }),
  }
}

export function toDriverCreatePayload(input: CreateDriverInput) {
  return {
    full_name: input.name,
    license_number: input.license,
    license_category: 'HMV',
    license_expiry: input.licenseExpiry,
    contact_number: '0000000000',
    safety_score: input.safetyScore,
    current_status: DRIVER_STATUS_TO_BACKEND[input.status],
  }
}

export function toDriverUpdatePayload(input: UpdateDriverInput) {
  return {
    ...(input.name !== undefined && { full_name: input.name }),
    ...(input.license !== undefined && { license_number: input.license }),
    ...(input.licenseExpiry !== undefined && { license_expiry: input.licenseExpiry }),
    ...(input.safetyScore !== undefined && { safety_score: input.safetyScore }),
    ...(input.status !== undefined && {
      current_status: DRIVER_STATUS_TO_BACKEND[input.status],
    }),
  }
}

export function toTripCreatePayload(input: CreateTripInput) {
  const { source, destination } = parseRoute(input.route)
  return {
    source,
    destination,
    cargo_weight: 1000,
    planned_distance: 100,
    revenue: 0,
    trip_status: 'Draft',
    ...(input.vehicleId && { vehicle_id: Number(input.vehicleId) }),
    ...(input.driverId && { driver_id: Number(input.driverId) }),
  }
}

export function toTripUpdatePayload(input: UpdateTripInput) {
  const routeParts = input.route ? parseRoute(input.route) : null
  return {
    ...(routeParts && { source: routeParts.source, destination: routeParts.destination }),
    ...(input.driverId !== undefined && { driver_id: Number(input.driverId) }),
    ...(input.status !== undefined && { trip_status: TRIP_STATUS_TO_BACKEND[input.status] }),
  }
}

export function toBackendStatusFilter(
  entity: 'vehicle' | 'driver' | 'trip',
  status: string,
): string | undefined {
  if (status === 'all') return undefined

  if (entity === 'vehicle') {
    return VEHICLE_STATUS_TO_BACKEND[status as Vehicle['status']]
  }
  if (entity === 'driver') {
    return DRIVER_STATUS_TO_BACKEND[status as Driver['status']]
  }
  return TRIP_STATUS_TO_BACKEND[status as Trip['status']]
}
