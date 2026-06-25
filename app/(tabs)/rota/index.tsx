import Header from '@/components/layout/Header';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next'; // i18n import edildi
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const routeCardShadow = {
  shadowColor: '#7a0010',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

// Sadece statik require() yollarını ve eşleşme ID'lerini burada tutuyoruz.
// Metinler tamamen i18n üzerinden gelecek.
const routeImages = [
  { id: 1, image: require('../../../assets/rota/camii.webp') },
  { id: 2, image: require('../../../assets/rota/karaagac.jpeg') },
  { id: 3, image: require('../../../assets/rota/carsi.jpeg') },
  { id: 4, image: require('../../../assets/rota/gastronomi.jpeg') },
  { id: 5, image: require('../../../assets/rota/sarayici.webp') },
  { id: 6, image: require('../../../assets/rota/beyazit.png') },
];

export default function RoutesPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 96 }}>
        <Text className="mb-1 text-[22px] font-bold text-black">
          {t('readyRoutes.title')}
        </Text>
        <Text className="mb-5 text-sm text-[#666]">
          {t('readyRoutes.subtitle')}
        </Text>

        {routeImages.map((route) => {
          // JSON objesinden dinamik anahtar ile rotanın metinlerini çekiyoruz
          const routeTitle = t(`readyRoutes.routes.route${route.id}.title`);
          const routeTime = t(`readyRoutes.routes.route${route.id}.time`);
          const routePlaces = t(`readyRoutes.routes.route${route.id}.places`);
          const routeDistance = t(`readyRoutes.routes.route${route.id}.distance`);

          return (
            <TouchableOpacity
              key={route.id}
              style={routeCardShadow}
              className="mb-5 overflow-hidden rounded-[20px] border border-[#eee] bg-white"
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(tabs)/route-detail', params: { id: route.id } } as any)}
            >
              <View className="relative">
                <Image source={route.image} className="h-[120px] w-full" />
              </View>
              <View className="p-4">
                <Text className="mb-2.5 text-lg font-bold text-black">{routeTitle}</Text>
                <View className="mb-2 flex-row">
                  <Text className="mr-4 text-sm text-[#555]">🕒 {routeTime}</Text>
                  <Text className="text-sm text-[#555]">📍 {routePlaces}</Text>
                </View>
                <Text className="text-sm text-[#888]">{routeDistance}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}