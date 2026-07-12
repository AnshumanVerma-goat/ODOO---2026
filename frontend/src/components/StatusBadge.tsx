interface StatusBadgeProps {
  status: string
}

const statusColors: Record<string, string> = {
  active: 'success',
  on_trip: 'success',
  available: 'info',
  scheduled: 'info',
  completed: 'muted',
  open: 'warning',
  resolved: 'success',
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
