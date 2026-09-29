import { useMemo } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAlertStore } from '../../src/store/alertStore';
import { useAuthStore } from '../../src/store/authStore';

export default function EmergencyScreen() {
  const { elderlyProfile } = useAuthStore();
  const { activeAlert, acknowledgeAlert, resolveAlert } = useAlertStore();

  const region = useMemo(() => {
    const latitude = activeAlert?.latitude ?? 22.7196;
    const longitude = activeAlert?.longitude ?? 75.8577;
    return { latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  }, [activeAlert?.latitude, activeAlert?.longitude]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.badge}>🚨 FALL DETECTED</Text>
        <Text style={styles.name}>{elderlyProfile.name}</Text>
        <Text style={styles.meta}>Time: {activeAlert?.timestamp ?? '-'}</Text>
        <Text style={styles.meta}>Confidence: {activeAlert?.confidence ? `${Math.round(activeAlert.confidence * 100)}%` : '-'}</Text>
        <Text style={styles.meta}>Location: {activeAlert?.latitude?.toFixed(4)}, {activeAlert?.longitude?.toFixed(4)}</Text>

        <MapView style={styles.map} initialRegion={region} region={region}>
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Fall location" />
        </MapView>

        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.ack]} onPress={acknowledgeAlert}>
            <Text style={styles.btnText}>Acknowledge</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.resolve]} onPress={resolveAlert}>
            <Text style={styles.btnText}>Resolve</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2A0000' },
  container: { flex: 1, padding: 16, gap: 8 },
  badge: { fontSize: 34, fontWeight: '900', color: '#FFD8D8' },
  name: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  meta: { color: '#FFD6D6', fontSize: 14 },
  map: { flex: 1, borderRadius: 14, marginVertical: 8 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, borderRadius: 12, padding: 14 },
  ack: { backgroundColor: '#E68A00' },
  resolve: { backgroundColor: '#1FA971' },
  btnText: { color: 'white', textAlign: 'center', fontWeight: '800' },
});
