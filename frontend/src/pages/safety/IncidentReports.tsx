import { useMemo, useState } from 'react'
import { useSafety } from '../../context/SafetyContext'
import { useTrips } from '../../context/TripsContext'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { formatRelativeDate, severityColor } from '../../utils/safety'
import type { IncidentSeverity, IncidentStatus, SafetyIncident } from '../../types'

type StatusFilter = 'all' | IncidentStatus
type SeverityFilter = 'all' | IncidentSeverity

export function IncidentReports() {
  const { incidents, updateIncidentStatus } = useSafety()
  const { issues } = useTrips()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')

  const tripIncidents: SafetyIncident[] = useMemo(
    () =>
      issues.map((issue) => ({
        id: issue.id,
        title: `${issue.category} issue on trip`,
        driverId: issue.driverId,
        driverName: issue.driverName,
        tripId: issue.tripId,
        category: issue.category,
        severity: issue.category === 'safety' ? 'high' : 'medium',
        description: issue.description,
        reportedAt: issue.reportedAt,
        status: issue.status === 'open' ? 'open' : 'resolved',
      })),
    [issues],
  )

  const allIncidents = useMemo(
    () =>
      [...tripIncidents, ...incidents].sort(
        (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
      ),
    [tripIncidents, incidents],
  )

  const filtered = allIncidents.filter((incident) => {
    const statusMatch = statusFilter === 'all' || incident.status === statusFilter
    const severityMatch = severityFilter === 'all' || incident.severity === severityFilter
    return statusMatch && severityMatch
  })

  const openCount = allIncidents.filter((i) => i.status === 'open' || i.status === 'investigating').length

  return (
    <div className="page">
      <SafetyPageHeader
        title="Incident Reports"
        subtitle="Review, investigate, and resolve safety incidents across the fleet."
        action={
          <button type="button" className="btn btn--primary">
            + Log Incident
          </button>
        }
      />

      <div className="summary-bar safety-summary-bar">
        <span>
          <strong>{allIncidents.length}</strong> Total Incidents
        </span>
        <span>
          <strong>{openCount}</strong> Open / Investigating
        </span>
        <span>
          <strong>{allIncidents.filter((i) => i.severity === 'critical').length}</strong>{' '}
          Critical
        </span>
      </div>

      <div className="filter-row">
        <div className="filter-tabs">
          {(['all', 'open', 'investigating', 'resolved', 'closed'] as StatusFilter[]).map(
            (value) => (
              <button
                key={value}
                type="button"
                className={`filter-tab ${statusFilter === value ? 'filter-tab--active' : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {value === 'all' ? 'All Status' : value}
              </button>
            ),
          )}
        </div>
        <div className="filter-tabs">
          {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`filter-tab ${severityFilter === value ? 'filter-tab--active' : ''}`}
              onClick={() => setSeverityFilter(value)}
            >
              {value === 'all' ? 'All Severity' : value}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No incidents match the selected filters.</div>
      ) : (
        <div className="incident-list">
          {filtered.map((incident) => (
            <article key={incident.id} className={`incident-card incident-card--${incident.severity}`}>
              <div className="incident-card-header">
                <div>
                  <span className="mono">{incident.id}</span>
                  <h3>{incident.title}</h3>
                </div>
                <div className="incident-badges">
                  <span className={`badge badge--${severityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <StatusBadge status={incident.status} />
                </div>
              </div>

              <p className="incident-description">{incident.description}</p>

              <div className="incident-meta">
                <span>Driver: {incident.driverName}</span>
                {incident.tripId && <span>Trip: {incident.tripId}</span>}
                {incident.location && <span>Location: {incident.location}</span>}
                <span>Reported: {formatRelativeDate(incident.reportedAt)}</span>
              </div>

              {(incident.status === 'open' || incident.status === 'investigating') &&
                incidents.some((i) => i.id === incident.id) && (
                <div className="incident-actions">
                  {incident.status === 'open' && (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                    >
                      Start Investigation
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--success"
                    onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
