import { ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusCard } from '../../src/components/StatusCard';
import { DeviceCard } from '../../src/components/DeviceCard';
import { AlertCard } from '../../src/components/AlertCard';
import { EmergencyBanner } from '../../src/components/EmergencyBanner';
import { useAlertStore } from '../../src/store/alertStore';
import { useAuthStore } from '../../src/store/authStore';
import { useDeviceStore } from '../../src/store/deviceStore';

export default function DashboardScreen() {
  const { elderlyProfile } = useAuthStore();
  const { device } = useDeviceStore();
  const { activeAlert, alerts, safetyState } = useAlertStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>Nex Guard</Text>
        <Text style={styles.subtitle}>Caregiver Dashboard</Text>

        {activeAlert ? <EmergencyBanner alert={activeAlert} /> : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardText}>{elderlyProfile.name}</Text>
          <Text style={styles.cardMeta}>Age: {elderlyProfile.age}</Text>
          <Text style={styles.cardMeta}>Device: {device.status.toUpperCase()}</Text>
        </View>

        <StatusCard safetyState={safetyState} />
        <DeviceCard device={device} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Alerts</Text>
          {alerts.slice(0, 3).map((alert) => (
            <AlertCard key={alert.id} alert={alert} compact />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#040E1D' },
  container: { padding: 16, gap: 14 },
  brand: { color: '#EAF3FF', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#9CB2CC', marginTop: -4, marginBottom: 6 },
  card: { backgroundColor: '#0A1D34', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#163D66', gap: 4 },
  cardTitle: { color: '#A9C4E2', fontWeight: '700', fontSize: 15 },
  cardText: { color: '#F4F9FF', fontSize: 20, fontWeight: '700' },
  cardMeta: { color: '#C4D6EA', fontSize: 14 },
});
