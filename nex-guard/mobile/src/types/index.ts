export type SafetyState = 'safe' | 'possible_fall' | 'fall_detected';

export type DeviceStatus = 'online' | 'offline';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ElderlyProfile {
  name: string;
  age: number;
}

export interface DeviceModel {
  id: number;
  device_uid: string;
  battery_level: number;
  status: DeviceStatus;
  last_seen: string;
}

export interface AlertModel {
  id: string;
  type: 'fall' | 'sos';
  status: 'new' | 'acknowledged' | 'resolved';
  confidence?: number;
  latitude?: number;
  longitude?: number;
  timestamp: string;
}

export interface FallDetectedEvent {
  type: 'FALL_DETECTED';
  payload: {
    alert_id: number;
    device_id: string;
    elderly_id: number;
    status: string;
    confidence?: number;
    latitude?: number;
    longitude?: number;
    timestamp: string;
  };
}

export interface SosEvent {
  type: 'SOS';
  payload: {
    alert_id: number;
    device_id: string;
    elderly_id: number;
    status: string;
    latitude?: number;
    longitude?: number;
    timestamp: string;
  };
}

export interface DeviceStatusEvent {
  type: 'DEVICE_STATUS';
  payload: {
    device_id: string;
    status: DeviceStatus;
    battery_level: number;
    last_seen?: string;
  };
}

export type RealtimeEvent = FallDetectedEvent | SosEvent | DeviceStatusEvent;
