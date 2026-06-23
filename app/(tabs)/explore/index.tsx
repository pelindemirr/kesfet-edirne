import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getPlaces, type PlaceApiItem } from '@/services/api/endpoints/places';
import { useAuthStore } from '@/stores/use-auth-store';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Backend Servisleri
import { getFavoritePlaces } from '@/services/api/endpoints/actions';
import { createUserRoute, shareUserRoute, togglePlaceFavorite } from '@/services/api/endpoints/user-routes';

type MapPin = {
  id: number | string;
  name: string;
  latitude: number;
  longitude: number;
};

function buildMapHtml(pins: MapPin[]) {
  const safePinsJson = JSON.stringify(pins);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #efe7d7;
      }
      #map {
        position: relative;
        height: 100%;
        width: 100%;
      }
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
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const pins = ${safePinsJson};
      const defaultCenter = [41.6766, 26.5557];
      const defaultZoom = 13;

      const map = L.map('map', {
        zoomControl: false,
        preferCanvas: true,
        touchZoom: true,
        doubleClickZoom: true,
        dragging: true,
      }).setView(defaultCenter, defaultZoom);
      window.__EDIRNE_MAP__ = map;

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
      window.__EDIRNE_MARKERS__ = {};

      if (pins.length > 0) {
        const latLngs = [];

        pins.forEach((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
          }

          const marker = L.marker([lat, lng], { icon }).addTo(map).bindPopup('<b>' + (place.name || 'Mekan') + '</b>');
          latLngs.push([lat, lng]);
          try { window.__EDIRNE_MARKERS__[String(place.id)] = marker; } catch (e) {}
          marker.on('click', () => marker.openPopup());
        });

        if (latLngs.length > 0) {
          map.fitBounds(latLngs, { padding: [24, 24] });
        }
      } else {
        const m = L.marker(defaultCenter, { icon }).addTo(map).bindPopup('<b>Merkez</b>');
        try { window.__EDIRNE_MARKERS__['center'] = m; } catch (e) {}
      }

      window.__EDIRNE_OPEN_MARKER__ = function(id) {
        try {
          const m = window.__EDIRNE_MARKERS__[String(id)];
          if (m) {
            map.setView(m.getLatLng(), 16);
            m.openPopup();
          }
        } catch (e) { console.error(e); }
      };

      const fixSize = () => map.invalidateSize(true);
      window.addEventListener('load', () => setTimeout(fixSize, 120));
      window.addEventListener('resize', fixSize);
    </script>
  </body>
