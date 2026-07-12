import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripsContext'
import type { Trip } from '../types'
import { ReportIssueModal } from './ReportIssueModal'
import { StatusBadge } from './StatusBadge'

type TripFilter = 'all' | 'scheduled' | 'active' | 'completed'

const FILTERS: { value: TripFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

interface DriverTripsPanelProps {
  showFilters?: boolean
  title?: string
}

export function DriverTripsPanel({ showFilters = true, title = 'My Trips' }: DriverTripsPanelProps) {
  const { user } = useAuth()
  const { getTripsForDriver, startTrip, completeTrip, reportIssue } = useTrips()
  const [filter, setFilter] = useState<TripFilter>('all')
  const [issueTrip, setIssueTrip] = useState<Trip | null>(null)

  const driverId = user?.driverId
  if (!driverId) {
    return <p className="muted">No driver profile linked to this account.</p>
  }

  const myTrips = getTripsForDriver(driverId)
  const filtered =
    filter === 'all' ? myTrips : myTrips.filter((trip) => trip.status === filter)

  const handleReportIssue = (category: Parameters<typeof reportIssue>[0]['category'], description: string) => {
    if (!issueTrip || !user) return
    reportIssue({
      tripId: issueTrip.id,
      driverId,
      driverName: user.name,
      category,
      description,
    })
    setIssueTrip(null)
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        {showFilters && (
          <div className="filter-tabs">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`filter-tab ${filter === item.value ? 'filter-tab--active' : ''}`}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
                <span className="filter-tab-count">
                  {item.value === 'all'
                    ? myTrips.length
                    : myTrips.filter((trip) => trip.status === item.value).length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No {filter === 'all' ? '' : `${filter} `}trips assigned to you.</p>
        </div>
      ) : (
        <div className="trip-grid">
          {filtered.map((trip) => (
            <div key={trip.id} className={`trip-card trip-card--${trip.status}`}>
              <div className="trip-card-header">
                <span className="mono">{trip.id}</span>
                <StatusBadge status={trip.status} />
              </div>
              <h3>{trip.route}</h3>
              <div className="trip-details">
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
              <div className="trip-actions">
                {trip.status === 'scheduled' && (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => startTrip(trip.id)}
                  >
                    Start Trip
                  </button>
                )}
                {trip.status === 'active' && (
                  <button
                    type="button"
                    className="btn btn--success"
                    onClick={() => completeTrip(trip.id)}
                  >
                    Complete Trip
                  </button>
                )}
                {trip.status !== 'completed' && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setIssueTrip(trip)}
                  >
                    Report Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {issueTrip && (
        <ReportIssueModal
          tripId={issueTrip.id}
          route={issueTrip.route}
          onSubmit={handleReportIssue}
          onClose={() => setIssueTrip(null)}
        />
      )}
    </section>
  )
}
