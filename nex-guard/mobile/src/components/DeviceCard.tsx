import { StyleSheet, Text, View } from 'react-native';
import { DeviceModel } from '../types';

export function DeviceCard({ device }: { device: DeviceModel }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Device</Text>
      <Text style={styles.item}>Status: {device.status.toUpperCase()}</Text>
      <Text style={styles.item}>Battery: {device.battery_level}%</Text>
      <Text style={styles.item}>Last seen: {new Date(device.last_seen).toLocaleString()}</Text>
      <Text style={styles.item}>Device ID: {device.device_uid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0A1D34', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#163D66', gap: 4 },
  title: { color: '#A9C4E2', fontWeight: '700', fontSize: 15 },
  item: { color: '#E7F2FF', fontSize: 14 },
});
