import { API_ENDPOINTS } from '../api/config'
import type { CreateExpenseInput, UpdateExpenseInput } from '../api/types'
import type { Expense } from '../types'
import { notImplemented } from '../api/placeholder'

/**
 * Fetch all expenses.
 * TODO: GET /expenses
 */
export function getExpenses(): Promise<Expense[]> {
  void API_ENDPOINTS.expenses
  return notImplemented('getExpenses()')
}

/**
 * Fetch a single expense entry.
 * TODO: GET /expenses/:id
 */
export function getExpense(id: string): Promise<Expense> {
  void API_ENDPOINTS.expenses
  void id
  return notImplemented('getExpense()')
}

/**
 * Log a new expense.
 * TODO: POST /expenses
 */
export function createExpense(input: CreateExpenseInput): Promise<Expense> {
  void API_ENDPOINTS.expenses
  void input
  return notImplemented('createExpense()')
}

/**
 * Update an expense entry.
 * TODO: PATCH /expenses/:id
 */
export function updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
  void API_ENDPOINTS.expenses
  void id
  void input
  return notImplemented('updateExpense()')
}

/**
 * Remove an expense entry.
 * TODO: DELETE /expenses/:id
 */
export function deleteExpense(id: string): Promise<void> {
  void API_ENDPOINTS.expenses
  void id
  return notImplemented('deleteExpense()')
}
