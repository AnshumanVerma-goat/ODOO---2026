/**
 * Placeholder helper used until backend endpoints are connected.
 * Service functions delegate here so integration points stay consistent.
 */
export function notImplemented<T = never>(operation: string): Promise<T> {
  return Promise.reject(
    new Error(`TODO: ${operation} — backend integration pending`),
  )
}
