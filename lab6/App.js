import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { login, getMe } from './api/auth';
import { saveToken, loadToken, clearToken } from './storage/tokenStorage';
import { loadNotes, saveNotes } from './storage/notesStorage';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import NotesScreen from './screens/NotesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  // ready = am terminat de verificat dacă există o sesiune salvată
  const [ready, setReady] = useState(false);

  const [notes, setNotes] = useState([]);
  // notesLoaded = notițele au fost citite din stocare
  const [notesLoaded, setNotesLoaded] = useState(false);

  // --- Sesiunea: restaurare la pornire ---
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await loadToken();
        if (token) {
          setUser(await getMe(token));
        }
      } catch {
        // token expirat sau invalid: îl ștergem și rămânem la login
        await clearToken();
      } finally {
        setReady(true);
      }
    }
    restoreSession();
  }, []);

  // --- Notițele: citire la autentificare ---
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    loadNotes(user.id).then((list) => {
      if (!cancelled) {
        setNotes(list);
        setNotesLoaded(true);
      }
    });
    return () => {
      cancelled = true; // răspuns întârziat al unui utilizator vechi: îl ignorăm
    };
  }, [user?.id]);

  // --- Notițele: salvare la fiecare modificare, DOAR după ce s-au citit ---
  useEffect(() => {
    if (user && notesLoaded) saveNotes(user.id, notes);
  }, [notes, notesLoaded]);

  // --- Login / logout ---
  const handleLogin = async (username, password) => {
    const data = await login(username, password); // aruncă eroare la date greșite
    await saveToken(data.accessToken);
    setUser(data);
  };

  const handleLogout = async () => {
    await clearToken();
    setUser(null);
    setNotes([]); // golim doar starea din memorie; datele rămân salvate pe dispozitiv
    setNotesLoaded(false);
  };

  // --- Notițe: adăugare / ștergere ---
  const addNote = (text) => {
    const note = { id: Date.now().toString(), text };
    setNotes((prev) => [note, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Până nu știm dacă există o sesiune, afișăm doar un indicator de încărcare
  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" options={{ title: 'Profil' }}>
              {(props) => (
                <HomeScreen
                  {...props}
                  user={user}
                  noteCount={notes.length}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Notes" options={{ title: 'Notițe' }}>
              {(props) => (
                <NotesScreen
                  {...props}
                  notes={notes}
                  loaded={notesLoaded}
                  onAdd={addNote}
                  onDelete={deleteNote}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login" options={{ title: 'Autentificare' }}>
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}