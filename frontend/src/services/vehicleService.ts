import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/config'
import {
  mapVehicleDto,
  toVehicleCreatePayload,
  toVehicleUpdatePayload,
  type BackendItemResponse,
  type VehicleDto,
} from '../api/mappers'
import { fetchAllPages } from '../api/pagination'
import type { CreateVehicleInput, UpdateVehicleInput } from '../api/types'
import type { Vehicle } from '../types'

/**
 * Fetch all fleet vehicles.
 * GET /vehicles
 */
export async function getVehicles(): Promise<Vehicle[]> {
  const dtos = await fetchAllPages<VehicleDto>(API_ENDPOINTS.vehicles)
  return dtos.map(mapVehicleDto)
}

/**
 * Fetch a single vehicle by ID.
 * GET /vehicles/:id
 */
export async function getVehicle(id: string): Promise<Vehicle> {
  const response = await apiClient.get<BackendItemResponse<VehicleDto>>(
    `${API_ENDPOINTS.vehicles}/${id}`,
  )
  return mapVehicleDto(response.data)
}

/**
 * Register a new vehicle.
 * POST /vehicles
 */
export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const response = await apiClient.post<BackendItemResponse<VehicleDto>>(
    API_ENDPOINTS.vehicles,
    toVehicleCreatePayload(input),
  )
  return mapVehicleDto(response.data)
}

/**
 * Update an existing vehicle.
 * PUT /vehicles/:id
 */
export async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  const response = await apiClient.put<BackendItemResponse<VehicleDto>>(
    `${API_ENDPOINTS.vehicles}/${id}`,
    toVehicleUpdatePayload(input),
  )
  return mapVehicleDto(response.data)
}

/**
 * Remove a vehicle from the fleet.
 * DELETE /vehicles/:id
 */
export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.vehicles}/${id}`)
}
