import { apiClient } from './client'
import type { BackendListResponse } from './mappers'

/**
 * Fetch all items from a paginated list endpoint.
 */
export async function fetchAllPages<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const response = await apiClient.get<BackendListResponse<T>>(path, {
      params: { ...params, page, size: 100 },
    })
    items.push(...(response.data ?? []))
    totalPages = response.meta?.pages ?? 1
    page += 1
  }

  return items
}
