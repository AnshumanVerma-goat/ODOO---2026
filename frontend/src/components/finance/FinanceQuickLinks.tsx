import { Link } from 'react-router-dom'

interface QuickLink {
  to: string
  label: string
  icon: string
  description: string
}

const quickLinks: QuickLink[] = [
  {
    to: '/finance/revenue-expense',
    label: 'Revenue & Expenses',
    icon: '💰',
    description: 'Track income, costs, and profit margins',
  },
  {
    to: '/finance/fuel',
    label: 'Fuel Costs',
    icon: '⛽',
    description: 'Monitor fuel consumption and spending',
  },
  {
    to: '/finance/maintenance',
    label: 'Maintenance',
    icon: '🔧',
    description: 'Track maintenance costs and schedules',
  },
  {
    to: '/finance/analytics',
    label: 'Analytics',
    icon: '📊',
    description: 'Financial trends and fleet profitability',
  },
  {
    to: '/finance/notifications',
    label: 'Notifications',
    icon: '🔔',
    description: 'Budget alerts and expense notifications',
  },
  {
    to: '/finance/reports',
    label: 'Reports',
    icon: '📄',
    description: 'Generate and export financial reports',
  },
]

export function FinanceQuickLinks() {
  return (
    <div className="finance-quick-links">
      {quickLinks.map((link) => (
        <Link key={link.to} to={link.to} className="finance-quick-link">
          <span className="finance-quick-link-icon">{link.icon}</span>
          <div>
            <strong>{link.label}</strong>
            <p>{link.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
