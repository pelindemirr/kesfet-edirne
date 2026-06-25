import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // i18n import edildi
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import Header from '@/components/layout/Header';

// Artık sadece id ve statik resim require() yollarını tutuyoruz. Metinlerin hepsi JSON'dan çekilecek.
const MOCK_ROUTES_DATA = [
  { id: 1, image: require('../../assets/rota/camii.webp') },
  { id: 2, image: require('../../assets/rota/karaagac.jpeg') },
  { id: 3, image: require('../../assets/rota/carsi.jpeg') },
  { id: 4, image: require('../../assets/rota/gastronomi.jpeg') },
  { id: 5, image: require('../../assets/rota/sarayici.webp') },
  { id: 6, image: require('../../assets/rota/beyazit.png') },
];

export default function RouteDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  
  const routeId = parseInt(params.id as string, 10);

  const routeData = useMemo(() => {
    return MOCK_ROUTES_DATA.find((r) => r.id === routeId) || MOCK_ROUTES_DATA[0];
  }, [routeId]);

  // Dil paketinden ilgili rotanın bilgilerini çekiyoruz
  const routeTitle = t(`readyRoutes.routes.route${routeData.id}.title`);
  const routeTime = t(`readyRoutes.routes.route${routeData.id}.time`);
  const routeDistance = t(`readyRoutes.routes.route${routeData.id}.distance`);
  const routeAbout = t(`readyRoutes.routes.route${routeData.id}.about`);
  
  // Durakları JSON'dan bir liste (array) olarak döndürüyoruz
  const routeStops = t(`readyRoutes.routes.route${routeData.id}.routeStops`, { returnObjects: true }) as Array<{ id: number, name: string, desc: string, time: string }>;

  return (
    <View className="flex-1 bg-[#fcfcfc]">
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <Header />

      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative h-80">
          <Image source={routeData.image} className="h-full w-full" />
          <View className="absolute inset-0 bg-black/25" />

          <TouchableOpacity
            onPress={() => router.push('/rota')}
            className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2"
            activeOpacity={0.85}
          >
            <Text className="text-[13px] font-semibold text-[#111827]">
              {t('readyRoutes.backToRoutes')}
            </Text>
          </TouchableOpacity>

          <View className="absolute bottom-[60px] left-5">
            <Text
              className="text-[28px] font-bold text-white"
              style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
              {routeTitle}
            </Text>
          </View>
        </View>

        <View className="-mt-[35px] mx-5 flex-row rounded-[18px] bg-white py-5">
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">🕒 {t('readyRoutes.duration')}</Text>
            <Text className="text-[15px] font-bold text-[#222]">{routeTime}</Text>
          </View>
          <View className="my-auto h-[70%] w-px bg-[#eee]" />
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">📍 {t('readyRoutes.distance')}</Text>
            <Text className="text-[15px] font-bold text-[#222]">{routeDistance}</Text>
          </View>
        </View>

        <View className="m-5 rounded-[18px] border border-[#f0f0f0] bg-white p-5">
          <Text className="mb-2 text-lg font-bold text-[#1a1a1a]">{t('readyRoutes.aboutRoute')}</Text>
          <Text className="text-sm leading-[22px] text-[#666]">{routeAbout}</Text>
        </View>

        <Text className="mb-4 ml-6 text-lg font-bold text-[#1a1a1a]">
          {t('readyRoutes.stops')} ({routeStops.length})
        </Text>
        
        {routeStops.map((stop) => (
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