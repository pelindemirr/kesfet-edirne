import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';

const routes = [
  {
    id: 1,
    title: 'Tarihi Camiler Turu',
    time: '3 saat',
    places: '8 yer',
    distance: '5.2 km',
    rating: '4.8',
    image: require('../../assets/rota/camii.webp'),
  },
  {
    id: 2,
    title: 'Meriç Kıyısı Gezisi',
    time: '2.5 saat',
    places: '6 yer',
    distance: '4.8 km',
    rating: '4.6',
    image: require('../../assets/rota/meric.jpg'),
  },
];

export default function RoutesPage() {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hazır Rotalar</Text>
        <Text style={styles.subtitle}>Edirne'yi keşfetmek için hazırlanmış rotalar</Text>

        {routes.map(route => (
          <TouchableOpacity
            key={route.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push('/route-detail')}
          >
            <View style={styles.imageWrapper}>
              <Image source={route.image} style={styles.cardImage} />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {route.rating}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{route.title}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoItem}>🕒 {route.time}</Text>
                <Text style={styles.infoItem}>📍 {route.places}</Text>
              </View>
              <Text style={styles.distanceText}>{route.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    elevation: 2,
  },
  ratingText: { fontWeight: 'bold', fontSize: 13 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  infoRow: { flexDirection: 'row', marginBottom: 8 },
  infoItem: { fontSize: 14, color: '#555', marginRight: 15 },
  distanceText: { fontSize: 14, color: '#888' },
});
