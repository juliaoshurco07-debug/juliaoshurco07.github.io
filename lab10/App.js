import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import RootNavigator from './navigation/RootNavigator';

function MainNavigatorContainer() {
  const { mode } = useTheme();
  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <MainNavigatorContainer />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}