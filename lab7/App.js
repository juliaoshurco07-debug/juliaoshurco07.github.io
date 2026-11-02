import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, SafeAreaView, StatusBar } from 'react-native';
import JournalScreen from './screens/JournalScreen';
import ScannerScreen from './screens/ScannerScreen';

export default function App() {
  const [tab, setTab] = useState('journal');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Bara de navigare între tab-uri */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, tab === 'journal' && styles.activeTab]}
          onPress={() => setTab('journal')}
        >
          <Text style={[styles.tabText, tab === 'journal' && styles.activeTabText]}>Jurnal</Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, tab === 'scanner' && styles.activeTab]}
          onPress={() => setTab('scanner')}
        >
          <Text style={[styles.tabText, tab === 'scanner' && styles.activeTabText]}>Scanner QR</Text>
        </Pressable>
      </View>

      {/* Randare condiționată: ScannerScreen se demontează complet la schimbarea tab-ului, eliberând camera */}
      <View style={styles.content}>
        {tab === 'journal' ? <JournalScreen /> : <ScannerScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f2' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
  content: { flex: 1 },
});