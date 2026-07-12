export interface RegisterRoleOption {
  /** Exact role name stored in the backend `roles` table */
  roleName: string
  label: string
}

export const REGISTER_ROLE_OPTIONS: RegisterRoleOption[] = [
  { roleName: 'Fleet Manager', label: 'Fleet Manager' },
  { roleName: 'Dispatcher', label: 'Driver' },
  { roleName: 'Safety Officer', label: 'Safety Officer' },
  { roleName: 'Financial Analyst', label: 'Finance & Analytics Manager' },
]
