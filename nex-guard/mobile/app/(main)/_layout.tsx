import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#061223' },
        headerTintColor: '#E9F2FF',
        tabBarStyle: { backgroundColor: '#07172C', borderTopColor: '#123055' },
        tabBarActiveTintColor: '#4CA9FF',
        tabBarInactiveTintColor: '#88A5C7',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="device" options={{ title: 'Device' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Emergency', href: null }} />
    </Tabs>
  );
}
