import { AlertModel, DeviceModel, ElderlyProfile } from '../types';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
export const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL ?? 'ws://localhost:8000/api/v1/ws';
export const USE_MOCK_DATA = (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? 'true') === 'true';

export const MOCK_PROFILE: ElderlyProfile = {
  name: 'Demo User',
  age: 72,
};

export const MOCK_DEVICE: DeviceModel = {
  id: 1,
  device_uid: 'nex-guard-001',
  battery_level: 84,
  status: 'online',
  last_seen: new Date().toISOString(),
};

export const MOCK_ALERTS: AlertModel[] = [
  {
    id: 'a1',
    type: 'fall',
    status: 'resolved',
    confidence: 0.91,
    latitude: 22.7196,
    longitude: 75.8577,
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'a2',
    type: 'sos',
    status: 'acknowledged',
    latitude: 22.718,
    longitude: 75.86,
    timestamp: new Date(Date.now() - 7200_000).toISOString(),
  },
];
