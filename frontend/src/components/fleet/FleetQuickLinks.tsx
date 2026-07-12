import { Link } from 'react-router-dom'

interface QuickLink {
  to: string
  label: string
  icon: string
  description: string
}

const quickLinks: QuickLink[] = [
  {
    to: '/fleet',
    label: 'Fleet Vehicles',
    icon: '🚛',
    description: 'View and manage all fleet assets',
  },
  {
    to: '/drivers',
    label: 'Drivers',
    icon: '👤',
    description: 'Driver roster, status, and assignments',
  },
  {
    to: '/trips',
    label: 'Trips',
    icon: '🗺️',
    description: 'Monitor active and scheduled routes',
  },
  {
    to: '/maintenance',
    label: 'Maintenance',
    icon: '🔧',
    description: 'Service schedules and work orders',
  },
  {
    to: '/fuel-expenses',
    label: 'Fuel & Expenses',
    icon: '⛽',
    description: 'Track fuel usage and operating costs',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Fleet preferences and notifications',
  },
]

export function FleetQuickLinks() {
  return (
    <div className="fleet-quick-links">
      {quickLinks.map((link) => (
        <Link key={link.to} to={link.to} className="fleet-quick-link">
          <span className="fleet-quick-link-icon">{link.icon}</span>
          <div>
            <strong>{link.label}</strong>
            <p>{link.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
