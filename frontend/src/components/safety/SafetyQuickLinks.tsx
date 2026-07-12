import { Link } from 'react-router-dom'

interface QuickLink {
  to: string
  label: string
  icon: string
  description: string
}

const quickLinks: QuickLink[] = [
  {
    to: '/safety/compliance',
    label: 'Driver Compliance',
    icon: '✓',
    description: 'Review compliance status and training records',
  },
  {
    to: '/safety/incidents',
    label: 'Incident Reports',
    icon: '⚠',
    description: 'Investigate and resolve safety incidents',
  },
  {
    to: '/safety/licenses',
    label: 'License Tracking',
    icon: '🪪',
    description: 'Monitor license expiry and renewals',
  },
  {
    to: '/safety/analytics',
    label: 'Safety Analytics',
    icon: '📊',
    description: 'Fleet safety trends and score analysis',
  },
  {
    to: '/safety/notifications',
    label: 'Notifications',
    icon: '🔔',
    description: 'Alerts and compliance reminders',
  },
  {
    to: '/safety/reports',
    label: 'Reports',
    icon: '📄',
    description: 'Generate and download safety reports',
  },
]

export function SafetyQuickLinks() {
  return (
    <div className="safety-quick-links">
      {quickLinks.map((link) => (
        <Link key={link.to} to={link.to} className="safety-quick-link">
          <span className="safety-quick-link-icon">{link.icon}</span>
          <div>
            <strong>{link.label}</strong>
            <p>{link.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
