import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { getRoleDescription, getRoleLabel } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import { useSafety } from '../context/SafetyContext'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { user, role, logout } = useAuth()
  const { unreadCount } = useSafety()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileNavOpen} onNavigate={closeMobileNav} />
      {mobileNavOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeMobileNav}
        />
      )}
      <div className="main-area">
        <header className="top-bar">
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            ☰
          </button>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            {role && <span className="user-role">{getRoleLabel(role)}</span>}
          </div>
          {role && <p className="role-description">{getRoleDescription(role)}</p>}
          {role === 'safety_officer' && (
            <Link to="/safety/notifications" className="top-bar-notifications">
              🔔
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>
          )}
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
