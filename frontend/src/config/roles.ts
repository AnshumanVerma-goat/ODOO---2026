import type { UserRole } from '../types'

export interface RoleConfig {
  label: string
  description: string
  dashboardPath: string
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  fleet_manager: {
    label: 'Fleet Manager',
    description:
      'Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency.',
    dashboardPath: '/fleet-manager',
  },
  driver: {
    label: 'Driver',
    description:
      'Views assigned trips, tracks active deliveries, and monitors vehicle availability.',
    dashboardPath: '/driver',
  },
  safety_officer: {
    label: 'Safety Officer',
    description:
      'Ensures driver compliance, tracks license validity, and monitors safety scores.',
    dashboardPath: '/safety-officer',
  },
  finance_analytics_manager: {
    label: 'Finance & Analytics Manager',
    description:
      'Reviews operational expenses, fuel consumption, maintenance costs, and profitability.',
    dashboardPath: '/finance',
  },
}

export function getDashboardPath(role: UserRole): string {
  return ROLE_CONFIG[role].dashboardPath
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_CONFIG[role].label
}

export function getRoleDescription(role: UserRole): string {
  return ROLE_CONFIG[role].description
}
