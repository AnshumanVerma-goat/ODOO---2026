import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/store/authStore';
import { useAlertStore } from '../src/store/alertStore';
import { useDeviceStore } from '../src/store/deviceStore';
import { websocketService } from '../src/services/websocket';
import { requestNotificationPermission } from '../src/services/notifications';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const { handleIncomingEvent } = useAlertStore();
  const { applyDeviceStatusEvent } = useDeviceStore();

  useEffect(() => {
    requestNotificationPermission();
    websocketService.connect((event) => {
      if (event.type === 'DEVICE_STATUS') {
        applyDeviceStatusEvent(event.payload);
      }
      handleIncomingEvent(event);
      if (event.type === 'FALL_DETECTED' || event.type === 'SOS') {
        router.replace('/(main)/alerts');
      }
    });

    return () => websocketService.disconnect();
  }, [applyDeviceStatusEvent, handleIncomingEvent, router]);

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
      return;
    }

    if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/(onboarding)/profile');
      return;
    }

    if (isAuthenticated && hasCompletedOnboarding && (inAuth || inOnboarding)) {
      router.replace('/(main)');
    }
  }, [segments, isAuthenticated, hasCompletedOnboarding, router]);

  return <Slot />;
}
