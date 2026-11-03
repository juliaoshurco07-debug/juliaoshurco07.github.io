import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { runtimeLabel, formatVersion, envLabel, hostOf } from './utils/buildInfo';

const show = (value) => (value === null || value === undefined ? '—' : String(value));

export default function App() {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const dynamicKey = 'EXPO_PUBLIC_APP_ENV';
  const dynamicValue = process.env[dynamicKey];

  const rows = [
    ['Nume (app.json)', Constants.expoConfig?.name],
    ['Versiune formatată', formatVersion(Constants.expoConfig?.version, Application.nativeBuildVersion)],
    ['Platformă', Platform.OS],
    ['Mediu de execuție', runtimeLabel(Constants.executionEnvironment)],
    ['__DEV__', __DEV__ ? 'true' : 'false'],
    ['ID aplicație', Application.applicationId],
    ['Versiune nativă', Application.nativeApplicationVersion],
    ['Cod build nativ', Application.nativeBuildVersion],
    ['Mediu (EXPO_PUBLIC_APP_ENV)', envLabel(appEnv)],
    ['API Host (din URL)', hostOf(apiUrl)],
    ['Referire dinamică', show(dynamicValue)],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informații despre build</Text>
      <ScrollView style={styles.table}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{show(value)}</Text>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 64, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  table: { flexGrow: 0 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  label: { fontSize: 15, color: '#555', flex: 1 },
  value: { fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'right' },
});