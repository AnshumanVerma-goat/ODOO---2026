import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { getDashboardPath } from './config/roles'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TripsProvider } from './context/TripsContext'
import { Analytics } from './pages/Analytics'
import { Drivers } from './pages/Drivers'
import { Fleet } from './pages/Fleet'
import { FuelExpenses } from './pages/FuelExpenses'
import { Login } from './pages/Login'
import { Maintenance } from './pages/Maintenance'
import { Settings } from './pages/Settings'
import { Trips } from './pages/Trips'
import { DriverDashboard } from './pages/dashboards/DriverDashboard'
import { FinanceDashboard } from './pages/dashboards/FinanceDashboard'
import { FleetManagerDashboard } from './pages/dashboards/FleetManagerDashboard'
import { SafetyOfficerDashboard } from './pages/dashboards/SafetyOfficerDashboard'

function RootRedirect() {
  const { user, role } = useAuth()
  if (!user || !role) return <Navigate to="/login" replace />
  return <Navigate to={getDashboardPath(role)} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <TripsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route index element={<RootRedirect />} />
            <Route element={<Layout />}>
              <Route element={<RoleRoute allowedRoles={['fleet_manager']} />}>
                <Route path="fleet-manager" element={<FleetManagerDashboard />} />
                <Route path="fleet" element={<Fleet />} />
                <Route path="maintenance" element={<Maintenance />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['driver']} />}>
                <Route path="driver" element={<DriverDashboard />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['safety_officer']} />}>
                <Route path="safety-officer" element={<SafetyOfficerDashboard />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['finance_analytics_manager']} />}>
                <Route path="finance" element={<FinanceDashboard />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['fleet_manager', 'safety_officer']} />}>
                <Route path="drivers" element={<Drivers />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['fleet_manager', 'driver']} />}>
                <Route path="trips" element={<Trips />} />
              </Route>

              <Route
                element={
                  <RoleRoute allowedRoles={['fleet_manager', 'finance_analytics_manager']} />
                }
              >
                <Route path="fuel-expenses" element={<FuelExpenses />} />
              </Route>

              <Route
                element={
                  <RoleRoute allowedRoles={['finance_analytics_manager', 'safety_officer']} />
                }
              >
                <Route path="analytics" element={<Analytics />} />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={[
                      'fleet_manager',
                      'driver',
                      'safety_officer',
                      'finance_analytics_manager',
                    ]}
                  />
                }
              >
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
      </TripsProvider>
    </AuthProvider>
  )
}
