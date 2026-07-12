import type {
  FinanceNotification,
  FinanceReportTemplate,
  FinanceSettings,
  FuelRecord,
  MaintenanceCostRecord,
  RevenueRecord,
} from '../types'

export const monthlyRevenue: RevenueRecord[] = [
  { month: 'Jan', revenue: 420000, expenses: 312000, profit: 108000 },
  { month: 'Feb', revenue: 445000, expenses: 328000, profit: 117000 },
  { month: 'Mar', revenue: 468000, expenses: 335000, profit: 133000 },
  { month: 'Apr', revenue: 452000, expenses: 341000, profit: 111000 },
  { month: 'May', revenue: 489000, expenses: 356000, profit: 133000 },
  { month: 'Jun', revenue: 512000, expenses: 368000, profit: 144000 },
  { month: 'Jul', revenue: 498000, expenses: 374000, profit: 124000 },
]

export const expenseBreakdown = [
  { category: 'Fuel', amount: 24800, color: '#2563eb' },
  { category: 'Maintenance', amount: 61500, color: '#d97706' },
  { category: 'Insurance', amount: 28000, color: '#0891b2' },
  { category: 'Tolls & Other', amount: 1500, color: '#6b7280' },
]

export const fuelRecords: FuelRecord[] = [
  { id: 'F001', vehicle: 'Truck Alpha', date: '2026-07-11', liters: 180, costPerLiter: 47.2, amount: 8500, route: 'Mumbai → Pune', driver: 'Rajesh Kumar' },
  { id: 'F002', vehicle: 'Truck Gamma', date: '2026-07-11', liters: 152, costPerLiter: 47.4, amount: 7200, route: 'Pune → Nashik', driver: 'Suresh Patel' },
  { id: 'F003', vehicle: 'Truck Epsilon', date: '2026-07-09', liters: 193, costPerLiter: 47.2, amount: 9100, route: 'Mumbai → Ahmedabad', driver: 'Anil Desai' },
  { id: 'F004', vehicle: 'Truck Alpha', date: '2026-07-08', liters: 165, costPerLiter: 47.0, amount: 7750, route: 'Nashik → Mumbai', driver: 'Rajesh Kumar' },
  { id: 'F005', vehicle: 'Van Delta', date: '2026-07-07', liters: 68, costPerLiter: 47.1, amount: 3200, route: 'Pune → Mumbai', driver: 'Amit Sharma' },
  { id: 'F006', vehicle: 'Truck Gamma', date: '2026-07-05', liters: 140, costPerLiter: 46.8, amount: 6550, route: 'Mumbai → Pune', driver: 'Suresh Patel' },
]

export const monthlyFuelTrend = [
  { month: 'Mar', amount: 62000, liters: 1320 },
  { month: 'Apr', amount: 71000, liters: 1510 },
  { month: 'May', amount: 68000, liters: 1445 },
  { month: 'Jun', amount: 74000, liters: 1575 },
  { month: 'Jul', amount: 42300, liters: 898 },
]

export const maintenanceCostRecords: MaintenanceCostRecord[] = [
  { id: 'MC001', vehicle: 'Van Beta', type: 'Engine Overhaul', date: '2026-07-10', cost: 45000, status: 'in_progress', vendor: 'AutoCare Services', description: 'Complete engine rebuild and gasket replacement' },
  { id: 'MC002', vehicle: 'Truck Alpha', type: 'Tire Replacement', date: '2026-07-20', cost: 12000, status: 'pending', vendor: 'MRF Tyres', description: 'Replace all 6 tires — scheduled maintenance' },
  { id: 'MC003', vehicle: 'Truck Gamma', type: 'Oil Change', date: '2026-07-05', cost: 3500, status: 'completed', vendor: 'FleetServ', description: 'Synthetic oil change and filter replacement' },
  { id: 'MC004', vehicle: 'Truck Epsilon', type: 'Brake Inspection', date: '2026-07-25', cost: 8000, status: 'pending', vendor: 'BrakePro', description: 'Full brake system inspection and pad replacement' },
  { id: 'MC005', vehicle: 'Van Delta', type: 'AC Service', date: '2026-06-28', cost: 2500, status: 'completed', vendor: 'CoolAir Tech', description: 'AC gas refill and compressor check' },
  { id: 'MC006', vehicle: 'Truck Alpha', type: 'Transmission Service', date: '2026-06-15', cost: 18500, status: 'completed', vendor: 'AutoCare Services', description: 'Transmission fluid change and clutch adjustment' },
]

