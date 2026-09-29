import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('caregiver@nexguard.dev');
  const [password, setPassword] = useState('password123');

  const onSubmit = async () => {
    await login(email, password);
    router.replace('/(onboarding)/profile');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.brand}>Nex Guard</Text>
        <Text style={styles.subtitle}>Caregiver Dashboard</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Pressable style={styles.primary} onPress={onSubmit}>
          <Text style={styles.primaryText}>Sign In</Text>
        </Pressable>
        <Link href="/(auth)/register" style={styles.link}>
          Create account
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#061223' },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  brand: { color: '#E9F2FF', fontSize: 36, fontWeight: '800' },
  subtitle: { color: '#9FB2CC', marginBottom: 8, fontSize: 16 },
  input: { backgroundColor: '#10233C', color: '#E9F2FF', borderRadius: 12, padding: 14, fontSize: 16 },
  primary: { backgroundColor: '#26C281', borderRadius: 12, padding: 14, marginTop: 8 },
  primaryText: { color: '#042017', textAlign: 'center', fontWeight: '700', fontSize: 16 },
  link: { color: '#6CB2FF', textAlign: 'center', marginTop: 8 },
});
