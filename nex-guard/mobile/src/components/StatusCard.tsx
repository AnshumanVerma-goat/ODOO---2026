import { StyleSheet, Text, View } from 'react-native';
import { SafetyState } from '../types';

export function StatusCard({ safetyState }: { safetyState: SafetyState }) {
  const map = {
    safe: { title: '● SAFE', subtitle: 'Everything looks normal', tone: '#1FA971' },
    possible_fall: { title: '⚠ POSSIBLE FALL', subtitle: 'Waiting for confirmation', tone: '#FFB648' },
    fall_detected: { title: '🚨 FALL DETECTED', subtitle: 'Immediate attention required', tone: '#FF4B4B' },
  }[safetyState];

  return (
    <View style={[styles.card, { borderColor: map.tone }]}> 
      <Text style={[styles.title, { color: map.tone }]}>{map.title}</Text>
      <Text style={styles.subtitle}>{map.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0A1D34', borderRadius: 16, padding: 14, borderWidth: 1.5 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#D2E3F7', marginTop: 4, fontSize: 15 },
});
