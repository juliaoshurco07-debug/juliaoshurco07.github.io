import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(null); // Va reține obiectul { data, type }

  if (!permission) {
    return <View style={styles.center}><Text>Se încarcă permisiunile...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Scanarea codurilor QR are nevoie de acces la cameră.</Text>
        <Pressable
          style={styles.buttonPrimary}
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
        >
          <Text style={styles.buttonPrimaryText}>
            {permission.canAskAgain ? 'Permite camera' : 'Deschide setările'}
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data, type }) => {
    setScanned({ data, type });
  };

  const openLink = () => {
    if (!scanned) return;
    Alert.alert('Deschizi linkul?', scanned.data, [
      { text: 'Nu', style: 'cancel' },
      { text: 'Da', onPress: () => Linking.openURL(scanned.data) },
    ]);
  };

  const isUrl = (text) => /^https?:\/\//i.test(text);

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {scanned && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Cod QR detectat:</Text>
          <Text style={styles.resultData} numberOfLines={3}>{scanned.data}</Text>

          {isUrl(scanned.data) && (
            <Pressable style={styles.btnOpen} onPress={openLink}>
              <Text style={styles.btnOpenText}>Deschide Link</Text>
            </Pressable>
          )}

          <Pressable style={styles.btnReset} onPress={() => setScanned(null)}>
            <Text style={styles.btnResetText}>Scanează din nou</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  message: { textAlign: 'center', marginBottom: 15, fontSize: 16, color: '#333' },
  buttonPrimary: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultCard: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  resultTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  resultData: { fontSize: 16, color: '#111', textAlign: 'center', marginBottom: 15 },
  btnOpen: { backgroundColor: '#34C759', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, width: '100%', alignItems: 'center' },
  btnOpenText: { color: '#fff', fontWeight: 'bold' },
  btnReset: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnResetText: { color: '#fff', fontWeight: 'bold' },
});