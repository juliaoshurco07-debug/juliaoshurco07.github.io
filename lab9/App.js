import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import RemindersScreen from './screens/RemindersScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <RemindersScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
});