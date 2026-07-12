import { DriverTripsPanel } from '../components/DriverTripsPanel'
import { StatusBadge } from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripsContext'

export function Trips() {
  const { role } = useAuth()
  const { trips } = useTrips()

  if (role === 'driver') {
    return (
      <div className="page">
        <h1 className="page-title">My Trips</h1>
        <p className="page-subtitle">
          View your assigned routes, start deliveries, complete trips, and report issues.
        </p>
        <DriverTripsPanel showFilters title="All Assigned Trips" />
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
    </div>
  )
}
