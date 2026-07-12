import { NavLink } from 'react-router-dom'
import { getDashboardPath } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import type { NavItem, UserRole } from '../types'

const navItems: NavItem[] = [
  {
    path: '__dashboard__',
    label: 'Dashboard',
    roles: ['fleet_manager', 'driver', 'safety_officer', 'finance_analytics_manager'],
  },
  { path: '/fleet', label: 'Fleet', roles: ['fleet_manager'] },
  { path: '/drivers', label: 'Drivers', roles: ['safety_officer', 'fleet_manager'] },
  { path: '/trips', label: 'Trips', roles: ['driver', 'fleet_manager'] },
  { path: '/maintenance', label: 'Maintenance', roles: ['fleet_manager'] },
  {
    path: '/fuel-expenses',
    label: 'Fuel & Expenses',
    roles: ['finance_analytics_manager', 'fleet_manager'],
  },
  {
    path: '/analytics',
    label: 'Analytics',
    roles: ['finance_analytics_manager', 'safety_officer'],
  },
  {
    path: '/settings',
    label: 'Settings',
    roles: ['fleet_manager', 'driver', 'safety_officer', 'finance_analytics_manager'],
  },
]

function resolveNavPath(item: NavItem, role: UserRole): string {
  if (item.path === '__dashboard__') {
    return getDashboardPath(role)
  }
  return item.path
}

export function Sidebar() {
  const { role } = useAuth()

  if (!role) return null

  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🚛</span>
        <span className="brand-text">TransportOps</span>
      </div>
      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const path = resolveNavPath(item, role)

          return (
            <NavLink
              key={item.path}
              to={path}
              end={item.path === '__dashboard__'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
