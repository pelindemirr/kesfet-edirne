
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { width } = Dimensions.get('window');
  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}} showsVerticalScrollIndicator={false}>
      {/* Üst Alan */}
      <View style={styles.headerWrap}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <IconSymbol name="line.3.horizontal" size={28} color="#fff" />
            <ThemedText type="title" style={styles.headerTitle}>Keşfi Edirne</ThemedText>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.loginText}>Giriş</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          <ThemedText style={styles.headerSubtitle}>Tarihi keşfedin, rotanızı planlayın</ThemedText>
          <ThemedText style={styles.headerLocation}>📍 Edirne, Merkez</ThemedText>
        </View>
      </View>

      {/* Bilgi Kutusu */}
      <View style={styles.infoBoxShadow}>
        <View style={styles.infoBox}>
          <View style={{flex: 1}}>
            <ThemedText type="subtitle" style={{color:'#d32f2f', fontWeight:'bold'}}>Bugün nereyi keşfedelim?</ThemedText>
            <ThemedText style={styles.infoDesc}>Rotalar, yerler ve etkinlikler</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#d32f2f" />
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.sunny}>☀️ 24° Güneşli</ThemedText>
          <ThemedText style={styles.usd}>$ USD $34.52</ThemedText>
        </View>
      </View>

      {/* Kartlar */}
      <View style={styles.cardsGrid}>
          <TouchableOpacity style={styles.card}>
            <IconSymbol name="map" size={32} color="#d32f2f" />
            <ThemedText style={styles.cardTitle}>Harita</ThemedText>
            <ThemedText style={styles.cardDesc}>Yerleşim yerlerini keşfedin</ThemedText>
          </TouchableOpacity>
          <Link href="/rota" asChild>
            <TouchableOpacity style={styles.card}>
              <IconSymbol name="scope" size={32} color="#ff9800" />
              <ThemedText style={styles.cardTitle}>Rotalar</ThemedText>
              <ThemedText style={styles.cardDesc}>Hazır rotalar</ThemedText>
            </TouchableOpacity>
          </Link>
          <Link href="/events" asChild>
            <TouchableOpacity style={styles.card}>
              <IconSymbol name="calendar" size={32} color="#1976d2" />
              <ThemedText style={styles.cardTitle}>Etkinlikler</ThemedText>
              <ThemedText style={styles.cardDesc}>Güncel etkinlikler</ThemedText>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.card}>
          <IconSymbol name="person.3" size={32} color="#8e24aa" />
          <ThemedText style={styles.cardTitle}>Topluluk</ThemedText>
          <ThemedText style={styles.cardDesc}>Paylaşılan rotalar</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Üyelik Kutusu */}
      <View style={styles.sectionBoxRed}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
          <IconSymbol name="person.crop.circle.badge.plus" size={32} color="#d32f2f" style={{marginRight:8}} />
          <ThemedText style={{fontWeight:'bold',fontSize:16,color:'#d32f2f'}}>Neden Üye Olmalısınız?</ThemedText>
        </View>
        <ThemedText style={{color:'#d32f2f',marginBottom:6}}>Kendi rotanızı oluşturun, favorilerinizi kaydedin ve rozet kazanın</ThemedText>
        <View style={{marginBottom:8}}>
          <ThemedText style={styles.checkLine}>✔️ Özel rota oluşturma ve kaydetme</ThemedText>
          <ThemedText style={styles.checkLine}>✔️ Rotalarınızı toplulukla paylaşma</ThemedText>
          <ThemedText style={styles.checkLine}>✔️ Rozet kazanma ve ilerleme takibi</ThemedText>
        </View>
        <TouchableOpacity style={styles.redButton}>
          <ThemedText style={styles.redButtonText}>Ücretsiz Üye Ol</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Popüler Rotalar */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Popüler Rotalar</ThemedText>
          <TouchableOpacity><ThemedText style={styles.sectionAll}>Tümü →</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.routeCard}>
          <View style={styles.routeImage} />
          <View style={{flex:1}}>
            <ThemedText style={styles.routeTitle}>Tarihi Merkez Turu</ThemedText>
            <ThemedText style={styles.routeInfo}>6 durak · ⭐ 4.8</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={22} color="#d32f2f" />
        </View>
        <View style={styles.routeCard}>
          <View style={styles.routeImagePlaceholder} />
          <View style={{flex:1}}>
            <ThemedText style={styles.routeTitle}>Meriç Kıyısı Gezisi</ThemedText>
            <ThemedText style={styles.routeInfo}>4 durak · ⭐ 4.6</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={22} color="#d32f2f" />
        </View>
      </View>

      {/* Yaklaşan Etkinlikler */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Yaklaşan Etkinlikler</ThemedText>
          <TouchableOpacity><ThemedText style={styles.sectionAll}>Tümü →</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.eventCard}>
          <View style={{flex:1}}>
            <ThemedText style={styles.eventTitle}>Kırkpınar Yağlı Güreş Festivali</ThemedText>
            <ThemedText style={styles.eventInfo}>Kültürel · 5-11 Temmuz 2026</ThemedText>
          </View>
          <IconSymbol name="calendar" size={22} color="#d32f2f" />
        </View>
        <View style={styles.eventCard}>
          <View style={{flex:1}}>
            <ThemedText style={styles.eventTitle}>Edirne Festivali</ThemedText>
            <ThemedText style={styles.eventInfo}>Festival · 1-5 Mayıs 2026</ThemedText>
          </View>
          <IconSymbol name="calendar" size={22} color="#d32f2f" />
        </View>
      </View>

      {/* Topluluk Rotaları */}
      <View style={styles.sectionBoxPurple}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
          <IconSymbol name="person.3" size={28} color="#8e24aa" style={{marginRight:8}} />
          <ThemedText style={{fontWeight:'bold',fontSize:15,color:'#8e24aa'}}>Topluluk Rotaları</ThemedText>
        </View>
        <ThemedText style={{color:'#8e24aa',marginBottom:8}}>Diğer gezginlerin paylaştığı rotaları keşfedin ve kendi rotalarınızı paylaşın</ThemedText>
        <TouchableOpacity style={styles.purpleButton}>
          <ThemedText style={styles.purpleButtonText}>Keşfet →</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Edirne Hakkında */}
      <View style={styles.sectionBoxLightRed}>
        <ThemedText style={{fontWeight:'bold',fontSize:15,color:'#d32f2f',marginBottom:4}}>Edirne Hakkında</ThemedText>
        <ThemedText style={{color:'#d32f2f',fontSize:13}}>
          Tarihi ve kültürel zenginlikleriyle UNESCO Dünya Mirası Listesi'nde yer alan Edirne, Mimar Sinan'ın ustalık eseri Selimiye Camii ve Kırkpınar Yağlı Güreşleri ile ünlüdür.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerWrap: {
    height: 180,
    position: 'relative',
    marginBottom: 0,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d32f2f',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 36,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 0.2,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 2,
  },
  headerLocation: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 2,
  },
  infoBoxShadow: {
    marginHorizontal: 24,
    marginTop: -36,
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#d32f2f',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    paddingBottom: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  infoDesc: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  sunny: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  usd: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 18,
    rowGap: 10,
    columnGap: 8,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 10,
    shadowColor: '#d32f2f',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.2,
    borderColor: '#f0eaea',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 2,
    color: '#d32f2f',
    textAlign: 'center',
  },
  cardDesc: {
    color: '#1976d2',
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 2,
    marginTop: 2,
  },
  checkLine: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 4,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#d32f2f',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0eaea',
  },
  sectionBoxRed: {
    backgroundColor: '#fff5f5',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#ffd6d6',
    shadowColor: '#d32f2f',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionBoxPurple: {
    backgroundColor: '#f7eaff',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#d1b3f7',
    shadowColor: '#8e24aa',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionBoxLightRed: {
    backgroundColor: '#fff6f2',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#ffd6d6',
    shadowColor: '#d32f2f',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  sectionAll: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 13,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  routeImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  routeImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  routeInfo: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  eventInfo: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  redButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  purpleButton: {
    backgroundColor: '#8e24aa',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  purpleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 