import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function OnboardingProfileScreen() {
  const router = useRouter();
  const { updateElderlyProfile } = useAuthStore();
  const [name, setName] = useState('Demo User');
  const [age, setAge] = useState('72');

  const onContinue = () => {
    updateElderlyProfile({ name, age: Number(age) });
    router.replace('/(onboarding)/device-setup');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Elderly Profile</Text>
        <Text style={styles.note}>Set up the person under monitoring.</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Age" />
        <Pressable style={styles.primary} onPress={onContinue}>
          <Text style={styles.primaryText}>Continue</Text>
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
