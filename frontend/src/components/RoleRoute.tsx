import { Navigate, Outlet } from 'react-router-dom'
import { getDashboardPath } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

interface RoleRouteProps {
  allowedRoles: UserRole[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, role } = useAuth()

  if (!user || !role) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />
  }
  return <Outlet />
}
