import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  safetyIncidents as initialIncidents,
  safetyNotifications as initialNotifications,
} from '../data/safetyData'
import type { IncidentStatus, SafetyIncident, SafetyNotification } from '../types'

interface SafetyState {
  incidents: SafetyIncident[]
  notifications: SafetyNotification[]
}

interface SafetyContextType extends SafetyState {
  unreadCount: number
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateIncidentStatus: (id: string, status: IncidentStatus) => void
}

const STORAGE_KEY = 'transportops_safety_state'

const SafetyContext = createContext<SafetyContextType | null>(null)

function loadState(): SafetyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as SafetyState
  } catch {
    /* use defaults */
  }
  return { incidents: initialIncidents, notifications: initialNotifications }
}

function persistState(state: SafetyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SafetyState>(loadState)

  const mutate = (updater: (prev: SafetyState) => SafetyState) => {
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

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    mutate((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) =>
        incident.id === id ? { ...incident, status } : incident,
      ),
    }))
  }

  const unreadCount = state.notifications.filter((n) => !n.read).length

  return (
    <SafetyContext.Provider
      value={{
        ...state,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        updateIncidentStatus,
      }}
    >
      {children}
    </SafetyContext.Provider>
  )
}

export function useSafety() {
  const context = useContext(SafetyContext)
  if (!context) throw new Error('useSafety must be used within SafetyProvider')
  return context
}
