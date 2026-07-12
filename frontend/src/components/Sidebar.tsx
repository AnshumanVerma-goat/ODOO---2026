import { NavLink } from 'react-router-dom'
import { getDashboardPath } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import { useSafety } from '../context/SafetyContext'
import type { NavItem, UserRole } from '../types'

const sharedNavItems: NavItem[] = [
  {
    path: '__dashboard__',
    label: 'Dashboard',
    roles: ['fleet_manager', 'driver', 'safety_officer', 'finance_analytics_manager'],
  },
  { path: '/fleet', label: 'Fleet', roles: ['fleet_manager'] },
  { path: '/drivers', label: 'Drivers', roles: ['fleet_manager'] },
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
    roles: ['finance_analytics_manager'],
  },
  {
    path: '/settings',
    label: 'Settings',
    roles: ['fleet_manager', 'driver', 'safety_officer', 'finance_analytics_manager'],
  },
]

const safetyNavItems: NavItem[] = [
  { path: '/safety-officer', label: 'Dashboard', roles: ['safety_officer'] },
  { path: '/safety/compliance', label: 'Driver Compliance', roles: ['safety_officer'] },
  { path: '/safety/incidents', label: 'Incident Reports', roles: ['safety_officer'] },
  { path: '/safety/licenses', label: 'License Tracking', roles: ['safety_officer'] },
  { path: '/safety/analytics', label: 'Safety Analytics', roles: ['safety_officer'] },
  { path: '/safety/notifications', label: 'Notifications', roles: ['safety_officer'] },
  { path: '/safety/reports', label: 'Reports', roles: ['safety_officer'] },
  { path: '/settings', label: 'Settings', roles: ['safety_officer'] },
]

function resolveNavPath(item: NavItem, role: UserRole): string {
  if (item.path === '__dashboard__') {
    return getDashboardPath(role)
  }
  return item.path
}

interface SidebarProps {
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const { role } = useAuth()
  const { unreadCount } = useSafety()

  if (!role) return null

  const navItems = role === 'safety_officer' ? safetyNavItems : sharedNavItems
  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">🚛</span>
        <span className="brand-text">TransportOps</span>
      </div>
      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const path = resolveNavPath(item, role)
          const showBadge = item.path === '/safety/notifications' && unreadCount > 0

          return (
            <NavLink
              key={item.path}
              to={path}
              end={item.path === '__dashboard__' || item.path === '/safety-officer'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onNavigate}
            >
              {item.label}
              {showBadge && <span className="nav-badge">{unreadCount}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
