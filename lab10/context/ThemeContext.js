import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadTheme, saveTheme } from '../storage/themeStorage';

const ThemeContext = createContext(null);

const PALETTES = {
  light: {
    bg: '#ffffff',
    card: '#f8fafc',
    text: '#0f172a',
    subtext: '#64748b',
    border: '#cbd5e1',
    primary: '#007AFF',
  },
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    subtext: '#94a3b8',
    border: '#334155',
    primary: '#38bdf8',
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTheme()
      .then((saved) => setMode(saved))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTheme(mode);
    }
  }, [mode, loaded]);

  const toggleTheme = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({ mode, colors: PALETTES[mode], toggleTheme }),
    [mode, toggleTheme]
  );

  if (!loaded) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme trebuie folosit în interiorul unui ThemeProvider');
  }
  return context;
}