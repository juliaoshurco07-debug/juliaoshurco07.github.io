import { View, Text } from 'react-native';

export default function MapPanel() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ textAlign: 'center', color: '#5A6B7B' }}>
        Harta nu este disponibilă pe Web. Deschide proiectul pe dispozitiv (Expo Go) pentru a o vedea.
      </Text>
    </View>
  );
}