</html>`;
}

const districts = ['Merkez', 'Enez', 'İpsala', 'Süloğlu', 'Uzunköprü', 'Lalapaşa', 'Keşan', 'Meriç','Havsa'];
const allCategories = ['Tüm Kategoriler', 'Tarih & Kültür', 'Müze', 'Doğa & Gezi', 'Yemek & Gastronomi', 'Alışveriş'];

type PlaceItem = {
  id: number | string;
  name: string;
  category: string;
  district: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string;
};

const badgeClassByCategory: Record<string, string> = {
  'Tarih & Kültür': 'bg-[#fff3c6] text-[#d39b00]',
  'Yemek & Gastronomi': 'bg-[#ffe9dd] text-[#d96a11]',
  'Müze': 'bg-[#e8f0ff] text-[#3c6fd9]',
  'Doğa & Gezi': 'bg-[#def7e9] text-[#11885b]',
  'Alışveriş': 'bg-[#eef2ff] text-[#4f46e5]',
};

const categoryParamByLabel: Record<string, string | undefined> = {
  'Tüm Kategoriler': undefined,
  'Tarih & Kültür': 'Tarih & Kültür',
  'Müze': 'Müze',
  'Doğa & Gezi': 'Doğa & Gezi',
  'Yemek & Gastronomi': 'Yemek & Gastronomi',
  'Alışveriş': 'Alışveriş',
};

export default function AccountExploreScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);
  const mapWebViewRef = useRef<WebView>(null);
  const [favorites, setFavorites] = useState<PlaceItem[]>([]);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false); 
  const [plannedRoute, setPlannedRoute] = useState<PlaceItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Merkez');
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [routeName, setRouteName] = useState('Örn: Tarihi Merkez Turu');
  const [routeDescription, setRouteDescription] = useState('');
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | string | null>(null);
  const [creatingRoute, setCreatingRoute] = useState(false);
  const [createdRouteId, setCreatedRouteId] = useState<number | string | null>(null);
  const [sharingRoute, setSharingRoute] = useState(false);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  const mapHtml = useMemo(() => {
    const pins = places
      .map((place) => ({
        id: place.id,
        name: place.name,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
      }))
      .filter((pin) => !Number.isNaN(pin.latitude) && !Number.isNaN(pin.longitude));

    return buildMapHtml(pins);
  }, [places]);

  const selectedCategoryParam = categoryParamByLabel[selectedCategory];

  const isFavorite = (placeId: number | string) => 
    favorites.some((fav) => String(fav.id) === String(placeId));

  const isInRoute = (placeId: number | string) => plannedRoute.some((p) => String(p.id) === String(placeId));

  // Rota paylaşıldıktan sonra tüm alanları sıfırlayan yardımcı fonksiyon
  const clearPlannedRouteData = () => {
    setPlannedRoute([]);
    setRouteName('Örn: Tarihi Merkez Turu');
    setRouteDescription('');
    setCreatedRouteId(null);
  };

  // 📥 Favorileri her girişte güncelleyen kanca
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadUserFavorites = async () => {
        if (!authUser?.id) return;

        try {
          const response = await getFavoritePlaces(authUser.id, authToken ?? undefined);
          
          if (!mounted) return;

          if (response.status === 200 || response.status === 'success' || response.bodyStatus === 'success') {
            let rawData = response.data;

            if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
              rawData = Object.keys(rawData)
                .filter((key) => !isNaN(Number(key)))
                .map((key) => (rawData as any)[key]);
            }

            if (Array.isArray(rawData)) {
              const mappedFavorites = rawData.map((item: any, index: number) => ({
                id: item.id ?? index,
                name: item.name ?? 'Mekan',
                category: item.category ?? 'Tarih & Kültür',
                district: item.district ?? 'Merkez',
                description: item.description ?? '',
                latitude: item.latitude != null ? Number(item.latitude) : item.lat != null ? Number(item.lat) : null,
                longitude: item.longitude != null ? Number(item.longitude) : item.lng != null ? Number(item.lng) : null,
              }));

              setFavorites(mappedFavorites);
            }
          }
        } catch (error) {
          console.error('[EXPLORE_FAVORITES] favoriler yüklenirken hata oluştu:', error);
        }
      };

      loadUserFavorites();

      return () => {
        mounted = false;
      };
    }, [authUser?.id, authToken])
  );

  // 🗺️ Gezilecek yerleri her girişte ve filtre değişiminde güncelleyen kanca
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadPlaces = async () => {
        try {
          setPlacesLoading(true);
          setPlacesError(null);

          const response = await getPlaces({
            district: selectedDistrict,
            category: selectedCategoryParam,
            search: searchQuery,
          });

          if (!mounted) return;

          if (response.status === 200 || response.bodyStatus === 'success') {
            let responseData: any = undefined;
            if (response && Object.prototype.hasOwnProperty.call(response, 'data')) {
              responseData = (response as any).data;
            } else {
              const clone = { ...(response as any) };
              delete clone.status;
              delete clone.bodyStatus;
              responseData = clone;
            }

            let itemsRaw: PlaceApiItem[] = [];

            if (Array.isArray(responseData)) {
              itemsRaw = responseData as PlaceApiItem[];
            } else if (responseData && typeof responseData === 'object') {
              if (Array.isArray((responseData as any).places)) {
                itemsRaw = (responseData as any).places as PlaceApiItem[];
              } else {
                const vals = Object.values(responseData as any).filter((v) => v && typeof v === 'object');
                itemsRaw = vals as PlaceApiItem[];
              }
            }

            const mapped = itemsRaw.map((item, index) => ({
              id: item.id ?? index,
              name: item.name ?? item.title ?? 'Mekan',
              category: item.category ?? (item as any).type ?? 'Tarih & Kültür',
              district: item.district ?? selectedDistrict,
              description: item.description ?? item.address ?? '',
              latitude: item.latitude != null ? Number(item.latitude) : (item as any).lat != null ? Number((item as any).lat) : null,
              longitude: item.longitude != null ? Number(item.longitude) : (item as any).lng != null ? Number((item as any).lng) : null,
              image: item.image ?? item.image_url,
              ...(item as any),
            }));
            
            setPlaces(mapped as PlaceItem[]);
          } else {
            setPlaces([]);
            setPlacesError(response.message || response.error || 'Mekanlar yüklenemedi.');
          }
        } catch (error) {
          if (!mounted) return;
          setPlaces([]);
          setPlacesError('Mekanlar yüklenemedi.');
          console.error('[EXPLORE_PLACES] loadPlaces error', error);
        } finally {
          if (mounted) {
            setPlacesLoading(false);
          }
        }
      };

      const timer = setTimeout(() => {
        void loadPlaces();
      }, 250);

      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }, [searchQuery, selectedCategoryParam, selectedDistrict])
  );

  // ❤️ Favori aksiyonu
  const toggleFavorite = (place: PlaceItem) => {
    if (!authUser?.id) {
      Alert.alert('Giriş gerekli', 'Favorilemek için giriş yapmalısınız.');
      return;
    }

    if (favoriteLoadingId !== null) return;

    const userId = Number(authUser.id);
    if (Number.isNaN(userId)) {
      Alert.alert('Hata', 'Kullanıcı bilgisi okunamadı.');
      return;
    }

    const isCurrentlyFavorite = favorites.some((fav) => String(fav.id) === String(place.id));
    const previousFavorites = favorites;

    setFavoriteLoadingId(place.id);
    
    setFavorites((current) =>
      isCurrentlyFavorite 
        ? current.filter((fav) => String(fav.id) !== String(place.id)) 
        : [...current, place],
    );

    void (async () => {
      try {
        const response = await togglePlaceFavorite(userId, place.id);
        const success = response.status === 200 || response.status === 201 || response.bodyStatus === 'success' || response.success === true;

        if (!success) {
          setFavorites(previousFavorites);
          Alert.alert('Hata', response.message || response.error || 'Favori durumu güncellenemedi.');
        }
      } catch (error) {
        setFavorites(previousFavorites);
        Alert.alert('Hata', 'Favori durumu güncellenemedi.');
        console.error('[EXPLORE_PLACES] toggleFavorite error', error);
      } finally {
        setFavoriteLoadingId(null);
      }
    })();
  };

  const addToRoute = (place: PlaceItem) => {
    if (!plannedRoute.find((p) => String(p.id) === String(place.id))) {
      setPlannedRoute([...plannedRoute, place]);
    }
  };

  const removeFromRoute = (placeId: number | string) => {
    setPlannedRoute(plannedRoute.filter((p) => String(p.id) !== String(placeId)));
  };

  const zoomInMap = () => {
    mapWebViewRef.current?.injectJavaScript('window.__EDIRNE_MAP__ && window.__EDIRNE_MAP__.zoomIn(); true;');
  };

  const zoomOutMap = () => {
    mapWebViewRef.current?.injectJavaScript('window.__EDIRNE_MAP__ && window.__EDIRNE_MAP__.zoomOut(); true;');
  };

  const openMarker = (placeId: number | string) => {
    const safeId = String(placeId);
    const js = `window.__EDIRNE_OPEN_MARKER__ && window.__EDIRNE_OPEN_MARKER__(${JSON.stringify(safeId)}); true;`;
    mapWebViewRef.current?.injectJavaScript(js);
  };

  const handleSaveRoute = async () => {
    if (!authUser?.id) {
      Alert.alert('Giriş gerekli', 'Rota oluşturmak için giriş yapmalısınız.');
      return;
    }

    if (plannedRoute.length === 0) {
      Alert.alert('Rota boş', 'Kaydetmek için en az bir mekan eklemelisiniz.');
      return;
    }

    const userId = Number(authUser.id);
    if (Number.isNaN(userId)) {
      Alert.alert('Hata', 'Kullanıcı bilgisi okunamadı.');
      return;
    }

    const safeRouteName = routeName.trim();
    const routeTitle = safeRouteName && !safeRouteName.toLocaleLowerCase('tr-TR').startsWith('örn:') ? safeRouteName : 'Tarihi Merkez Turu';
    const placeIds = plannedRoute.map((place) => Number(place.id)).filter((placeId) => !Number.isNaN(placeId));

    if (placeIds.length === 0) {
      Alert.alert('Hata', 'Rota için geçerli mekan bulunamadı.');
      return;
    }

    try {
      setCreatingRoute(true);

      const response = await createUserRoute(
        {
          user_id: userId,
          route_name: routeTitle,
          description: routeDescription.trim(),
          places: placeIds,
        },
        authToken ?? undefined,
      );

      const createdId =
        response.route_id ??
        response.routeId ??
        (response.data && typeof response.data === 'object'
          ? (response.data as any).route_id ?? (response.data as any).routeId
          : null);

      const success = response.status === 200 || response.status === 201 || response.bodyStatus === 'success' || response.success === true;
      if (!success) {
        Alert.alert('Hata', response.message || response.error || 'Rota kaydedilemedi.');
        return;
      }

      if (createdId != null) {
        setCreatedRouteId(createdId);
      }

      Alert.alert('Başarılı', 'Rota oluşturuldu. Şimdi bunu arkadaşlarınla paylaşabilir veya topluluğa açabilirsin.');
      setSaveModalVisible(false);
      setShareModalVisible(true); 
    } catch (error) {
      Alert.alert('Hata', 'Rota kaydedilemedi.');
      console.error('[EXPLORE_PLACES] handleSaveRoute error', error);
    } finally {
      setCreatingRoute(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (plannedRoute.length === 0) return;

    const safeRouteName = routeName.trim();
    const routeTitle = safeRouteName && !safeRouteName.toLocaleLowerCase('tr-TR').startsWith('örn:') ? safeRouteName : 'Tarihi Edirne Turu';
    
    let message = `*📍 Keşfet Edirne - Rota Planı: ${routeTitle}*\n`;
    if (routeDescription.trim()) {
      message += `_${routeDescription.trim()}_\n\n`;
    } else {
      message += `\n`;
    }
    
    plannedRoute.forEach((place, idx) => {
      message += `${idx + 1}. ${place.name} (${place.district} • ${place.category})\n`;
    });

    message += `\n📲 _Keşfet Edirne uygulaması ile hazırlandı._`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        setShareModalVisible(false);
        clearPlannedRouteData(); // 🌟 Paylaşıldıktan sonra rotayı temizler
      } else {
        const webUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
        setShareModalVisible(false);
        clearPlannedRouteData(); // 🌟 Paylaşıldıktan sonra rotayı temizler
      }
    } catch (error) {
      Alert.alert('Hata', 'WhatsApp paylaşımı başlatılamadı.');
    }
  };

  const handleShareToCommunity = async () => {
    if (!createdRouteId) {
      Alert.alert('Önce kaydedin', 'Topluluğa açmak için önce rotayı kaydetmelisiniz.');
      return;
    }

    try {
      setSharingRoute(true);
      const response = await shareUserRoute(createdRouteId, authToken ?? undefined);
      const success = response.status === 200 || response.status === 201 || response.bodyStatus === 'success' || response.success === true;

      if (!success) {
        Alert.alert('Hata', response.message || response.error || 'Rota topluluğa açılamadı.');
        return;
      }

      Alert.alert('Başarılı', 'Rota başarıyla Keşfet Edirne topluluğuna açıldı.');
      setShareModalVisible(false);
      clearPlannedRouteData(); // 🌟 Topluluğa açıldıktan sonra rotayı temizler
    } catch (error) {
      Alert.alert('Hata', 'Rota topluluğa açılamadı.');
      console.error('[EXPLORE_PLACES] handleShareToCommunity error', error);
    } finally {
      setSharingRoute(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f7f4f2]">
        <Header />
        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full max-w-[360px] rounded-[18px] border border-[#ffd6d6] bg-white p-5">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-[14px] bg-[#fef2f2]">
              <IconSymbol name="lock.fill" size={24} color="#dc2626" />
            </View>
            <Text className="mb-1 text-[20px] font-bold text-[#111827]">Harita için giriş gerekli</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              Rota oluşturmak ve kaydetmek için giriş yapabilirsiniz. Giriş yaptıktan sonra harita ve rota planlama açılır.
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="items-center rounded-[12px] bg-[#dc2626] py-3">
              <Text className="text-[14px] font-bold text-white">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f7f4f2]">
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="px-3 pt-3">
          <View className="mb-3">
            <Text className="text-[22px] font-bold text-black">Rota Planlama</Text>
          </View>

          {/* Filtre Modalları */}
          <Modal visible={filtersModalVisible} animationType="slide" transparent onRequestClose={() => setFiltersModalVisible(false)}>
            <View className="flex-1 justify-end">
              <View className="h-[70%] w-full rounded-t-[18px] bg-white p-5 shadow-xl">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-[18px] font-bold">Filtreler</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => setSelectedCategory('Tüm Kategoriler')}>
                      <Text className="text-[14px] text-[#6b7280]">Temizle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFiltersModalVisible(false)}>
                      <Text className="text-[16px]">Kapat</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text className="mb-2 text-[14px] font-semibold">Kategoriler</Text>
                  <View className="mb-4">
                    {allCategories.map((cat) => (
                      <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} className={`mb-2 rounded-[10px] px-4 py-3 ${selectedCategory === cat ? 'bg-[#fff1f2] border border-[#fca5a5]' : 'bg-white border border-[#e6e6e6]'}`}>
                        <Text className={`${selectedCategory === cat ? 'text-[#b91c1c] font-semibold' : 'text-[#4b5563]'}`}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => setFiltersModalVisible(false)} className="flex-1 rounded-[10px] border border-[#e5e7eb] bg-white py-3">
                    <Text className="text-center text-[14px] text-[#111827]">İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFiltersModalVisible(false)} className="flex-1 rounded-[10px] bg-[#dc2626] py-3">
                    <Text className="text-center text-[14px] text-white">Uygula</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={districtModalVisible} animationType="slide" transparent onRequestClose={() => setDistrictModalVisible(false)}>
            <View className="flex-1 justify-end">
              <View className="h-[45%] w-full rounded-t-[18px] bg-white p-5 shadow-xl">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-[18px] font-bold">İlçe Seç</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => { setSelectedDistrict('Merkez'); setDistrictModalVisible(false); }}>
                      <Text className="text-[14px] text-[#6b7280]">Temizle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
                      <Text className="text-[16px]">Kapat</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                  {districts.map((d) => (
                    <TouchableOpacity key={d} onPress={() => { setSelectedDistrict(d); setDistrictModalVisible(false); }} className={`mb-3 rounded-[10px] px-4 py-3 ${selectedDistrict === d ? 'bg-[#fff1f2] border border-[#fca5a5]' : 'bg-white border border-[#e6e6e6]'}`}>
                      <Text className={`${selectedDistrict === d ? 'text-[#b91c1c] font-semibold' : 'text-[#4b5563]'}`}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          <View className="mb-3 flex-row gap-2">
            <TouchableOpacity 
              onPress={() => setDistrictModalVisible(true)} 
              className="flex-1 flex-row items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm"
            >
              <View>
                <Text className="text-[11px] text-[#9ca3af] uppercase font-bold tracking-wider mb-0.5">İlçe</Text>
                <Text className="text-[14px] font-semibold text-[#111827]">{selectedDistrict}</Text>
              </View>
              <Text className="text-[14px] text-[#9ca3af] font-bold pr-1">▼</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setFiltersModalVisible(true)} 
              className="flex-1 flex-row items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm"
            >
              <View>
                <Text className="text-[11px] text-[#9ca3af] uppercase font-bold tracking-wider mb-0.5">Kategori</Text>
                <Text className="text-[14px] font-semibold text-[#111827]" numberOfLines={1}>{selectedCategory}</Text>
              </View>
              <Text className="text-[14px] text-[#9ca3af] font-bold pr-1">▼</Text>
            </TouchableOpacity>
          </View>

          {/* Harita Alanı */}
          <View className="relative mb-4 overflow-hidden rounded-[12px] border border-[#e8e3da] bg-[#efe7d7]">
            <WebView
              ref={mapWebViewRef}
              source={{ html: mapHtml }}
              style={{ width: '100%', height: 210, backgroundColor: '#efe7d7' }}
              scalesPageToFit={false}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              scrollEnabled={false}
              nestedScrollEnabled
            />

            <View className="absolute right-2 top-2 overflow-hidden rounded-[8px] border border-[#d1d5db] bg-white">
              <TouchableOpacity onPress={zoomInMap} className="h-8 w-8 items-center justify-center border-b border-[#e5e7eb]">
                <Text className="text-[18px] font-bold text-[#111827]">+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={zoomOutMap} className="h-8 w-8 items-center justify-center">
                <Text className="text-[18px] font-bold text-[#111827]">-</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Arama Barı */}
          <View className="mb-4 flex-row items-center rounded-[10px] bg-white px-3 py-2.5">
            <IconSymbol name="magnifyingglass" size={18} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Yer ara..."
              placeholderTextColor="#9ca3af"
              className="ml-2 flex-1 text-[14px] text-[#111827]"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2 rounded-full px-2 py-1 bg-[#f1f5f9]">
                <Text className="text-[13px] text-[#6b7280]">Temizle</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ⭐ Favoriler Bölümü */}
          {favorites.length > 0 && (
            <View className="mb-4 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <TouchableOpacity 
                onPress={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
                className="flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="heart.fill" size={20} color="#dc2626" />
                  <Text className="text-[16px] font-bold text-[#dc2626]">Favorileriniz ({favorites.length})</Text>
                </View>
                <Text className="text-[16px] font-bold text-[#dc2626]">
                  {isFavoritesExpanded ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isFavoritesExpanded && (
                <View className="gap-2 mt-3">
                  {favorites.map((favorite) => (
                    <View key={favorite.id} className="flex-row items-center justify-between rounded-[10px] border border-[#fca5a5] bg-white px-3 py-2.5">
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
              )}
            </View>
          )}

          {/* 🗺️ Rota Bölümü */}
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
                <TouchableOpacity onPress={() => setSaveModalVisible(true)} className="flex-grow rounded-[10px] bg-[#dc2626] py-2.5">
                  <Text className="text-center text-[14px] font-bold text-white">Kaydet ve Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 🏛️ Gezilecek Yerler Listesi */}
          <Text className="mb-3 text-[18px] font-bold text-[#111827]">Gezilecek Yerler ({places.length})</Text>

          <View className="gap-3">
            {placesLoading ? (
              <View className="rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-5">
                <ActivityIndicator color="#dc2626" />
                <Text className="mt-2 text-[13px] text-[#6b7280]">Yerler yükleniyor...</Text>
              </View>
            ) : null}

            {placesError ? (
              <View className="rounded-[14px] border border-[#fecaca] bg-[#fff1f2] px-4 py-4">
                <Text className="text-[14px] font-semibold text-[#b91c1c]">{placesError}</Text>
              </View>
            ) : null}

            {places.map((place) => {
              const badgeClass = badgeClassByCategory[place.category] ?? badgeClassByCategory['Tarih & Kültür'];

              return (
                <TouchableOpacity 
                  key={place.id} 
                  onPress={() => openMarker(place.id)} 
                  className="rounded-[14px] border border-[#e5e7eb] bg-white p-3 mb-1 shadow-sm"
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <View className="w-10 h-10 items-center justify-center shrink-0">
                      {place.image ? (
                        <View className="h-10 w-10 overflow-hidden rounded-full bg-[#f3f4f6] items-center justify-center">
                          <Text className="text-[18px]">📷</Text>
                        </View>
                      ) : (
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6]">
                          <Text className="text-[18px]">{(place as any).icon ?? '📍'}</Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1 px-2 justify-center">
                      <View className="flex-row mb-1">
                        <View className={`rounded-full px-2 py-0.5 ${badgeClass}`}>
                          <Text className="text-[10px] font-semibold">{place.category}</Text>
                        </View>
                      </View>
                      <Text className="text-[15px] font-semibold text-[#111827] leading-5 mb-0.5" numberOfLines={2}>
                        {place.name}
                      </Text>
                      <Text className="text-[12px] text-[#6b7280]" numberOfLines={1}>
                        {place.description}
                      </Text>
                      <Text className="mt-0.5 text-[11px] text-[#9ca3af]" numberOfLines={1}>
                        {place.district} {place.latitude ? `• ${place.latitude}, ${place.longitude}` : ''}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2 shrink-0 ml-1">
                      <TouchableOpacity
                        onPress={() => toggleFavorite(place)}
                        className={`h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-white ${favoriteLoadingId === place.id ? 'opacity-60' : ''}`}
                        disabled={favoriteLoadingId === place.id}
                      >
                        <IconSymbol name={isFavorite(place.id) ? 'heart.fill' : 'heart'} size={15} color={isFavorite(place.id) ? '#dc2626' : '#94a3b8'} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => addToRoute(place)}
                        className={`rounded-[8px] border h-8 justify-center px-2.5 ${isInRoute(place.id) ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#d1d5db] bg-white'}`}
                      >
                        <Text className={`text-[12px] font-semibold ${isInRoute(place.id) ? 'text-[#22c55e]' : 'text-[#111827]'}`}>
                          {isInRoute(place.id) ? 'Eklendi' : 'Ekle'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Rota Kaydetme Modalı */}
      <Modal visible={saveModalVisible} transparent animationType="fade" onRequestClose={() => setSaveModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[85%] rounded-[16px] bg-white px-6 py-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-[#111827]">Rotayı Kaydet</Text>
              <TouchableOpacity onPress={() => setSaveModalVisible(false)}>
                <Text className="text-[24px]">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-2 text-[13px] text-[#6b7280]">Paylaşım seçeneklerini açmadan önce rotayı profilinizeline kaydedin.</Text>

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
              <TouchableOpacity onPress={() => { void handleSaveRoute(); }} disabled={creatingRoute} className={`flex-1 rounded-[10px] bg-[#dc2626] py-2.5 ${creatingRoute ? 'opacity-70' : ''}`}>
                <Text className="text-center text-[14px] font-bold text-white">{creatingRoute ? 'Kaydediliyor...' : 'Kaydet'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Seçenekli Paylaşma Modalı */}
      <Modal visible={shareModalVisible} transparent animationType="fade" onRequestClose={() => setShareModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[85%] rounded-[16px] bg-white px-6 py-5">
            <View className="mb-3 flex-row items-center justify-between border-b border-[#f3f4f6] pb-2">
              <Text className="text-[18px] font-bold text-[#111827]">Rotayı Paylaş</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Text className="text-[20px] font-bold text-[#9ca3af]">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-4 text-[13px] text-[#6b7280]">
              Oluşturduğunuz rotayı arkadaşlarınızla doğrudan paylaşabilir veya Keşfet Edirne topluluğuna açabilirsiniz.
            </Text>

            <TouchableOpacity 
              onPress={handleWhatsAppShare}
              className="mb-3 flex-row items-center rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-3.5 active:bg-[#dcfce7]"
            >
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-lg bg-[#22c55e]">
                <Text className="text-white font-bold text-[18px]">💬</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-[#14532d]">WhatsApp ile Gönder</Text>
                <Text className="text-[11px] text-[#166534]">Arkadaşlarına liste mesajı olarak ilet.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleShareToCommunity}
              disabled={sharingRoute}
              className={`mb-4 flex-row items-center rounded-xl border border-[#fca5a5] bg-[#fff5f5] p-3.5 active:bg-[#ffe4e4] ${sharingRoute ? 'opacity-50' : ''}`}
            >
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-lg bg-[#dc2626]">
                <IconSymbol name="person.3.fill" size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-[#7f1d1d]">{sharingRoute ? 'Açılıyor...' : 'Topluluğa Aç'}</Text>
                <Text className="text-[11px] text-[#991b1b]">Uygulamadaki diğer gezginler görebilsin.</Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => setShareModalVisible(false)} 
                className="flex-1 rounded-[10px] border border-[#e5e7eb] bg-gray-50 py-2.5"
              >
                <Text className="text-center text-[14px] font-semibold text-[#4b5563]">Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}