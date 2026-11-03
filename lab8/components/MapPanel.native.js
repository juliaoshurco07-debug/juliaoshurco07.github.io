import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { formatDistance } from '../utils/distance';

export default function MapPanel({ position, cafes, selectedId, onSelect }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🗺️ Vizualizare Hartă (Mod Compatibilitate)</Text>
        <Text style={styles.infoText}>
          Coordonate curentă: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
        </Text>
      </View>

      {cafes.map((cafe) => {
        const isSelected = cafe.id === selectedId;
        return (
          <Pressable
            key={cafe.id}
            style={[styles.cafeCard, isSelected && styles.selectedCard]}
            onPress={() => onSelect(cafe.id)}
          >
            <Text style={styles.cafeName}>{cafe.name}</Text>
            <Text style={styles.cafeDist}>{formatDistance(cafe.distance)}</Text>
            <Text style={styles.coords}>
              Lat: {cafe.latitude.toFixed(4)}, Lon: {cafe.longitude.toFixed(4)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  infoBox: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  infoTitle: { fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#475569' },
  cafeCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  selectedCard: { borderColor: '#007AFF', backgroundColor: '#eff6ff', borderWidth: 2 },
  cafeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cafeDist: { fontSize: 14, color: '#007AFF', fontWeight: '600', marginTop: 2 },
  coords: { fontSize: 11, color: '#666', marginTop: 4 },
});