
import { useAuth } from '@/components/auth/auth-context';
import ChatbotScreen from '@/components/chatbot/ChatbotScreen';
import AppHeader from '@/components/layout/Header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUpcomingEvents } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Modal, ScrollView, TouchableOpacity, View } from 'react-native';

import { fetchLiveWeather, fetchUsdTryRate } from '../../services/home-live-data';

const rotaIcon = require('../../assets/icon/rota.png');
const mapIcon = require('../../assets/icon/map.png');

const eventsIcon = require('../../assets/icon/events.png');
const groupsIcon = require('../../assets/icon/groups.png');
const editIcon = require('../../assets/icon/edit.png');
const star = require('../../assets/icon/stars.png');
const chatbotIcon = require('../../assets/chatbot/chatbot .png');

// Mock rotalar (backend veri yoksa gösterilecek)
const MOCK_ROUTES = [
  {
    id: 1,
    title: 'Tarihi Camiler Turu',
    time: '3 saat',
    stops: '8',
    distance: '5.2 km',
    rating: '4.8',
    badge: 'Kültür & Tarih',
    description: 'Selimiye, Üç Şerefeli, Eski Cami',
    image: require('../../assets/rota/camii.webp'),
  },
  {
    id: 2,
    title: 'Meriç Kıyısı Gezisi',
    time: '2.5 saat',
    stops: '6',
    distance: '4.8 km',
    rating: '4.5',
    badge: 'Doğa & Yürüyüş',
    description: 'Meriç Köprüsü, Tunca Nehri',
    image: require('../../assets/rota/meric.jpg'),
  },
];

