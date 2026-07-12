import { createContext, useContext, useState, type ReactNode } from 'react'
import { trips as initialTrips } from '../data/mockData'
import type { Trip, TripIssue, TripIssueCategory } from '../types'

interface TripsState {
  trips: Trip[]
  issues: TripIssue[]
}

interface ReportIssueInput {
  tripId: string
  driverId: string
  driverName: string
  category: TripIssueCategory
  description: string
}

interface TripsContextType extends TripsState {
  startTrip: (tripId: string) => void
  completeTrip: (tripId: string) => void
  reportIssue: (input: ReportIssueInput) => void
  getTripsForDriver: (driverId: string) => Trip[]
  getIssuesForDriver: (driverId: string) => TripIssue[]
}

const STORAGE_KEY = 'transportops_trips_state'

const TripsContext = createContext<TripsContextType | null>(null)

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function loadState(): TripsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as TripsState
  } catch {
    /* use defaults */
  }
  return { trips: initialTrips, issues: [] }
}

function persistState(state: TripsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function TripsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripsState>(loadState)

  const mutateState = (updater: (prev: TripsState) => TripsState) => {
    setState((prev) => {
      const next = updater(prev)
      persistState(next)
      return next
    })
  }

  const startTrip = (tripId: string) => {
    mutateState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId && t.status === 'scheduled'
          ? { ...t, status: 'active', startTime: formatTime(new Date()) }
          : t,
      ),
    }))
  }

  const completeTrip = (tripId: string) => {
    mutateState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId && t.status === 'active' ? { ...t, status: 'completed' } : t,
      ),
    }))
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
    mutateState((prev) => ({ ...prev, issues: [issue, ...prev.issues] }))
  }

  const getTripsForDriver = (driverId: string) =>
    state.trips.filter((t) => t.driverId === driverId)

  const getIssuesForDriver = (driverId: string) =>
    state.issues.filter((i) => i.driverId === driverId)

  return (
    <TripsContext.Provider
      value={{
        ...state,
        startTrip,
        completeTrip,
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
