import { apiClient, ApiRequestError } from '../api/client'
import { API_ENDPOINTS } from '../api/config'
import {
  mapTripDto,
  toTripCreatePayload,
  toTripUpdatePayload,
  type BackendItemResponse,
  type TripDto,
} from '../api/mappers'
import { fetchAllPages } from '../api/pagination'
import type {
  CreateTripInput,
  ReportTripIssueInput,
  UpdateTripInput,
} from '../api/types'
import { notImplemented } from '../api/placeholder'
import { getDrivers } from './driverService'
import { getVehicles } from './vehicleService'
import type { Trip, TripIssue } from '../types'

async function buildTripLookups() {
  const [drivers, vehicles] = await Promise.all([getDrivers(), getVehicles()])
  return {
    driverNames: new Map(drivers.map((driver) => [driver.id, driver.name])),
    vehicleNames: new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.name])),
  }
}

async function enrichTrips(dtos: TripDto[]): Promise<Trip[]> {
  const { driverNames, vehicleNames } = await buildTripLookups()
  return dtos.map((dto) => mapTripDto(dto, driverNames, vehicleNames))
}

async function enrichTrip(dto: TripDto): Promise<Trip> {
  const [trips] = await enrichTrips([dto])
  return trips
}

/**
 * Fetch all trips.
 * GET /trips
 */
export async function getTrips(): Promise<Trip[]> {
  const dtos = await fetchAllPages<TripDto>(API_ENDPOINTS.trips)
  return enrichTrips(dtos)
}

/**
 * Fetch trips assigned to a specific driver.
 * GET /trips (filtered client-side)
 */
export async function getTripsForDriver(driverId: string): Promise<Trip[]> {
  const trips = await getTrips()
  return trips.filter((trip) => trip.driverId === driverId)
}

/**
 * Fetch a single trip by ID.
 * GET /trips/:id
 */
export async function getTrip(id: string): Promise<Trip> {
  const response = await apiClient.get<BackendItemResponse<TripDto>>(
    `${API_ENDPOINTS.trips}/${id}`,
  )
  return enrichTrip(response.data)
}

/**
 * Create and schedule a new trip.
 * POST /trips
 */
export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const response = await apiClient.post<BackendItemResponse<TripDto>>(
    API_ENDPOINTS.trips,
    toTripCreatePayload(input),
  )
  return enrichTrip(response.data)
}

/**
 * Update trip details or assignment.
 * PUT /trips/:id
 */
export async function updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
  const response = await apiClient.put<BackendItemResponse<TripDto>>(
    `${API_ENDPOINTS.trips}/${id}`,
    toTripUpdatePayload(input),
  )
  return enrichTrip(response.data)
}

/**
 * Cancel or remove a trip.
 * DELETE /trips/:id
 */
export async function deleteTrip(id: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.trips}/${id}`)
}

export interface DispatchTripInput {
  vehicleId: string
  driverId: string
}

/**
 * Dispatch a draft trip with vehicle and driver assignment.
 * POST /trips/:id/dispatch
 */
export async function dispatchTrip(id: string, input: DispatchTripInput): Promise<Trip> {
  const response = await apiClient.post<BackendItemResponse<TripDto>>(
    API_ENDPOINTS.tripActions.dispatch(id),
    {
      vehicle_id: Number(input.vehicleId),
      driver_id: Number(input.driverId),
    },
  )
  return enrichTrip(response.data)
}

/**
 * Mark a dispatched trip as completed.
 * POST /trips/:id/complete
 */
export async function completeTrip(
  id: string,
  data?: { actualDistance?: number; fuelUsed?: number },
): Promise<Trip> {
  const response = await apiClient.post<BackendItemResponse<TripDto>>(
    API_ENDPOINTS.tripActions.complete(id),
    {
      actual_distance: data?.actualDistance,
      fuel_used: data?.fuelUsed,
    },
  )
  return enrichTrip(response.data)
}

/**
 * Cancel a trip.
 * POST /trips/:id/cancel
 */
export async function cancelTrip(id: string): Promise<Trip> {
  const response = await apiClient.post<BackendItemResponse<TripDto>>(
    API_ENDPOINTS.tripActions.cancel(id),
  )
  return enrichTrip(response.data)
}

/**
 * Mark a scheduled trip as active (dispatches using assigned vehicle/driver).
 * POST /trips/:id/dispatch
 */
export async function startTrip(id: string): Promise<Trip> {
  const trip = await getTrip(id)
  if (!trip.vehicleId || !trip.driverId) {
    throw new ApiRequestError(
      'Trip must have a vehicle and driver assigned before dispatch.',
      400,
      'validation',
    )
  }
  return dispatchTrip(id, { vehicleId: trip.vehicleId, driverId: trip.driverId })
}

/**
 * Report an issue during a trip.
 * No backend endpoint — kept as local-only stub.
 */
export function reportTripIssue(input: ReportTripIssueInput): Promise<TripIssue> {
  void input
  return notImplemented('reportTripIssue()')
}

/**
 * Fetch issues reported for a driver.
 * No backend endpoint — kept as local-only stub.
 */
export function getTripIssuesForDriver(driverId: string): Promise<TripIssue[]> {
  void driverId
  return notImplemented('getTripIssuesForDriver()')
}
