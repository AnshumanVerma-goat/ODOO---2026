import { API_ENDPOINTS } from '../api/config'
import type { CreateVehicleInput, UpdateVehicleInput } from '../api/types'
import type { Vehicle } from '../types'
import { notImplemented } from '../api/placeholder'

/**
 * Fetch all fleet vehicles.
 * TODO: GET /vehicles
 */
export function getVehicles(): Promise<Vehicle[]> {
  void API_ENDPOINTS.vehicles
  return notImplemented('getVehicles()')
}

/**
 * Fetch a single vehicle by ID.
 * TODO: GET /vehicles/:id
 */
export function getVehicle(id: string): Promise<Vehicle> {
  void API_ENDPOINTS.vehicles
  void id
  return notImplemented('getVehicle()')
}

/**
 * Register a new vehicle.
 * TODO: POST /vehicles
 */
export function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  void API_ENDPOINTS.vehicles
  void input
  return notImplemented('createVehicle()')
}

/**
 * Update an existing vehicle.
 * TODO: PATCH /vehicles/:id
 */
export function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  void API_ENDPOINTS.vehicles
  void id
  void input
  return notImplemented('updateVehicle()')
}

/**
 * Remove a vehicle from the fleet.
 * TODO: DELETE /vehicles/:id
 */
export function deleteVehicle(id: string): Promise<void> {
  void API_ENDPOINTS.vehicles
  void id
  return notImplemented('deleteVehicle()')
}
