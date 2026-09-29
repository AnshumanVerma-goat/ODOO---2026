import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AlertCard } from '../../src/components/AlertCard';
import { useAlertStore } from '../../src/store/alertStore';

export default function HistoryScreen() {
  const { alerts } = useAlertStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Alert History</Text>
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AlertCard alert={item} />}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#040E1D' },
  container: { flex: 1, padding: 16 },
  title: { color: '#EAF3FF', fontSize: 24, fontWeight: '800', marginBottom: 12 },
});
