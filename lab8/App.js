import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import NearbyScreen from './screens/NearbyScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <NearbyScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
});