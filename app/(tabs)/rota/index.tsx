import Header from '@/components/layout/Header';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const routeCardShadow = {
  shadowColor: '#7a0010',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const routes = [
  {
    id: 1,
    title: 'Tarihi Camiler Turu',
    time: '3 saat',
    places: '8 yer',
    distance: '5.2 km',
    badge: 'Kültür & Tarih',
    description: 'Selimiye, Üç Şerefeli, Eski Cami',
    image: require('../../../assets/rota/camii.webp'),
  },
  {
    id: 2,
    title: 'Karaağaç Gezisi',
    time: '2.5 saat',
    places: '3 yer',
    distance: '4.8 km',
    badge: 'Doğa & Yürüyüş',
    description: 'Meriç Köprüsü, tunca nehri',
    image: require('../../../assets/rota/karaagac.jpeg'),
  },
  {
    id: 3,
    title: 'Osmanlı Çarşı Turu',
    time: '2 saat',
    places: '5 yer',
    distance: '2.1 km',
    badge: 'Kültür & Tarih',
    description: 'Bedesten, Alipaşa ve Arasta Çarşısı',
    image: require('../../../assets/rota/carsi.jpeg'),
  },
  {
    id: 4,
    title: 'Edirne Lezzetleri Rotası',
    time: '3.5 saat',
    places: '7 yer',
    distance: '3.0 km',
    badge: 'Yeme & İçme',
    description: 'Aydın Ciğer,Tadım Menemen ,Ondo Dondurma',
    image: require('../../../assets/rota/gastronomi.jpeg'),
  },
  
  {
    id: 5,
    title: 'Kırkpınar & Spor Tarihi',
    time: '1.5 saat',
    places: '3 yer',
    distance: '2.5 km',
    badge: 'Spor & Tarih',
    description: 'Sarayiçi, güreş müzesi, Kırkpınar sahası',
    image: require('../../../assets/rota/sarayici.webp'),
  },
  {
    id: 6,
    title: 'II. Bayezid Külliyesi Sağlık Müzesi Rotası',
    time: '2.5 saat',
    places: '3 yer',
    distance: '2.0 km',
    badge: 'Kültür & Tarih',
    description: 'II. Bayezid Külliyesi, Sağlık Müzesi, çevre tarihi alanlar',
    image: require('../../../assets/rota/beyazit.png'),
  },
];

export default function RoutesPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 96 }}>
        <Text className="mb-1 text-[22px] font-bold text-black">Hazır Rotalar</Text>
        <Text className="mb-5 text-sm text-[#666]">Edirne'yi keşfetmek için hazırlanmış rotalar</Text>

        {routes.map((route) => (
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
              <Text className="mb-2.5 text-lg font-bold text-black">{route.title}</Text>
              <View className="mb-2 flex-row">
                <Text className="mr-4 text-sm text-[#555]">🕒 {route.time}</Text>
                <Text className="text-sm text-[#555]">📍 {route.places}</Text>
              </View>
              <Text className="text-sm text-[#888]">{route.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}