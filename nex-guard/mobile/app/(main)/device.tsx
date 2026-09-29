import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDeviceStore } from '../../src/store/deviceStore';

export default function DeviceScreen() {
  const { device } = useDeviceStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.row}>Device ID: {device.device_uid}</Text>
        <Text style={styles.row}>Connection: {device.status}</Text>
        <Text style={styles.row}>Battery: {device.battery_level}%</Text>
        <Text style={styles.row}>Last heartbeat: {device.last_seen}</Text>
        <Text style={styles.row}>Firmware: v1.0.0 (placeholder)</Text>
        <Text style={styles.row}>Sensor status: MPU6050 ✓ BMP390 ✓ GPS ✓</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#040E1D', padding: 16 },
  card: { backgroundColor: '#0A1D34', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#163D66', gap: 8 },
  title: { color: '#EAF3FF', fontSize: 24, fontWeight: '800' },
  row: { color: '#C4D6EA', fontSize: 15 },
});
