import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { ApiRequestError } from '../api/client'
import type { AsyncStatus } from '../hooks/useAsyncData'
import * as tripService from '../services/tripService'
import type { Trip, TripIssue, TripIssueCategory } from '../types'

interface ReportIssueInput {
  tripId: string
  driverId: string
  driverName: string
  category: TripIssueCategory
  description: string
}

interface TripsContextType {
  trips: Trip[]
  issues: TripIssue[]
  status: AsyncStatus
  error: string | null
  refetch: () => void
  startTrip: (tripId: string) => Promise<void>
  completeTrip: (tripId: string) => Promise<void>
  cancelTrip: (tripId: string) => Promise<void>
  reportIssue: (input: ReportIssueInput) => void
  getTripsForDriver: (driverId: string) => Trip[]
  getIssuesForDriver: (driverId: string) => TripIssue[]
}

const TripsContext = createContext<TripsContextType | null>(null)

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [issues, setIssues] = useState<TripIssue[]>([])
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false

    async function loadTrips() {
      setStatus('loading')
      setError(null)

      try {
        const data = await tripService.getTrips()
        if (!cancelled) {
          setTrips(data)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiRequestError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Failed to load trips'
          setError(message)
          setStatus('error')
        }
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
  }, [tick])

  const updateTripInState = (updated: Trip) => {
    setTrips((prev) => prev.map((trip) => (trip.id === updated.id ? updated : trip)))
  }

  const startTrip = async (tripId: string) => {
    const updated = await tripService.startTrip(tripId)
    updateTripInState(updated)
  }

  const completeTrip = async (tripId: string) => {
    const updated = await tripService.completeTrip(tripId)
    updateTripInState(updated)
  }

  const cancelTrip = async (tripId: string) => {
    const updated = await tripService.cancelTrip(tripId)
    updateTripInState(updated)
  }

  const reportIssue = (input: ReportIssueInput) => {
    const issue: TripIssue = {
      id: `I${Date.now()}`,
      tripId: input.tripId,
      driverId: input.driverId,
      driverName: input.driverName,
      category: input.category,
      description: input.description,
      reportedAt: new Date().toISOString(),
      status: 'open',
    }
    setIssues((prev) => [issue, ...prev])
  }

  const getTripsForDriver = (driverId: string) =>
    trips.filter((trip) => trip.driverId === driverId)

  const getIssuesForDriver = (driverId: string) =>
    issues.filter((issue) => issue.driverId === driverId)

  return (
    <TripsContext.Provider
      value={{
        trips,
        issues,
        status,
        error,
        refetch,
        startTrip,
        completeTrip,
        cancelTrip,
        reportIssue,
        getTripsForDriver,
        getIssuesForDriver,
      }}
    >
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  const context = useContext(TripsContext)
  if (!context) throw new Error('useTrips must be used within TripsProvider')
  return context
}
