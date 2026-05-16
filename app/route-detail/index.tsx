import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import Header from '@/components/layout/Header';

// Mock rotalar verileri
const MOCK_ROUTES_DATA = [
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
    about: 'Edirne\'nin en önemli tarihi yapılarını kapsayan, şehrin ruhunu hissedeceğiniz merkez rota. Mimar Sinan\'ın izinden giderek eşsiz camileri ve çarşıları keşfedin.',
    routeStops: [
      { id: 1, name: 'Selimiye Camii', desc: "Mimar Sinan'ın ustalık eseri", time: '45 dk' },
      { id: 2, name: 'Eski Camii', desc: 'Erken Osmanlı mimarisi', time: '30 dk' },
      { id: 3, name: 'Üç Şerefeli Camii', desc: 'Görkemli minareler', time: '40 dk' },
    
    ],
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
    about: 'Doğanın güzelliği içinde rehayete çıktığınız, Meriç Nehri\'nin keyifli yürüyüşleri. Şehrin kalkışından uzak, huzurlu bir rota deneyimi.',
    routeStops: [
      { id: 1, name: 'Meriç Köprüsü', desc: 'Tarihi köprü', time: '30 dk' },
      { id: 2, name: 'Tunca Nehri', desc: 'Dinlenme ve piknik alanı', time: '45 dk' },
     
    ],
  },
  {
    id: 3,
    title: 'Osmanlı Çarşı Turu',
    time: '2 saat',
    stops: '5',
    distance: '2.1 km',
    rating: '4.6',
    badge: 'Kültür & Tarih',
    description: 'Bedesten, Alipaşa ve Arasta Çarşısı',
    image: require('../../assets/rota/meric.jpg'),
    about: 'Osmanlı döneminin ticari merkezi olan çarşıları keşfederek tarihi alışveriş deneyimini yaşayın.',
    routeStops: [
      { id: 1, name: 'Bedesten', desc: 'Osmanlı döneminin ticari merkezi', time: '35 dk' },
      { id: 2, name: 'Alipaşa Çarşısı', desc: 'Geleneksel kumaş ve baharat satıcıları', time: '30 dk' },
      { id: 3, name: 'Arasta Çarşısı', desc: 'Antika ve el sanatları', time: '40 dk' },
     
    ],
  },
  {
    id: 4,
    title: 'Edirne Lezzetleri Rotası',
    time: '3.5 saat',
    stops: '7',
    distance: '3.0 km',
    rating: '4.9',
    badge: 'Yeme & İçme',
    description: 'Aydın Ciğer, Tadım Menemen, Ondo Dondurma',
    image: require('../../assets/rota/meric.jpg'),
    about: 'Edirne\'nin meşhur lezzetlerini tatarak yerel mutfağın tadını çıkarın. Ciğer, menemen ve dondurma gibi özel yemekleri keşfedin.',
    routeStops: [
      { id: 1, name: 'Aydın Ciğer Evi', desc: 'Meşhur ciğer ve böbrek', time: '45 dk' },
      { id: 2, name: 'Tadım Lokantası', desc: 'Geleneksel menemen ve kahvaltı', time: '50 dk' },
      { id: 3, name: 'Ondo Dondurması', desc: 'Yöresel dondurma ve tatlılar', time: '30 dk' },
     
    ],
  },
  {
    id: 5,
    title: 'Kırkpınar & Spor Tarihi',
    time: '1.5 saat',
    stops: '3',
    distance: '2.5 km',
    rating: '4.7',
    badge: 'Spor & Tarih',
    description: 'Sarayiçi, güreş müzesi, Kırkpınar sahası',
    image: require('../../assets/rota/meric.jpg'),
    about: 'Dünya\'nın en eski spor festivali Kırkpınar Yağlı Güreşleri\'nin tarihini keşfedin. Sarayiçi alanında spor tarihine tanıklık edin.',
    routeStops: [
      { id: 1, name: 'Sarayiçi Alanı', desc: 'Kırkpınar festivali\'nin ana sahası', time: '30 dk' },
      { id: 2, name: 'Kırkpınar Müzesi', desc: 'Güreş tarihi ve anıtları', time: '35 dk' },
     
    ],
  },
  {
    id: 6,
    title: 'Keşan ve İlçeleri Gezisi',
    time: '3.5 saat',
    stops: '3',
    distance: '5.5 km',
    rating: '4.4',
    badge: 'Tarih & Doğa',
    description: 'Enez Kalesi, Mecidiye Sahili, Keşan Müzesi',
    image: require('../../assets/rota/meric.jpg'),
    about: 'Edirne\'nin çevre ilçelerine yapılan kapsamlı bir gezide tarihi ve doğal güzellikleri keşfedin.',
    routeStops: [
      { id: 1, name: 'Enez Kalesi', desc: 'Boğaza hâkim tarihi kale', time: '60 dk' },
      { id: 2, name: 'Mecidiye Sahili', desc: 'Deniz kenarında dinlenme ve yüzme', time: '90 dk' },
      { id: 3, name: 'Keşan Müzesi', desc: 'Bölge tarihi ve arkeolojik eserler', time: '45 dk' },
    ],
  },
];

