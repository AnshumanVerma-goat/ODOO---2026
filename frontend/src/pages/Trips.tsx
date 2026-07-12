import { useEffect, useState } from 'react'
import { DriverTripsPanel } from '../components/DriverTripsPanel'
import { StatusBadge } from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripsContext'
import { getTrips } from '../services/tripService'
import type { Trip } from '../types'

export function Trips() {
  const { role } = useAuth()
  const { status: contextStatus, error: contextError } = useTrips()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (role === 'driver') return

    let cancelled = false

    async function loadTrips() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTrips()
        if (!cancelled) setTrips(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load trips')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
  }, [role])

  if (role === 'driver') {
    return (
      <div className="page">
        <h1 className="page-title">My Trips</h1>
        <p className="page-subtitle">
          View your assigned routes, start deliveries, complete trips, and report issues.
        </p>
        {contextStatus === 'loading' ? (
          <div className="empty-state">Loading trips...</div>
        ) : contextError ? (
          <div className="empty-state">{contextError}</div>
        ) : (
          <DriverTripsPanel showFilters title="All Assigned Trips" />
        )}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Trips</h1>
        <button className="btn btn--primary">+ Create Trip</button>
      </div>
      <p className="page-subtitle">
        Create trips, assign vehicles and drivers, monitor active deliveries.
      </p>

      {loading ? (
        <div className="empty-state">Loading trips...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <div key={trip.id} className={`trip-card trip-card--${trip.status}`}>
              <div className="trip-card-header">
                <span className="mono">{trip.id}</span>
                <StatusBadge status={trip.status} />
              </div>
              <h3>{trip.route}</h3>
              <div className="trip-details">
                <p>
                  <span>Driver</span> {trip.driver}
                </p>
                <p>
                  <span>Vehicle</span> {trip.vehicle}
                </p>
                <p>
                  <span>Start</span> {trip.startTime}
                </p>
                <p>
                  <span>ETA</span> {trip.eta}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
