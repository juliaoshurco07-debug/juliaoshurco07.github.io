import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, FlatList, Pressable, Button,
  RefreshControl, ActivityIndicator, StyleSheet,
} from 'react-native';

const PAGE_SIZE = 20;
const DELAY_MS = 1000; // doar pentru testare (0 = fără întârziere)

// Cere o pagină de produse, începând de la poziția "skip"
async function fetchPage(skip) {
  const url =
    `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}` +
    `&select=title,price,thumbnail&delay=${DELAY_MS}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Eroare server: ${response.status}`);
  return response.json();
}

export default function ProductFeedScreen() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);          // prima încărcare
  const [refreshing, setRefreshing] = useState(false);   // reîmprospătare
  const [loadingMore, setLoadingMore] = useState(false); // pagina următoare
  const [error, setError] = useState(null);              // prima încărcare / reîmprospătare
  const [moreError, setMoreError] = useState(null);      // pagina următoare

  const hasMore = products.length < total;

  // Prima pagină: la pornire, la „Reîncearcă” și la reîmprospătare
  const loadFirstPage = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    setMoreError(null);
    try {
      const data = await fetchPage(0);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Pagina următoare: se adaugă la finalul listei
  const loadMore = async () => {
    if (loading || refreshing || loadingMore || !hasMore) return;
    const skip = products.length;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const data = await fetchPage(skip);
      setProducts((prev) => (prev.length === skip ? [...prev, ...data.products] : prev));
    } catch (err) {
      setMoreError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  // Eroare la prima încărcare: ecran întreg
  if (error && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Eroare: {error}</Text>
        <Button title="Reîncearcă" onPress={() => loadFirstPage()} />
      </View>
    );
  }

  // Subsolul listei depinde de starea paginii următoare
  const footer = loadingMore ? (
    <ActivityIndicator style={styles.footer} />
  ) : moreError ? (
    <View style={styles.footer}>
      <Text style={styles.errorText}>Nu s-au putut încărca mai multe: {moreError}</Text>
      <Button title="Reîncearcă" onPress={loadMore} />
    </View>
  ) : hasMore ? (
    <View style={styles.footer}>
      <Button title="Încarcă mai multe" onPress={loadMore} />
    </View>
  ) : (
    <Text style={[styles.footer, styles.endText]}>Ai ajuns la sfârșitul listei.</Text>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.counter}>{products.length} din {total} produse</Text>
        <Pressable onPress={() => loadFirstPage(true)} disabled={refreshing}>
          <Text style={styles.refreshText}>
            {refreshing ? 'Se reîmprospătează...' : 'Reîmprospătează'}
          </Text>
        </Pressable>
      </View>

      {/* Eroare la reîmprospătare: lista rămâne pe ecran */}
      {error && <Text style={styles.banner}>Reîmprospătarea a eșuat: {error}</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadFirstPage(true)} />
        }
        onEndReached={() => {
          if (!moreError) loadMore();
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.price}>{item.price} $</Text>
          </View>
        )}
        ListFooterComponent={footer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  errorText: { color: '#B0392F', textAlign: 'center' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12,
  },
  counter: { color: '#5A6B7B', fontSize: 13 },
  refreshText: { color: '#1C7293', fontWeight: '600', fontSize: 13 },
  banner: { backgroundColor: '#FBECEA', color: '#B0392F', padding: 10, textAlign: 'center' },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  thumb: { width: 48, height: 48, borderRadius: 6, backgroundColor: '#EAF6FC' },
  name: { flex: 1, fontSize: 15, color: '#0B1F3A', fontWeight: '600' },
  price: { color: '#1C7293', fontWeight: 'bold' },

  footer: { padding: 16, alignItems: 'center', gap: 8 },
  endText: { color: '#5A6B7B', textAlign: 'center' },
});