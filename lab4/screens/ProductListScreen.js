import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const LIST_URL =
  'https://dummyjson.com/products?limit=0&select=title,price,thumbnail,category&sortBy=title&order=asc';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(LIST_URL);
        if (!response.ok) {
          throw new Error('Eroare server: ' + response.status);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // valori derivate, calculate la fiecare randare (fără fetch, fără state nou)
  const categories = ['Toate', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Toate' || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  function toggleFavorite(id) {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Se încarcă produsele...</Text>
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
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Caută produs..."
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c}
          renderItem={({ item }) => {
            const active = item === selectedCategory;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={[styles.muted, { textAlign: 'center', marginTop: 24 }]}>
            Niciun produs găsit.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.rowMain}
              onPress={() =>
                navigation.navigate('ProductDetails', { id: item.id })
              }
            >
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.price}>{item.price} $</Text>
              </View>
            </Pressable>

            <Pressable
              hitSlop={10}
              onPress={() => toggleFavorite(item.id)}
              style={styles.heartBtn}
            >
              <Text style={styles.heart}>
                {favoriteIds.includes(item.id) ? '\u2665' : '\u2661'}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  muted: { color: '#666', marginTop: 8 },
  error: { color: '#B0392F', fontSize: 16, textAlign: 'center' },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoriesWrapper: { height: 48 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginLeft: 8,
    alignSelf: 'center',
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12, backgroundColor: '#f2f2f2' },
  title: { fontSize: 15, fontWeight: '600' },
  price: { color: '#2563eb', marginTop: 2 },
  heartBtn: { paddingLeft: 12 },
  heart: { fontSize: 24, color: '#B0392F' },
});