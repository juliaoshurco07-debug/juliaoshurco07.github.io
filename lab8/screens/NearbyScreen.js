import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { formatDistance, sortByDistance } from '../utils/distance';
import { generateDemoCafes } from '../data/demoCafes';
import { fetchCafes } from '../api/overpass';
import { useLivePosition } from '../hooks/useLivePosition';
import MapPanel from '../components/MapPanel.native';

export default function NearbyScreen() {
  const [status, setStatus] = useState('idle'); // idle, locating, denied, blocked, error, ready
  const [position, setPosition] = useState(null);
  const [rawCafes, setRawCafes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' sau 'map'
  const [follow, setFollow] = useState(false);
  const [notice, setNotice] = useState(null);
  const [message, setMessage] = useState('');

  const controllerRef = useRef(null);

  const search = async (wantedSource) => {
    setStatus('locating');
    setNotice(null);

    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setStatus(permission.canAskAgain ? 'denied' : 'blocked');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const here = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
      setPosition(here);

      let list;
      if (wantedSource === 'osm') {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        try {
          list = await fetchCafes(here, 1500, controllerRef.current.signal);
          if (list.length === 0) {
            setNotice('OpenStreetMap nu are cafenele în raza de 1,5 km. Afișăm datele demo.');
            list = generateDemoCafes(here);
          }
        } catch (err) {
          if (err.name === 'AbortError') return;
          setNotice(`Nu am putut interoga OpenStreetMap (${err.message}). Afișăm datele demo.`);
          list = generateDemoCafes(here);
        }
      } else {
        list = generateDemoCafes(here);
      }

      setRawCafes(list);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const cafes = useMemo(
    () => (position ? sortByDistance(position, rawCafes) : []),
    [position, rawCafes]
  );

  const selected = cafes.find((c) => c.id === selectedId) || cafes[0];

  useLivePosition(follow && status === 'ready', setPosition);

  const openDirections = (cafe) => {
    if (!cafe) return;
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`);
  };

  if (status !== 'ready' && status !== 'locating') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>☕ Cafenele în apropiere</Text>
        {status === 'denied' && <Text style={styles.warning}>Fără locație nu putem calcula distanțele.</Text>}
        {status === 'blocked' && (
          <Pressable onPress={() => Linking.openSettings()}>
            <Text style={styles.warning}>Permisiunea este blocată. Atinge aici pentru Setări.</Text>
          </Pressable>
        )}
        {status === 'error' && <Text style={styles.warning}>Eroare: {message}</Text>}

        <Pressable style={styles.buttonPrimary} onPress={() => search('demo')}>
          <Text style={styles.buttonPrimaryText}>Găsește cafenele (date demo)</Text>
        </Pressable>
        <Pressable style={styles.buttonOutline} onPress={() => search('osm')}>
          <Text style={styles.buttonOutlineText}>Găsește cafenele reale (OpenStreetMap)</Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'locating') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: '#666' }}>Se obține poziția curentă...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Notificări / avertismente */}
      {notice && (
        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      )}

      {/* Comutator mod vizualizare: Listă / Hartă */}
      <View style={styles.modeToggle}>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Listă</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Hartă</Text>
        </Pressable>
      </View>

      {/* Comutator urmărire live */}
      <View style={styles.followBar}>
        <Pressable
          style={[styles.followButton, follow && styles.followActive]}
          onPress={() => setFollow(!follow)}
        >
          <Text style={[styles.followButtonText, follow && styles.followActiveText]}>
            {follow ? '📍 Urmărire activă (25m)' : 'Pornește urmărirea poziției'}
          </Text>
        </Pressable>
      </View>

      {/* Conținut: Listă sau Hartă */}
      {viewMode === 'list' ? (
        <FlatList
          data={cafes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.card,
                index === 0 && styles.cardNearest,
                item.id === selectedId && styles.cardSelected,
              ]}
              onPress={() => setSelectedId(item.id)}
            >
              <View style={{ flex: 1 }}>
                {index === 0 && <Text style={styles.badge}>Cea mai apropiată</Text>}
                <Text style={styles.cafeName}>{item.name}</Text>
                <Text style={styles.cafeDistance}>{formatDistance(item.distance)}</Text>
              </View>
              <Pressable style={styles.buttonPrimarySmall} onPress={() => openDirections(item)}>
                <Text style={styles.buttonPrimaryText}>Navighează</Text>
              </Pressable>
            </Pressable>
          )}
        />
      ) : (
        <MapPanel
          position={position}
          cafes={cafes}
          selectedId={selectedId || selected?.id}
          onSelect={(id) => setSelectedId(id)}
        />
      )}

      {/* Bară inferioară cu elementul selectat */}
      {selected && (
        <View style={styles.selectedBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cafeName}>{selected.name}</Text>
            <Text style={styles.cafeDistance}>{formatDistance(selected.distance)}</Text>
          </View>
          <Pressable style={styles.buttonPrimarySmall} onPress={() => openDirections(selected)}>
            <Text style={styles.buttonPrimaryText}>Navighează</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  warning: { color: '#d9534f', textAlign: 'center', marginBottom: 16, fontSize: 15 },
  buttonPrimary: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  buttonOutline: { borderWidth: 1, borderColor: '#007AFF', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonOutlineText: { color: '#007AFF', fontWeight: 'bold' },
  noticeBar: { backgroundColor: '#fff3cd', padding: 10, alignItems: 'center' },
  noticeText: { color: '#856404', fontSize: 13, textAlign: 'center' },
  modeToggle: { flexDirection: 'row', backgroundColor: '#e9ecef', padding: 4, margin: 16, borderRadius: 8 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 2 },
  toggleText: { fontWeight: '600', color: '#6c757d' },
  toggleTextActive: { color: '#007AFF' },
  followBar: { paddingHorizontal: 16, marginBottom: 10 },
  followButton: { backgroundColor: '#e2e8f0', padding: 10, borderRadius: 8, alignItems: 'center' },
  followActive: { backgroundColor: '#34C759' },
  followButtonText: { color: '#475569', fontWeight: '600' },
  followActiveText: { color: '#fff' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 2 },
  cardNearest: { borderLeftWidth: 4, borderLeftColor: '#34C759' },
  cardSelected: { borderColor: '#007AFF', borderWidth: 1 },
  badge: { fontSize: 11, fontWeight: 'bold', color: '#34C759', marginBottom: 4 },
  cafeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cafeDistance: { fontSize: 14, color: '#666', marginTop: 2 },
  buttonPrimarySmall: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  selectedBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, elevation: 5 },
});