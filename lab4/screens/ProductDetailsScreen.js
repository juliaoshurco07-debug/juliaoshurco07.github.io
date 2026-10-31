import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function ProductDetailsScreen({ route }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://dummyjson.com/products/' + id);
        if (!response.ok) {
          throw new Error('Eroare server: ' + response.status);
        }
        const data = await response.json();
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Eroare: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.category}>Categorie: {product.category}</Text>
      <Text style={styles.price}>{product.price} $</Text>
      <Text style={styles.rating}>Rating: {product.rating} / 5</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  error: { color: '#B0392F', fontSize: 16, textAlign: 'center' },
  image: { width: '100%', height: 260, backgroundColor: '#f2f2f2', borderRadius: 12 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  category: { color: '#666', marginTop: 4, textTransform: 'capitalize' },
  price: { fontSize: 20, color: '#2563eb', fontWeight: '600', marginTop: 8 },
  rating: { marginTop: 4 },
  description: { marginTop: 12, fontSize: 15, lineHeight: 22 },
});