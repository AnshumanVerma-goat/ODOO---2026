import { API_ENDPOINTS } from '../api/config'
import type {
  CreateTripInput,
  ReportTripIssueInput,
  UpdateTripInput,
} from '../api/types'
import type { Trip, TripIssue } from '../types'
import { notImplemented } from '../api/placeholder'

/**
 * Fetch all trips.
 * TODO: GET /trips
 */
export function getTrips(): Promise<Trip[]> {
  void API_ENDPOINTS.trips
  return notImplemented('getTrips()')
}

/**
 * Fetch trips assigned to a specific driver.
 * TODO: GET /trips?driverId=:id
 */
export function getTripsForDriver(driverId: string): Promise<Trip[]> {
  void API_ENDPOINTS.trips
  void driverId
  return notImplemented('getTripsForDriver()')
}

/**
 * Fetch a single trip by ID.
 * TODO: GET /trips/:id
 */
export function getTrip(id: string): Promise<Trip> {
  void API_ENDPOINTS.trips
  void id
  return notImplemented('getTrip()')
}

/**
 * Create and schedule a new trip.
 * TODO: POST /trips
 */
export function createTrip(input: CreateTripInput): Promise<Trip> {
  void API_ENDPOINTS.trips
  void input
  return notImplemented('createTrip()')
}

/**
 * Update trip details or assignment.
 * TODO: PATCH /trips/:id
 */
export function updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
  void API_ENDPOINTS.trips
  void id
  void input
  return notImplemented('updateTrip()')
}

/**
 * Cancel or remove a trip.
 * TODO: DELETE /trips/:id
 */
export function deleteTrip(id: string): Promise<void> {
  void API_ENDPOINTS.trips
  void id
  return notImplemented('deleteTrip()')
}

/**
 * Mark a scheduled trip as active.
 * TODO: POST /trips/:id/start
 */
export function startTrip(id: string): Promise<Trip> {
  void API_ENDPOINTS.trips
  void id
  return notImplemented('startTrip()')
}

/**
 * Mark an active trip as completed.
 * TODO: POST /trips/:id/complete
 */
export function completeTrip(id: string): Promise<Trip> {
  void API_ENDPOINTS.trips
  void id
  return notImplemented('completeTrip()')
}

/**
 * Report an issue during a trip.
 * TODO: POST /trips/:id/issues
 */
export function reportTripIssue(input: ReportTripIssueInput): Promise<TripIssue> {
  void API_ENDPOINTS.trips
  void input
  return notImplemented('reportTripIssue()')
}

/**
 * Fetch issues reported for a driver.
 * TODO: GET /trips/issues?driverId=:id
 */
export function getTripIssuesForDriver(driverId: string): Promise<TripIssue[]> {
  void API_ENDPOINTS.trips
  void driverId
  return notImplemented('getTripIssuesForDriver()')
}
