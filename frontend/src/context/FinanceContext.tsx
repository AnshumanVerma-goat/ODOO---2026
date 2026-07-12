import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  defaultFinanceSettings,
  financeNotifications as initialNotifications,
} from '../data/financeData'
import type { FinanceNotification, FinanceSettings } from '../types'

interface FinanceState {
  notifications: FinanceNotification[]
  settings: FinanceSettings
}

interface FinanceContextType extends FinanceState {
  unreadCount: number
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateSettings: (partial: Partial<FinanceSettings>) => void
}

const STORAGE_KEY = 'transportops_finance_state'

const FinanceContext = createContext<FinanceContextType | null>(null)

function loadState(): FinanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as FinanceState
  } catch {
    /* use defaults */
  }
  return { notifications: initialNotifications, settings: defaultFinanceSettings }
}

function persistState(state: FinanceState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinanceState>(loadState)

  const mutate = (updater: (prev: FinanceState) => FinanceState) => {
    setState((prev) => {
      const next = updater(prev)
      persistState(next)
      return next
    })
  }

  const markNotificationRead = (id: string) => {
    mutate((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }))
  }

  const markAllNotificationsRead = () => {
    mutate((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }))
  }

  const updateSettings = (partial: Partial<FinanceSettings>) => {
    mutate((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }))
  }

  const unreadCount = state.notifications.filter((n) => !n.read).length

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance must be used within FinanceProvider')
  return context
}
