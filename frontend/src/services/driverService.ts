import { API_ENDPOINTS } from '../api/config'
import type { CreateDriverInput, UpdateDriverInput } from '../api/types'
import type { Driver } from '../types'
import { notImplemented } from '../api/placeholder'

/**
 * Fetch all drivers.
 * TODO: GET /drivers
 */
export function getDrivers(): Promise<Driver[]> {
  void API_ENDPOINTS.drivers
  return notImplemented('getDrivers()')
}

/**
 * Fetch a single driver by ID.
 * TODO: GET /drivers/:id
 */
export function getDriver(id: string): Promise<Driver> {
  void API_ENDPOINTS.drivers
  void id
  return notImplemented('getDriver()')
}

/**
 * Onboard a new driver.
 * TODO: POST /drivers
 */
export function createDriver(input: CreateDriverInput): Promise<Driver> {
  void API_ENDPOINTS.drivers
  void input
  return notImplemented('createDriver()')
}

/**
 * Update driver profile or status.
 * TODO: PATCH /drivers/:id
 */
export function updateDriver(id: string, input: UpdateDriverInput): Promise<Driver> {
  void API_ENDPOINTS.drivers
  void id
  void input
  return notImplemented('updateDriver()')
}

/**
 * Remove a driver record.
 * TODO: DELETE /drivers/:id
 */
export function deleteDriver(id: string): Promise<void> {
  void API_ENDPOINTS.drivers
  void id
  return notImplemented('deleteDriver()')
}