// Dinamik subtitle mesajları
const SUBTITLE_MESSAGES = [
  '🗺️ Edirne\'de hazır rotaları keşfedin',
  '🎉 Bu hafta Edirne\'de hangi etkinlikler var?',
  '👥 Arkadaşlarınızın rotasını keşfedin.',
  '🏛️ Tarihi rotalarla Edirne\'yi gezin',
  '⭐ Popüler rotalara göz atın',
  '🎉 Yeni rotalar hazırlanmış',
];

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [weatherDescription, setWeatherDescription] = useState('Güncel');
  const [usdTryRate, setUsdTryRate] = useState<number | null>(null);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [routes, setRoutes] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      try {
        const [weather, currency] = await Promise.all([
          fetchLiveWeather(),
          fetchUsdTryRate(),
        ]);

        if (!isMounted) {
          return;
        }

        setTemperatureC(weather.temperatureC);
        setWeatherDescription(weather.description);
        setUsdTryRate(currency.usdTry);
      } catch {
        if (!isMounted) {
          return;
        }

        setTemperatureC(null);
        setUsdTryRate(null);
      }
    };

    loadLiveData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Günlük değişen subtitle mesajı
  useEffect(() => {
    const today = new Date().getDate();
    const messageIndex = today % SUBTITLE_MESSAGES.length;
    setSubtitleIndex(messageIndex);
  }, []);

  // Rotaları yükle (mock verisi)
  useEffect(() => {
    let isMounted = true;

    const loadRoutes = () => {
      if (isMounted) {
        setRoutes(MOCK_ROUTES.slice(0, 2));
        setRoutesLoading(false);
      }
    };

    loadRoutes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Yaklaşan etkinlikleri yükle
  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await getUpcomingEvents();
        if (isMounted) {
          setUpcomingEvents(Array.isArray(data) ? data.slice(0, 2) : []);
        }
      } catch {
        if (isMounted) {
          setUpcomingEvents([]);
        }
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const weatherChipText = useMemo(() => {
    if (temperatureC == null) {
      return '☁️ Hava yükleniyor';
    }

    return `☀️ ${Math.round(temperatureC)}° ${weatherDescription}`;
  }, [temperatureC, weatherDescription]);

  const currencyChipText = useMemo(() => {
    if (usdTryRate == null) {
      return '$ Kur yükleniyor';
    }

    return `$ USD ${usdTryRate.toFixed(2)}`;
  }, [usdTryRate]);

  return (
    <View className="flex-1 bg-[#f7f4f2]">
      {/* Chatbot Modal */}
      <Modal visible={chatbotModalOpen} animationType="slide">
        <ChatbotScreen onClose={() => setChatbotModalOpen(false)} />
      </Modal>

      <AppHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-24">
          <View className="relative overflow-hidden bg-[#c40018] pb-6">
            <View className="absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-white/10" />
            <View className="absolute -left-8 bottom-6 h-[90px] w-[90px] rounded-full bg-white/5" />

            <View className="px-5 pt-5">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center">
                    <Image source={star} className="mr-2 h-6 w-6" resizeMode="contain" style={{ tintColor: '#ffffff' }} />
                    <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="text-[28px] font-black leading-[32px] text-white">Keşfi Edirne</ThemedText>
                  </View>
                  <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="mt-1 text-[13px] leading-[18px] text-white/90">
                    Tarihi keşfedin, rotanızı planlayın
                  </ThemedText>
                </View>

              </View>

            
              <View className="rounded-[22px] border border-[#f1eaea] bg-white shadow-xl shadow-black/10">
                <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
                  <View className="flex-1 pr-3">
                    <ThemedText className="text-[27px] font-extrabold text-[#202020]">Bugün nereyi keşfedelim?</ThemedText>
                    <ThemedText className="mt-1 text-[13px] text-[#6f6f6f]">{SUBTITLE_MESSAGES[subtitleIndex]}</ThemedText>
                  </View>

                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1]">
                    <IconSymbol name="arrow.right" size={20} color="#d32f2f" />
                  </View>
                </View>

                <View className="mx-5 h-[1px] bg-[#f1eded]" />

                <View className="flex-row flex-wrap px-4 pb-3 pt-3 ">
                  <View className="mb-2 mr-2 rounded-full border border-[#ffd1cf] bg-[#fff3f2] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#ff7a59]">{weatherChipText}</ThemedText>
                  </View>
                  <View className="mb-2 ml-5 rounded-full border border-[#cfead6] bg-[#eef9f0] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#1b8f49]">{currencyChipText}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-2 flex-row flex-wrap justify-between px-4">
            <Link href="/explore" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4 shadow-lg shadow-black/10">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff4f4]">
                  <Image source={mapIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Harita</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Kendi rotanızı planlayın.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/rota" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4 shadow-lg shadow-black/10">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff6ea]">
                  <Image source={rotaIcon} className="h-6 w-6" resizeMode="contain" style={{ tintColor: '#d08a1f' }} />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Rotalar</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Özel hazırlanmış hazır rotalar.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/events" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4 shadow-lg shadow-black/10">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#edf5ff]">
                  <Image source={eventsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Etkinlikler</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Bölgenizde olan etkinlikler.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/community" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4 shadow-lg shadow-black/10">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#f5edff]">
                  <Image source={groupsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Topluluk</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Toplulukla paylaşılan rotalara ulaşın.</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mx-4 mb-4 mt-0.5 rounded-[18px] border border-[#ffd4cf] bg-[#fff6f4] p-4">
            <View className="mb-2.5 flex-row items-start">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-[14px] bg-[#e53935]">
                <Image source={editIcon} className="h-5 w-5" resizeMode="contain" style={{ tintColor: '#ffffff' }} />
              </View>
              <View className="flex-1">
                <ThemedText className="mb-1 text-base font-extrabold text-[#e53935]">Neden Üye Olmalısınız?</ThemedText>
                <ThemedText className="text-[13px] leading-[18px] text-[#9b4c42]">
                  Kendi rotalarınızı oluşturun, favorilerinizi kaydedin ve rozet kazanın
                </ThemedText>
              </View>
            </View>

            <View className="mb-3">
              <ThemedText className="mb-1.5 text-[13px] text-[#2e7d32]">✓ Özel rota oluşturma ve kaydetme</ThemedText>
              <ThemedText className="mb-1.5 text-[13px] text-[#2e7d32]">✓ Rotalarınızı toplulukla paylaşma</ThemedText>
              <ThemedText className="text-[13px] text-[#2e7d32]">✓ Rozet kazanma ve ilerleme takibi</ThemedText>
            </View>

            <TouchableOpacity className="items-center rounded-[14px] bg-[#e53935] py-3">
              <ThemedText className="text-[15px] font-extrabold text-white">Ücretsiz Üye Ol</ThemedText>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#eee5e2] bg-white p-4 shadow-lg shadow-black/10">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#222]">Popüler Rotalar</ThemedText>
              <Link href="/rota" asChild>
                <TouchableOpacity>
                  <ThemedText className="text-[13px] font-bold text-[#d32f2f]">Tümü →</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            {routesLoading ? (
              <ThemedText className="text-[12px] text-[#888]">Rotalar yükleniyor...</ThemedText>
            ) : routes.length > 0 ? (
              routes.map((route: any) => (
                <TouchableOpacity 
                  key={route.id} 
                  onPress={() => router.push({ pathname: '/(tabs)/route-detail', params: { id: route.id } } as any)}
                  className="mb-3 overflow-hidden rounded-xl border border-[#f1eeee] bg-white shadow-md shadow-black/5"
                >
                  {route.image && (
                    <Image source={route.image} className="h-24 w-full" />
                  )}
                  <View className="p-3">
                    <ThemedText className="mb-1 text-sm font-extrabold text-[#222]">{route.title || 'Rota'}</ThemedText>
                    <View className="mb-1.5 flex-row flex-wrap gap-1">
                      <ThemedText className="text-xs text-[#666]">🕒 {route.time || 'N/A'}</ThemedText>
                      <ThemedText className="text-xs text-[#666]">📍 {route.stops} durak</ThemedText>
                    </View>
                    <ThemedText className="text-xs text-[#999]">{route.distance || 'N/A'} · ⭐ {route.rating || '0'}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText className="text-[12px] text-[#888]">Rota bulunamadı</ThemedText>
            )}
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#eee5e2] bg-white p-4 shadow-lg shadow-black/10">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#222]">Yaklaşan Etkinlikler</ThemedText>
              <Link href="/events" asChild>
                <TouchableOpacity>
                  <ThemedText className="text-[13px] font-bold text-[#d32f2f]">Tümü →</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            {eventsLoading ? (
              <ThemedText className="text-[12px] text-[#888]">Etkinlikler yükleniyor...</ThemedText>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: any) => (
                <TouchableOpacity key={event.id} className="mb-2 flex-row items-center rounded-xl border border-[#f1eeee] bg-white p-2.5">
                  <View className="flex-1 px-2.5">
                    <ThemedText className="mb-0.5 text-sm font-extrabold text-[#222]">{event.title || 'Etkinlik'}</ThemedText>
                    <ThemedText className="text-xs text-[#888]">{event.category || 'Kategori'} · {event.date || 'Tarih bilgisi yok'}</ThemedText>
                  </View>
                  <IconSymbol name="calendar" size={22} color="#d32f2f" />
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText className="text-[12px] text-[#888]">Etkinlik bulunamadı</ThemedText>
            )}
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#ddc7f2] bg-[#f6edff] p-4 shadow-lg shadow-black/10">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#8e24aa]">Topluluk Rotaları</ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-[13px] font-bold text-[#8e24aa]">Keşfet →</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText className="mb-2.5 text-[13px] leading-[18px] text-[#8e24aa]">
              Diğer gezginlerin paylaştığı rotaları keşfedin ve kendi rotalarınızı paylaşın
            </ThemedText>

            <TouchableOpacity className="items-center rounded-xl bg-[#8e24aa] py-2.5">
              <ThemedText className="text-sm font-extrabold text-white">Topluluğu Gör</ThemedText>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#ffd9d2] bg-[#fff6f2] p-4">
            <ThemedText className="mb-1 text-[15px] font-extrabold text-[#d32f2f]">Edirne Hakkında</ThemedText>
            <ThemedText className="text-[13px] leading-[18px] text-[#d32f2f]">
              Tarihi ve kültürel zenginlikleriyle UNESCO Dünya Mirası Listesi'nde yer alan Edirne, Mimar Sinan'ın
              ustalık eseri Selimiye Camii ve Kırkpınar Yağlı Güreşleri ile ünlüdür.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {isAuthenticated && (
        <TouchableOpacity
          onPress={() => setChatbotModalOpen(true)}
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            right: 18,
            bottom: 32,
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: '#b10016',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            zIndex: 20,
          }}
        >
          <Image source={chatbotIcon} className="h-9 w-9" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}