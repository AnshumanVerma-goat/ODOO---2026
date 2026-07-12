import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/config'
import {
  mapDriverDto,
  toDriverCreatePayload,
  toDriverUpdatePayload,
  type BackendItemResponse,
  type DriverDto,
} from '../api/mappers'
import { fetchAllPages } from '../api/pagination'
import type { CreateDriverInput, UpdateDriverInput } from '../api/types'
import type { Driver } from '../types'

/**
 * Fetch all drivers.
 * GET /drivers
 */
export async function getDrivers(): Promise<Driver[]> {
  const dtos = await fetchAllPages<DriverDto>(API_ENDPOINTS.drivers)
  return dtos.map((dto) => mapDriverDto(dto))
}

/**
 * Fetch a single driver by ID.
 * GET /drivers/:id
 */
export async function getDriver(id: string): Promise<Driver> {
  const response = await apiClient.get<BackendItemResponse<DriverDto>>(
    `${API_ENDPOINTS.drivers}/${id}`,
  )
  return mapDriverDto(response.data)
}

/**
 * Onboard a new driver.
 * POST /drivers
 */
export async function createDriver(input: CreateDriverInput): Promise<Driver> {
  const response = await apiClient.post<BackendItemResponse<DriverDto>>(
    API_ENDPOINTS.drivers,
    toDriverCreatePayload(input),
  )
  return mapDriverDto(response.data)
}

/**
 * Update driver profile or status.
 * PUT /drivers/:id
 */
export async function updateDriver(id: string, input: UpdateDriverInput): Promise<Driver> {
  const response = await apiClient.put<BackendItemResponse<DriverDto>>(
    `${API_ENDPOINTS.drivers}/${id}`,
    toDriverUpdatePayload(input),
  )
  return mapDriverDto(response.data)
}

/**
 * Remove a driver record.
 * DELETE /drivers/:id
 */
export async function deleteDriver(id: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.drivers}/${id}`)
}
