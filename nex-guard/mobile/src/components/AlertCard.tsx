import { StyleSheet, Text, View } from 'react-native';
import { AlertModel } from '../types';

export function AlertCard({ alert, compact = false }: { alert: AlertModel; compact?: boolean }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{alert.type.toUpperCase()} · {alert.status.toUpperCase()}</Text>
      <Text style={styles.meta}>{new Date(alert.timestamp).toLocaleString()}</Text>
      {alert.confidence !== undefined ? <Text style={styles.meta}>Confidence: {Math.round(alert.confidence * 100)}%</Text> : null}
      {!compact ? <Text style={styles.meta}>Location: {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0F2743', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#1A4676' },
  title: { color: '#F5FAFF', fontWeight: '700', fontSize: 14 },
  meta: { color: '#BDD2EA', fontSize: 12, marginTop: 2 },
});
