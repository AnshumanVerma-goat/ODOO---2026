import { create } from 'zustand';
import { MOCK_DEVICE } from '../constants/config';
import { DeviceModel, DeviceStatusEvent } from '../types';

type DeviceState = {
  device: DeviceModel;
  updateDevice: (partial: Partial<DeviceModel>) => void;
  applyDeviceStatusEvent: (payload: DeviceStatusEvent['payload']) => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
  device: MOCK_DEVICE,
  updateDevice: (partial) => set((state) => ({ device: { ...state.device, ...partial } })),
  applyDeviceStatusEvent: (payload) =>
    set((state) => ({
      device: {
        ...state.device,
        device_uid: payload.device_id,
        status: payload.status,
        battery_level: payload.battery_level,
        last_seen: payload.last_seen ?? state.device.last_seen,
      },
    })),
}));
