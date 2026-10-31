import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ProductStack from './navigation/ProductStack';

export default function App() {
  return (
    <NavigationContainer>
      <ProductStack />
    </NavigationContainer>
  );
}