export const maintenanceByVehicle = [
  { vehicle: 'Truck Alpha', cost: 30500 },
  { vehicle: 'Van Beta', cost: 45000 },
  { vehicle: 'Truck Gamma', cost: 3500 },
  { vehicle: 'Truck Epsilon', cost: 8000 },
  { vehicle: 'Van Delta', cost: 2500 },
]

export const financeNotifications: FinanceNotification[] = [
  { id: 'FN001', type: 'budget_alert', title: 'Fuel budget at 82%', message: 'Monthly fuel spend has reached 82% of the allocated ₹30,000 budget.', createdAt: '2026-07-11T09:30:00', read: false, priority: 'high', link: '/finance/fuel', amount: 24800 },
  { id: 'FN002', type: 'maintenance_due', title: 'Pending maintenance costs', message: '₹20,000 in maintenance costs are scheduled within the next 14 days.', createdAt: '2026-07-11T08:15:00', read: false, priority: 'medium', link: '/finance/maintenance', amount: 20000 },
  { id: 'FN003', type: 'revenue_milestone', title: 'Revenue target achieved', message: 'July revenue has exceeded the monthly target by 4.2%.', createdAt: '2026-07-10T16:00:00', read: true, priority: 'low', link: '/finance/revenue-expense' },
  { id: 'FN004', type: 'expense_spike', title: 'Maintenance expense spike', message: 'Engine overhaul for Van Beta (₹45,000) is 3× the monthly average.', createdAt: '2026-07-10T11:45:00', read: false, priority: 'high', link: '/finance/maintenance', amount: 45000 },
  { id: 'FN005', type: 'approval_required', title: 'Expense approval pending', message: 'Tire replacement for Truck Alpha (₹12,000) requires finance approval.', createdAt: '2026-07-09T14:20:00', read: true, priority: 'medium', link: '/finance/maintenance', amount: 12000 },
  { id: 'FN006', type: 'system', title: 'Weekly financial digest ready', message: 'Your weekly financial summary report is available for download.', createdAt: '2026-07-08T07:00:00', read: true, priority: 'low', link: '/finance/reports' },
]

export const financeReportTemplates: FinanceReportTemplate[] = [
  { id: 'FR001', name: 'Revenue & Profit Summary', description: 'Monthly revenue, expenses, and net profit analysis with trend comparison.', frequency: 'monthly', formats: ['pdf', 'csv', 'xlsx'], lastGenerated: '2026-07-01', category: 'revenue' },
  { id: 'FR002', name: 'Fuel Cost Analysis', description: 'Detailed fuel consumption by vehicle, route, and cost-per-liter breakdown.', frequency: 'weekly', formats: ['pdf', 'csv'], lastGenerated: '2026-07-08', category: 'fuel' },
  { id: 'FR003', name: 'Maintenance Expenditure', description: 'Maintenance costs by vehicle, vendor, and service type with forecasting.', frequency: 'monthly', formats: ['pdf', 'xlsx'], lastGenerated: '2026-07-01', category: 'maintenance' },
  { id: 'FR004', name: 'Expense Category Breakdown', description: 'Full expense categorization with budget variance and anomaly detection.', frequency: 'monthly', formats: ['pdf', 'csv', 'xlsx'], lastGenerated: '2026-06-30', category: 'expense' },
  { id: 'FR005', name: 'Quarterly Financial Review', description: 'Comprehensive quarterly P&L, cash flow, and fleet cost efficiency report.', frequency: 'quarterly', formats: ['pdf', 'xlsx'], category: 'summary' },
  { id: 'FR006', name: 'Vehicle Cost Efficiency', description: 'Per-vehicle revenue vs. operating cost ratio and ROI analysis.', frequency: 'on_demand', formats: ['pdf', 'csv'], category: 'summary' },
]

export const defaultFinanceSettings: FinanceSettings = {
  currency: 'INR',
  fiscalYearStart: 'April',
  budgetAlerts: true,
  expenseThreshold: 50000,
  fuelAlerts: true,
  maintenanceAlerts: true,
  weeklyDigest: true,
  autoExport: false,
  defaultReportFormat: 'pdf',
}

export const vehicleProfitability = [
  { vehicle: 'Truck Alpha', revenue: 142000, cost: 38500, margin: 72.9 },
  { vehicle: 'Truck Gamma', revenue: 128000, cost: 10750, margin: 91.6 },
  { vehicle: 'Truck Epsilon', revenue: 115000, cost: 36100, margin: 68.6 },
  { vehicle: 'Van Beta', revenue: 68000, cost: 47500, margin: 30.1 },
  { vehicle: 'Van Delta', revenue: 45000, cost: 4700, margin: 89.6 },
]
