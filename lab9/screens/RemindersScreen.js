import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { ensureNotificationPermission } from '../notifications/setup';
import { scheduleOnce, scheduleDaily } from '../notifications/scheduler';
import { loadReminders, saveReminders } from '../storage/remindersStorage';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('once'); // 'once' sau 'daily'
  const [minutes, setMinutes] = useState('1'); // pentru 'once'
  const [hour, setHour] = useState('8'); // pentru 'daily'
  const [minute, setMinute] = useState('0'); // pentru 'daily'
  const [lastOpened, setLastOpened] = useState(null);

  // 1. Reconcilierea: păstrăm din lista salvată doar ce există efectiv programat în sistem
  const reconcile = useCallback(async (saved) => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const ids = new Set(scheduled.map((n) => n.identifier));
    return saved.filter((r) => ids.has(r.id));
  }, []);

  // Citire la pornire + reconciliere
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let active = true;
    loadReminders().then(async (saved) => {
      const kept = await reconcile(saved);
      if (active) {
        setReminders(kept);
        setLoaded(true);
      }
    });

    // Ascultător pentru notificări primite în prim-plan
    const receivedSub = Notifications.addNotificationReceivedListener((n) => {
      if (n.request.content.data?.kind === 'once') {
        // Scoatem automat reminderul "o dată" din listă când se declanșează
        setReminders((prev) => prev.filter((r) => r.id !== n.request.identifier));
      }
    });

    // Ascultător pentru momentul când utilizatorul apasă pe notificare
    const responseSub = Notifications.addNotificationResponseReceivedListener((r) => {
      const clickedTitle = r.notification.request.content.data?.title;
      if (clickedTitle) {
        setLastOpened(clickedTitle);
      }
    });

    return () => {
      active = false;
      receivedSub.remove();
      responseSub.remove();
    };
  }, [reconcile]);

  // Salvare în AsyncStorage la modificări, doar după ce s-a încărcat starea inițială
  useEffect(() => {
    if (loaded) {
      saveReminders(reminders);
    }
  }, [reminders, loaded]);

  const handleAdd = async () => {
    const text = title.trim();
    if (text === '') {
      Alert.alert('Eroare', 'Introdu un titlu pentru reminder.');
      return;
    }

    const h = Number(hour);
    const m = Number(minute);
    const mins = Number(minutes);

    // Validări stricte ale intrărilor
    if (kind === 'daily' && (!(Number.isInteger(h) && h >= 0 && h <= 23) || !(Number.isInteger(m) && m >= 0 && m <= 59))) {
      Alert.alert('Oră invalidă', 'Ora trebuie să fie între 0 și 23, iar minutul între 0 și 59.');
      return;
    }
    if (kind === 'once' && (!(Number.isFinite(mins) && mins >= 1))) {
      Alert.alert('Valoare invalidă', 'Introdu un număr de minute mai mare sau egal cu 1.');
      return;
    }

    const allowed = await ensureNotificationPermission();
    if (!allowed) {
      Alert.alert('Permisiune necesară', 'Fără permisiunea pentru notificări, reminderele nu pot fi afișate.');
      return;
    }

    try {
      let reminder;
      if (kind === 'daily') {
        const id = await scheduleDaily(text, h, m);
        reminder = { id, title: text, kind, timeStr: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` };
      } else {
        const fireAt = Date.now() + mins * 60 * 1000;
        const id = await scheduleOnce(text, new Date(fireAt));
        reminder = { id, title: text, kind, timeStr: `Peste ${mins} min` };
      }

      setReminders((prev) => [reminder, ...prev]);
      setTitle('');
    } catch (err) {
      Alert.alert('Eroare', 'Nu s-a putut programa notificarea: ' + err.message);
    }
  };

  const handleRemove = async (reminder) => {
    await Notifications.cancelScheduledNotificationAsync(reminder.id);
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
  };

  const handleCancelAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setReminders([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Reminder Manager</Text>

      {lastOpened && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Ai deschis reminderul: "{lastOpened}"</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Ce vrei să îți reamintesc?"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      {/* Selector tip declanșare */}
      <View style={styles.rowTypes}>
        <Pressable
          style={[styles.typeBtn, kind === 'once' && styles.typeBtnActive]}
          onPress={() => setKind('once')}
        >
          <Text style={[styles.typeText, kind === 'once' && styles.typeTextActive]}>Peste X minute</Text>
        </Pressable>
        <Pressable
          style={[styles.typeBtn, kind === 'daily' && styles.typeBtnActive]}
          onPress={() => setKind('daily')}
        >
          <Text style={[styles.typeText, kind === 'daily' && styles.typeTextActive]}>Zilnic (Oră fixă)</Text>
        </Pressable>
      </View>

      {kind === 'once' ? (
        <View style={styles.inputGroup}>
          <Text>Minute de așteptare:</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            value={minutes}
            onChangeText={setMinutes}
          />
        </View>
      ) : (
        <View style={styles.rowTimes}>
          <View style={styles.inputGroup}>
            <Text>Oră (0-23):</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={hour}
              onChangeText={setHour}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text>Minut (0-59):</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={minute}
              onChangeText={setMinute}
            />
          </View>
        </View>
      )}

      <Pressable style={styles.btnPrimary} onPress={handleAdd}>
        <Text style={styles.btnPrimaryText}>Programează Reminder</Text>
      </Pressable>

      <View style={styles.headerList}>
        <Text style={styles.subtitle}>Remindere active ({reminders.length})</Text>
        {reminders.length > 0 && (
          <Pressable onPress={handleCancelAll}>
            <Text style={styles.cancelAllText}>Anulează toate</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardInfo}>
                Tip: {item.kind === 'daily' ? 'Zilnic 🔄' : 'O singură dată ⏱️'} ({item.timeStr})
              </Text>
            </View>
          <Pressable style={styles.btnDelete} onPress={() => handleRemove(item)}>
              <Text style={styles.btnDeleteText}>Șterge</Text>
            </Pressable>
            </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Niciun reminder programat.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  banner: { backgroundColor: '#e2e8f0', padding: 10, borderRadius: 8, marginBottom: 12 },
  bannerText: { color: '#1e293b', fontWeight: '600', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#f8fafc' },
  rowTypes: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  typeBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  typeText: { color: '#64748b', fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  rowTimes: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  inputGroup: { flex: 1, marginBottom: 10 },
  smallInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, backgroundColor: '#f8fafc', marginTop: 4 },
  btnPrimary: { backgroundColor: '#34C759', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerList: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: 'bold', color: '#334155' },
  cancelAllText: { color: '#ef4444', fontWeight: '600' },
  card: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  cardInfo: { fontSize: 12, color: '#64748b', marginTop: 2 },
  btnDelete: { backgroundColor: '#fee2e2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnDeleteText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
});