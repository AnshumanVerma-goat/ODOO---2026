import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Caregiver Profile</Text>
        <Text style={styles.row}>Name: {user.name}</Text>
        <Text style={styles.row}>Email: {user.email}</Text>
        <Pressable style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#040E1D', padding: 16 },
  card: { backgroundColor: '#0A1D34', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#163D66', gap: 8 },
  title: { color: '#EAF3FF', fontSize: 24, fontWeight: '800' },
  row: { color: '#C4D6EA', fontSize: 15 },
  btn: { marginTop: 10, backgroundColor: '#17365A', borderRadius: 10, padding: 12 },
  btnText: { color: '#EAF3FF', textAlign: 'center', fontWeight: '700' },
});
