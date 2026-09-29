import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useDeviceStore } from '../../src/store/deviceStore';

export default function DeviceSetupScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const { updateDevice } = useDeviceStore();
  const [deviceId, setDeviceId] = useState('nex-guard-001');

  const onFinish = () => {
    updateDevice({ device_uid: deviceId, status: 'online' });
    completeOnboarding();
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Device Setup</Text>
        <Text style={styles.note}>Connect the wearable unit to this account.</Text>
        <TextInput style={styles.input} value={deviceId} onChangeText={setDeviceId} placeholder="Device ID" />
        <Pressable style={styles.primary} onPress={onFinish}>
          <Text style={styles.primaryText}>Finish Setup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#061223' },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#E9F2FF', fontSize: 30, fontWeight: '800' },
  note: { color: '#9FB2CC', marginBottom: 8 },
  input: { backgroundColor: '#10233C', color: '#E9F2FF', borderRadius: 12, padding: 14, fontSize: 16 },
  primary: { backgroundColor: '#26C281', borderRadius: 12, padding: 14, marginTop: 8 },
  primaryText: { color: '#042017', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
