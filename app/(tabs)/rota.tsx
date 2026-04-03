import Header from '@/components/Header';
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
    <View className="flex-1 bg-[#f8f9fa]">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 96 }}>
        <Text className="mb-1 text-[22px] font-bold text-black">Hazır Rotalar</Text>
        <Text className="mb-5 text-sm text-[#666]">Edirne'yi keşfetmek için hazırlanmış rotalar</Text>

        {routes.map(route => (
          <TouchableOpacity
            key={route.id}
            style={routeCardShadow}
            className="mb-5 overflow-hidden rounded-[20px] border border-[#eee] bg-white"
            activeOpacity={0.9}
            onPress={() => router.push('/route-detail')}
          >
            <View className="relative">
              <Image source={route.image} className="h-[180px] w-full" />
              <View className="absolute right-3 top-3 rounded-xl bg-white px-2.5 py-1">
                <Text className="text-[13px] font-bold">⭐ {route.rating}</Text>
              </View>
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
