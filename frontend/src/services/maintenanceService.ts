import { API_ENDPOINTS } from '../api/config'
import type { CreateMaintenanceInput, UpdateMaintenanceInput } from '../api/types'
import type { MaintenanceRecord } from '../types'
import { notImplemented } from '../api/placeholder'

/**
 * Fetch all maintenance records.
 * TODO: GET /maintenance
 */
export function getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  void API_ENDPOINTS.maintenance
  return notImplemented('getMaintenanceRecords()')
}

/**
 * Fetch a single maintenance record.
 * TODO: GET /maintenance/:id
 */
export function getMaintenanceRecord(id: string): Promise<MaintenanceRecord> {
  void API_ENDPOINTS.maintenance
  void id
  return notImplemented('getMaintenanceRecord()')
}

/**
 * Schedule a new maintenance job.
 * TODO: POST /maintenance
 */
export function createMaintenanceRecord(
  input: CreateMaintenanceInput,
): Promise<MaintenanceRecord> {
  void API_ENDPOINTS.maintenance
  void input
  return notImplemented('createMaintenanceRecord()')
}

/**
 * Update maintenance status or details.
 * TODO: PATCH /maintenance/:id
 */
export function updateMaintenanceRecord(
  id: string,
  input: UpdateMaintenanceInput,
): Promise<MaintenanceRecord> {
  void API_ENDPOINTS.maintenance
  void id
  void input
  return notImplemented('updateMaintenanceRecord()')
}

/**
 * Remove a maintenance record.
 * TODO: DELETE /maintenance/:id
 */
export function deleteMaintenanceRecord(id: string): Promise<void> {
  void API_ENDPOINTS.maintenance
  void id
  return notImplemented('deleteMaintenanceRecord()')
}