export default function RouteDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const routeId = parseInt(params.id as string, 10);

  const route = useMemo(() => {
    return MOCK_ROUTES_DATA.find((r) => r.id === routeId) || MOCK_ROUTES_DATA[0];
  }, [routeId]);

  return (
    <View className="flex-1 bg-[#fcfcfc]">
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <Header />

      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative h-80">
          <Image source={route.image} className="h-full w-full" />
          <View className="absolute inset-0 bg-black/25" />

          <TouchableOpacity
            onPress={() => router.push('/rota')}
            className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2"
            activeOpacity={0.85}
          >
            <Text className="text-[13px] font-semibold text-[#111827]">← Rotalara Dön</Text>
          </TouchableOpacity>

          <View className="absolute bottom-[60px] left-5">
            <Text
              className="text-[28px] font-bold text-white"
              style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
              {route.title}
            </Text>
          </View>
        </View>

        <View className="-mt-[35px] mx-5 flex-row rounded-[18px] bg-white py-5">
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">🕒 Süre</Text>
            <Text className="text-[15px] font-bold text-[#222]">{route.time}</Text>
          </View>
          <View className="my-auto h-[70%] w-px bg-[#eee]" />
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">📍 Mesafe</Text>
            <Text className="text-[15px] font-bold text-[#222]">{route.distance}</Text>
          </View>
          <View className="my-auto h-[70%] w-px bg-[#eee]" />
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">⭐ Puan</Text>
            <Text className="text-[15px] font-bold text-[#222]">{route.rating}</Text>
          </View>
        </View>

        <View className="m-5 rounded-[18px] border border-[#f0f0f0] bg-white p-5">
          <Text className="mb-2 text-lg font-bold text-[#1a1a1a]">Rota Hakkında</Text>
          <Text className="text-sm leading-[22px] text-[#666]">{route.about}</Text>
        </View>

        <Text className="mb-4 ml-6 text-lg font-bold text-[#1a1a1a]">Duraklar ({route.routeStops.length})</Text>
        
        {route.routeStops.map((stop) => (
          <View key={stop.id} className="mb-3 mx-5 flex-row items-center rounded-[18px] border border-[#f0f0f0] bg-white p-4">
            <View className="mr-4 h-[34px] w-[34px] items-center justify-center rounded-full bg-[#e60000]">
              <Text className="text-sm font-bold text-white">{stop.id}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-[#222]">{stop.name}</Text>
                <Text className="text-xs text-[#888]">🕒 {stop.time}</Text>
              </View>
              <Text className="mt-1 text-[13px] text-[#777]">{stop.desc}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}