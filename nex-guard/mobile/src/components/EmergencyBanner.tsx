import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AlertModel } from '../types';

export function EmergencyBanner({ alert }: { alert: AlertModel }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>🚨 Active Emergency</Text>
      <Text style={styles.meta}>{alert.type.toUpperCase()} at {new Date(alert.timestamp).toLocaleTimeString()}</Text>
      <Link href="/(main)/alerts" style={styles.link}>
        Open emergency screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#590A0A', borderColor: '#FF4B4B', borderWidth: 1.5, borderRadius: 14, padding: 12 },
  title: { color: '#FFD7D7', fontSize: 18, fontWeight: '900' },
  meta: { color: '#FFD7D7', marginTop: 4 },
  link: { color: '#FFF', marginTop: 8, fontWeight: '700' },
});
