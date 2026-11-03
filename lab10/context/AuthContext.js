import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { login, getMe } from '../api/auth';
import { saveToken, loadToken, clearToken } from '../storage/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await loadToken();
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
        }
      } catch {
        await clearToken();
      } finally {
        setReady(true);
      }
    }
    restoreSession();
  }, []);

  const signIn = useCallback(async (username, password) => {
    const data = await login(username, password);
    await saveToken(data.accessToken);
    setUser(data);
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut }),
    [user, ready, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth trebuie folosit în interiorul unui AuthProvider');
  }
  return context;
}