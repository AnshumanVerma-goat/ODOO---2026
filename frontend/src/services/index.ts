export * as authService from './authService'
export * as vehicleService from './vehicleService'
export * as driverService from './driverService'
export * as tripService from './tripService'
export * as maintenanceService from './maintenanceService'
export * as expenseService from './expenseService'
export * as financeService from './financeService'

export { login, logout, getCurrentUser } from './authService'
export {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from './vehicleService'
export {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from './driverService'
export {
  getTrips,
  getTripsForDriver,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip,
  reportTripIssue,
  getTripIssuesForDriver,
} from './tripService'
export {
  getMaintenanceRecords,
  getMaintenanceRecord,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from './maintenanceService'
export {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from './expenseService'
export {
  getRevenueRecords,
  getFuelRecords,
  getMaintenanceCostRecords,
  getFinanceNotifications,
  getFinanceReports,
  generateFinanceReport,
  getFinanceSettings,
  updateFinanceSettings,
} from './financeService'
