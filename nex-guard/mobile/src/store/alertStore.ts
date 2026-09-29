import { create } from 'zustand';
import { MOCK_ALERTS } from '../constants/config';
import { AlertModel, RealtimeEvent, SafetyState } from '../types';

type AlertState = {
  alerts: AlertModel[];
  activeAlert: AlertModel | null;
  safetyState: SafetyState;
  handleIncomingEvent: (event: RealtimeEvent) => void;
  acknowledgeAlert: () => void;
  resolveAlert: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  alerts: MOCK_ALERTS,
  activeAlert: null,
  safetyState: 'safe',

  handleIncomingEvent: (event) => {
    if (event.type === 'DEVICE_STATUS') return;

    const alert: AlertModel = {
      id: String(event.payload.alert_id),
      type: event.type === 'FALL_DETECTED' ? 'fall' : 'sos',
      status: 'new',
      confidence: event.type === 'FALL_DETECTED' ? event.payload.confidence : undefined,
      latitude: event.payload.latitude,
      longitude: event.payload.longitude,
      timestamp: event.payload.timestamp,
    };

    set((state) => ({
      alerts: [alert, ...state.alerts],
      activeAlert: alert,
      safetyState: event.type === 'FALL_DETECTED' ? 'fall_detected' : 'possible_fall',
    }));
  },

  acknowledgeAlert: () =>
    set((state) => {
      if (!state.activeAlert) return state;
      const updated = { ...state.activeAlert, status: 'acknowledged' as const };
      return {
        activeAlert: updated,
        safetyState: 'possible_fall',
        alerts: state.alerts.map((a) => (a.id === updated.id ? updated : a)),
      };
    }),

  resolveAlert: () =>
    set((state) => {
      if (!state.activeAlert) return state;
      const updated = { ...state.activeAlert, status: 'resolved' as const };
      return {
        activeAlert: null,
        safetyState: 'safe',
        alerts: state.alerts.map((a) => (a.id === updated.id ? updated : a)),
      };
    }),
}));
