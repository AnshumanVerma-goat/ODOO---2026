import { API_ENDPOINTS } from '../api/config'
import { notImplemented } from '../api/placeholder'
import type {
  FinanceNotification,
  FinanceReportTemplate,
  FinanceSettings,
  FuelRecord,
  MaintenanceCostRecord,
  RevenueRecord,
} from '../types'

/**
 * Fetch monthly revenue and expense records.
 * TODO: GET /finance/revenue
 */
export function getRevenueRecords(): Promise<RevenueRecord[]> {
  void API_ENDPOINTS.expenses
  return notImplemented('getRevenueRecords()')
}

/**
 * Fetch fuel cost records.
 * TODO: GET /finance/fuel
 */
export function getFuelRecords(): Promise<FuelRecord[]> {
  void API_ENDPOINTS.expenses
  return notImplemented('getFuelRecords()')
}

/**
 * Fetch maintenance cost records.
 * TODO: GET /finance/maintenance-costs
 */
export function getMaintenanceCostRecords(): Promise<MaintenanceCostRecord[]> {
  void API_ENDPOINTS.maintenance
  return notImplemented('getMaintenanceCostRecords()')
}

/**
 * Fetch finance notifications.
 * TODO: GET /finance/notifications
 */
export function getFinanceNotifications(): Promise<FinanceNotification[]> {
  return notImplemented('getFinanceNotifications()')
}

/**
 * Fetch available report templates.
 * TODO: GET /finance/reports
 */
export function getFinanceReports(): Promise<FinanceReportTemplate[]> {
  return notImplemented('getFinanceReports()')
}

/**
 * Generate a financial report.
 * TODO: POST /finance/reports/:id/generate
 */
export function generateFinanceReport(reportId: string, format: string): Promise<Blob> {
  void reportId
  void format
  return notImplemented('generateFinanceReport()')
}

/**
 * Fetch finance settings for the current user.
 * TODO: GET /finance/settings
 */
export function getFinanceSettings(): Promise<FinanceSettings> {
  return notImplemented('getFinanceSettings()')
}

/**
 * Update finance settings.
 * TODO: PATCH /finance/settings
 */
export function updateFinanceSettings(settings: Partial<FinanceSettings>): Promise<FinanceSettings> {
  void settings
  return notImplemented('updateFinanceSettings()')
}
