import AppHeader from '@/components/Header';
import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const mapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
      .leaflet-control-zoom a { border-radius: 8px; }
      .place-label {
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 999px;
        padding: 6px 10px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #1f2937;
        box-shadow: 0 3px 8px rgba(0,0,0,0.12);
        white-space: nowrap;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      const map = L.map('map', { zoomControl: true }).setView([41.6766, 26.5557], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#2f87d6;border:3px solid white;box-shadow:0 2px 7px rgba(0,0,0,0.25);"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 18],
        popupAnchor: [0, -16],
      });

      const places = [
        { name: 'Merkez', coords: [41.6766, 26.5557] },
        { name: 'Selimiye', coords: [41.6771, 26.5567] },
        { name: 'Eski Cami', coords: [41.6778, 26.5590] },
        { name: 'Ali Paşa', coords: [41.6760, 26.5538] },
        { name: 'Meriç Köprüsü', coords: [41.6725, 26.5447] },
        { name: 'Karaağaç', coords: [41.6618, 26.5338] },
      ];

      places.forEach((place) => {
        L.marker(place.coords, { icon }).addTo(map).bindPopup('<b>' + place.name + '</b>');
      });
    </script>
  </body>
</html>`;

const districts = ['Merkez', 'Balık Pazarı', 'Vedane', 'Süloğlu', 'Uzunkopru', 'Lalapaşa', 'Keşan', 'Meriç'];
const allCategories = ['Tüm Kategoriler', 'Tarihi Yerler', 'Müzeler', 'Doğa & Parklar', 'Restoranlar', 'Kafeler', 'Alışveriş'];

const places = [
  { id: 1, name: 'Beyazıt Köprüsü', category: 'Tarihi', description: 'Meriç üzerindeki tarihi köprü' },
  { id: 2, name: 'Ciğercı Niyazi Usta', category: 'Restoran', description: 'Meşhur Edirne tava ciğeri' },
  { id: 3, name: 'Edirne Belediye Müzesi', category: 'Müze', description: 'Şehrin tarihi ve kültürü' },
  { id: 4, name: 'Eski Cami', category: 'Tarihi', description: 'Büyük hat sanatı örnekleriyle süslenmiş' },
  { id: 5, name: 'Kahve Diyarı', category: 'Kafe', description: 'Selimiye manzaralı kafe' },
  { id: 6, name: 'Lalezar Restaurant', category: 'Restoran', description: 'Geleneksel Edirne lezzetleri' },
];

const badgeClassByCategory: Record<string, string> = {
  Tarihi: 'bg-[#fff3c6] text-[#d39b00]',
  Restoran: 'bg-[#ffe9dd] text-[#d96a11]',
  Müze: 'bg-[#e8f0ff] text-[#3c6fd9]',
  Kafe: 'bg-[#f4e7ff] text-[#8b4cc6]',
};

export default function AccountExploreScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<typeof places>([]);
  const [plannedRoute, setPlannedRoute] = useState<typeof places>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Merkez');
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [districtMenuOpen, setDistrictMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [routeName, setRouteName] = useState('Örn: Tarihi Merkez Turu');
  const [routeDescription, setRouteDescription] = useState('');

  const toggleFavorite = (place: typeof places[0]) => {
    if (favorites.find((fav) => fav.id === place.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== place.id));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  const addToRoute = (place: typeof places[0]) => {
    if (!plannedRoute.find((p) => p.id === place.id)) {
      setPlannedRoute([...plannedRoute, place]);
    }
  };

  const removeFromRoute = (placeId: number) => {
    setPlannedRoute(plannedRoute.filter((p) => p.id !== placeId));
  };

  const isFavorite = (placeId: number) => favorites.some((fav) => fav.id === placeId);
  const isInRoute = (placeId: number) => plannedRoute.some((p) => p.id === placeId);

  const handleSaveRoute = () => {
    setSaveModalVisible(false);
    setRouteName('Örn: Tarihi Merkez Turu');
    setRouteDescription('');
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f7f4f2]">
        <AppHeader />

        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full max-w-[360px] rounded-[18px] border border-[#ffd6d6] bg-white p-5">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-[14px] bg-[#fef2f2]">
              <IconSymbol name="lock.fill" size={24} color="#dc2626" />
            </View>
            <Text className="mb-1 text-[20px] font-bold text-[#111827]">Harita için giriş gerekli</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              Rota oluşturmak ve kaydetmek için giriş yapabilirsiniz. Giriş yaptıktan sonra harita ve rota planlama açılır.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="items-center rounded-[12px] bg-[#dc2626] py-3"
            >
              <Text className="text-[14px] font-bold text-white">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f7f4f2]">
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="px-3 pt-3">
          <Text className="mb-3 text-[22px] font-bold text-black">Rota Planlama</Text>

          <View className="mb-2 rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
            <TouchableOpacity onPress={() => setDistrictMenuOpen(!districtMenuOpen)} className="flex-row items-center justify-between">
              <Text className="text-[14px] text-[#6b7280]">{selectedDistrict}</Text>
              <IconSymbol name="chevron.down" size={16} color="#9ca3af" />
            </TouchableOpacity>
            {districtMenuOpen && (
              <View className="mt-2 border-t border-[#e5e7eb] pt-2">
                {districts.map((district) => (
                  <TouchableOpacity
                    key={district}
                    onPress={() => {
                      setSelectedDistrict(district);
                      setDistrictMenuOpen(false);
                    }}
                    className="flex-row items-center justify-between px-2 py-2"
                  >
                    <Text
                      className={`text-[14px] ${
                        selectedDistrict === district ? 'font-semibold text-[#111827]' : 'text-[#6b7280]'
                      }`}
                    >
                      {district}
                    </Text>
                    {selectedDistrict === district && <IconSymbol name="checkmark" size={16} color="#6b7280" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="mb-3 rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
            <TouchableOpacity onPress={() => setCategoryMenuOpen(!categoryMenuOpen)} className="flex-row items-center justify-between">
              <Text className="text-[14px] text-[#6b7280]">{selectedCategory}</Text>
              <IconSymbol name="chevron.down" size={16} color="#9ca3af" />
            </TouchableOpacity>
            {categoryMenuOpen && (
              <View className="mt-2 border-t border-[#e5e7eb] pt-2">
                {allCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setCategoryMenuOpen(false);
                    }}
                    className="flex-row items-center justify-between px-2 py-2"
                  >
                    <Text
                      className={`text-[14px] ${
                        selectedCategory === category ? 'font-semibold text-[#111827]' : 'text-[#6b7280]'
                      }`}
                    >
                      {category}
                    </Text>
                    {selectedCategory === category && <IconSymbol name="checkmark" size={16} color="#6b7280" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="mb-4 overflow-hidden rounded-[12px] border border-[#e8e3da] bg-[#efe7d7]">
            <WebView
              source={{ html: mapHtml }}
              style={{ height: 210, backgroundColor: '#efe7d7' }}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              scrollEnabled={false}
            />
          </View>

          <View className="mb-4 flex-row items-center rounded-[10px] bg-white px-3 py-2.5">
            <IconSymbol name="magnifyingglass" size={18} color="#9ca3af" />
            <TextInput placeholder="Yer ara..." placeholderTextColor="#9ca3af" className="ml-2 flex-1 text-[14px] text-[#111827]" />
          </View>

          {favorites.length > 0 && (
            <View className="mb-4 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <View className="mb-3 flex-row items-center gap-2">
                <IconSymbol name="heart.fill" size={20} color="#dc2626" />
                <Text className="text-[16px] font-bold text-[#dc2626]">Favoriniz ({favorites.length})</Text>
              </View>

              <View className="gap-2">
                {favorites.map((favorite) => (
                  <View
                    key={favorite.id}
                    className="flex-row items-center justify-between rounded-[10px] border border-[#fca5a5] bg-white px-3 py-2.5"
                  >
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="w-6 text-center text-[18px] font-bold text-[#dc2626]">❤️</Text>
                      <View className="flex-1">
                        <Text className="text-[14px] font-semibold text-[#111827]">{favorite.name}</Text>
                        <Text className="text-[12px] text-[#6b7280]">{favorite.category}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => toggleFavorite(favorite)} className="h-8 w-8 items-center justify-center rounded-full bg-[#fee2e2]">
                      <Text className="text-[16px]">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {plannedRoute.length > 0 && (
            <View className="mb-4 rounded-[14px] border-2 border-[#dc2626] bg-[#fef2f2] px-4 py-3">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <Text className="text-[18px]">✓</Text>
                  <Text className="text-[16px] font-bold text-[#dc2626]">Rotanız ({selectedCategory})</Text>
                </View>
              </View>

              <View className="mb-3 gap-2">
                {plannedRoute.map((place, idx) => (
                  <View key={place.id} className="flex-row items-center justify-between rounded-[10px] border border-[#fca5a5] bg-white px-3 py-2.5">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-[#dc2626]">
                        <Text className="text-[12px] font-bold text-white">{idx + 1}</Text>
                      </View>
                      <Text className="text-[14px] font-semibold text-[#111827]">{place.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromRoute(place.id)} className="h-6 w-6 items-center justify-center">
                      <Text className="text-[18px]">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => setSaveModalVisible(true)} className="flex-1 rounded-[10px] bg-[#dc2626] py-2.5">
                  <Text className="text-center text-[14px] font-bold text-white">Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShareModalVisible(true)} className="flex-1 rounded-[10px] bg-[#991b1b] py-2.5">
                  <Text className="text-center text-[14px] font-bold text-white">Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text className="mb-3 text-[18px] font-bold text-[#111827]">Gezilecek Yerler (15)</Text>

          <View className="gap-3">
            {places.map((place) => {
              const badgeClass = badgeClassByCategory[place.category] ?? badgeClassByCategory.Tarihi;

              return (
                <View key={place.id} className="rounded-[14px] border border-[#e5e7eb] bg-white px-3 py-3">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 pr-2">
                      <View className="mb-1 flex-row items-center gap-2">
                        <Text className="text-[15px] font-semibold text-[#111827]">{place.name}</Text>
                        <View className={`rounded-full px-2 py-0.5 ${badgeClass}`}>
                          <Text className="text-[11px] font-semibold">{place.category}</Text>
                        </View>
                      </View>
                      <Text className="text-[13px] text-[#6b7280]">{place.description}</Text>
                    </View>

                    <View className="flex-row items-center gap-3 pt-0.5">
                      <TouchableOpacity onPress={() => toggleFavorite(place)} className="h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-white">
                        <IconSymbol name="heart" size={17} color={isFavorite(place.id) ? '#dc2626' : '#94a3b8'} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => addToRoute(place)}
                        className={`rounded-[8px] border px-3 py-1.5 ${
                          isInRoute(place.id) ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#d1d5db] bg-white'
                        }`}
                      >
                        <Text className={`text-[13px] font-semibold ${isInRoute(place.id) ? 'text-[#22c55e]' : 'text-[#111827]'}`}>
                          {isInRoute(place.id) ? 'Eklendi' : 'Ekle'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={saveModalVisible} transparent animationType="fade" onRequestClose={() => setSaveModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[85%] rounded-[16px] bg-white px-6 py-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-[#111827]">Rotayı Kaydet</Text>
              <TouchableOpacity onPress={() => setSaveModalVisible(false)}>
                <Text className="text-[24px]">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-2 text-[13px] text-[#6b7280]">Oluşturduğunuz rotayı kaydedin ve daha sonra kullanın.</Text>

            <View className="mb-4">
              <Text className="mb-2 text-[14px] font-semibold text-[#111827]">Rota Adı *</Text>
              <TextInput
                value={routeName}
                onChangeText={setRouteName}
                placeholder="Örn: Tarihi Merkez Turu"
                placeholderTextColor="#9ca3af"
                className="rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2.5 text-[14px] text-[#111827]"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-[14px] font-semibold text-[#111827]">Açıklama</Text>
              <TextInput
                value={routeDescription}
                onChangeText={setRouteDescription}
                placeholder="Rota hakkında kısa açıklama"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2.5 text-[14px] text-[#111827]"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setSaveModalVisible(false)} className="flex-1 rounded-[10px] border border-[#e5e7eb] bg-white py-2.5">
                <Text className="text-center text-[14px] font-semibold text-[#111827]">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveRoute} className="flex-1 rounded-[10px] bg-[#dc2626] py-2.5">
                <Text className="text-center text-[14px] font-bold text-white">Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={shareModalVisible} transparent animationType="fade" onRequestClose={() => setShareModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[85%] rounded-[16px] bg-white px-6 py-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-[#111827]">Rotayı Paylaş</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Text className="text-[24px]">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-3 text-[13px] text-[#6b7280]">Oluşturduğunuz rotayı arkadaşlarınızla paylaşın.</Text>

            <View className="mb-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
              <Text className="mb-3 text-[14px] font-bold text-[#111827]">{routeName}</Text>
              <View className="gap-2">
                {plannedRoute.map((place, idx) => (
                  <Text key={place.id} className="text-[13px] text-[#6b7280]">
                    {idx + 1}. {place.name}
                  </Text>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setShareModalVisible(false)} className="flex-1 rounded-[10px] border border-[#e5e7eb] bg-white py-2.5">
                <Text className="text-center text-[14px] font-semibold text-[#111827]">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-[#dc2626] py-2.5">
                <IconSymbol name="square.and.arrow.up" size={16} color="#fff" />
                <Text className="text-center text-[14px] font-bold text-white">Paylaş</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
