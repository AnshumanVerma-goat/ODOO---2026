interface StatusBadgeProps {
  status: string
}

const statusColors: Record<string, string> = {
  active: 'success',
  on_trip: 'success',
  available: 'info',
  scheduled: 'info',
  completed: 'muted',
  cancelled: 'danger',
  open: 'warning',
  resolved: 'success',
  investigating: 'info',
  closed: 'muted',
  valid: 'success',
  expiring_soon: 'warning',
  expired: 'danger',
  compliant: 'success',
  at_risk: 'warning',
  non_compliant: 'danger',
  maintenance: 'warning',
  in_progress: 'warning',
  pending: 'warning',
  idle: 'muted',
  off_duty: 'muted',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] ?? 'default'
  const label = status.replace(/_/g, ' ')

  return <span className={`badge badge--${color}`}>{label}</span>
}
