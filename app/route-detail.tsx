import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
const mericStops = [
  { id: 1, name: 'Tarihi Meriç Köprüsü', desc: 'Mecidiye Köprüsü olarak da bilinen eşsiz Osmanlı mimarisi.', time: '20 dk' },
  { id: 2, name: 'Protokol Evi', desc: 'Nehir kenarında çay molası ve manzara keyfi.', time: '40 dk' },
  { id: 3, name: 'Lozan Anıtı ve Müzesi', desc: 'Karaağaç yerleşkesinde tarihi bir yolculuk.', time: '30 dk' },
  { id: 4, name: 'Tarihi Tren Garı', desc: 'Günümüzde Güzel Sanatlar Fakültesi olan ikonik bina.', time: '25 dk' },
  { id: 5, name: 'Gazi Mihal Camii', desc: 'Nehir kıyısındaki en eski külliyelerden biri.', time: '20 dk' },
];



export default function RouteDetail() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Üst Görsel Alanı */}
        <View style={styles.headerImageWrapper}>
          <Image 
            source={require('../assets/rota/camii.webp')} 
            style={styles.headerImage} 
          />
          {/* Yazıların okunması için hafif karartma */}
          <View style={styles.overlay} />
          
         
          
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Tarihi Merkez Turu</Text>
          </View>
        </View>

        {/* 1. İstatistik Kutuları (Resmin üzerine binen kısım) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🕒 Süre</Text>
            <Text style={styles.statValue}>3 saat</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>📍 Mesafe</Text>
            <Text style={styles.statValue}>5.2 km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>⭐ Puan</Text>
            <Text style={styles.statValue}>4.8</Text>
          </View>
        </View>

        {/* 2. Rota Hakkında Kartı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rota Hakkında</Text>
          <Text style={styles.sectionText}>
            Edirne'nin en önemli tarihi yapılarını kapsayan, şehrin ruhunu hissedeceğiniz merkez rota. Mimar Sinan'ın izinden giderek eşsiz camileri ve çarşıları keşfedin.
          </Text>
        </View>

        {/* 3. Duraklar Listesi */}
        <Text style={styles.listHeaderTitle}>Duraklar ({stops.length})</Text>
        
        {stops.map((stop) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopNumberCircle}>
              <Text style={styles.stopNumberText}>{stop.id}</Text>
            </View>
            <View style={styles.stopContent}>
              <View style={styles.stopHeaderRow}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopTimeText}>🕒 {stop.time}</Text>
              </View>
              <Text style={styles.stopDesc}>{stop.desc}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImageWrapper: { 
    height: 320, 
    position: 'relative' 
  },
  headerImage: { 
    width: '100%', 
    height: '100%' 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)', // Resimdeki gibi hafif karartma
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    backgroundColor: '#fff', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2
  },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  titleContainer: {
    position: 'absolute',
    bottom: 60, // İstatistik kartıyla çakışmaması için yukarı aldık
    left: 20,
  },
  mainTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 20, 
    marginTop: -35, // Kartın resmin üzerine binmesini sağlar
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: '70%', backgroundColor: '#eee', alignSelf: 'center' },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  sectionCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    margin: 20, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#666', lineHeight: 22 },
  listHeaderTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    marginLeft: 25, 
    marginBottom: 15 
  },
  stopCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    marginBottom: 12, 
    padding: 15, 
    borderRadius: 18, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05
  },
  stopNumberCircle: { 
    width: 34, 
    height: 34, 
    backgroundColor: '#e60000', 
    borderRadius: 17, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  stopNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  stopContent: { flex: 1 },
  stopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stopName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  stopTimeText: { fontSize: 12, color: '#888' },
  stopDesc: { fontSize: 13, color: '#777', marginTop: 4 },
});