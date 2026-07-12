import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { getDashboardPath } from './config/roles'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'
import { SafetyProvider } from './context/SafetyContext'
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
import { FinancialAnalytics } from './pages/finance/FinancialAnalytics'
import { FinanceNotifications } from './pages/finance/FinanceNotifications'
import { FinanceReports } from './pages/finance/FinanceReports'
import { FinanceSettings } from './pages/finance/FinanceSettings'
import { FuelCostManagement } from './pages/finance/FuelCostManagement'
import { MaintenanceCostTracking } from './pages/finance/MaintenanceCostTracking'
import { RevenueExpenseOverview } from './pages/finance/RevenueExpenseOverview'
import { DriverCompliance } from './pages/safety/DriverCompliance'
import { IncidentReports } from './pages/safety/IncidentReports'
import { LicenseTracking } from './pages/safety/LicenseTracking'
import { SafetyAnalytics } from './pages/safety/SafetyAnalytics'
import { SafetyNotifications } from './pages/safety/SafetyNotifications'
import { SafetyReports } from './pages/safety/SafetyReports'

function RootRedirect() {
  const { user, role } = useAuth()
  if (!user || !role) return <Navigate to="/login" replace />
  return <Navigate to={getDashboardPath(role)} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <TripsProvider>
      <SafetyProvider>
      <FinanceProvider>
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
                <Route path="safety/compliance" element={<DriverCompliance />} />
                <Route path="safety/incidents" element={<IncidentReports />} />
                <Route path="safety/licenses" element={<LicenseTracking />} />
                <Route path="safety/analytics" element={<SafetyAnalytics />} />
                <Route path="safety/notifications" element={<SafetyNotifications />} />
                <Route path="safety/reports" element={<SafetyReports />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['finance_analytics_manager']} />}>
                <Route path="finance" element={<FinanceDashboard />} />
                <Route path="finance/revenue-expense" element={<RevenueExpenseOverview />} />
                <Route path="finance/fuel" element={<FuelCostManagement />} />
                <Route path="finance/maintenance" element={<MaintenanceCostTracking />} />
                <Route path="finance/analytics" element={<FinancialAnalytics />} />
                <Route path="finance/notifications" element={<FinanceNotifications />} />
                <Route path="finance/reports" element={<FinanceReports />} />
                <Route path="finance/settings" element={<FinanceSettings />} />
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

              <Route element={<RoleRoute allowedRoles={['finance_analytics_manager']} />}>
                <Route path="analytics" element={<Analytics />} />
              </Route>

              <Route
                element={
                  <RoleRoute
                    allowedRoles={[
                      'fleet_manager',
                      'driver',
                      'safety_officer',
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
      </FinanceProvider>
      </SafetyProvider>
      </TripsProvider>
    </AuthProvider>
  )
}
