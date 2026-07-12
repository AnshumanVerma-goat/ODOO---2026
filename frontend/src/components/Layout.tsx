import { Outlet, useNavigate } from 'react-router-dom'
import { getRoleDescription, getRoleLabel } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <header className="top-bar">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            {role && <span className="user-role">{getRoleLabel(role)}</span>}
          </div>
          {role && <p className="role-description">{getRoleDescription(role)}</p>}
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
