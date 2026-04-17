import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import Header from '@/components/layout/Header';

const stops = [
  { id: 1, name: 'Selimiye Camii', desc: "Mimar Sinan'ın ustalık eseri", time: '45 dk' },
  { id: 2, name: 'Eski Camii', desc: 'Erken Osmanlı mimarisi', time: '30 dk' },
  { id: 3, name: 'Üç Şerefeli Camii', desc: 'Görkemli minareler', time: '40 dk' },
  { id: 4, name: 'Ali Paşa Çarşısı', desc: 'Tarihi alışveriş noktası', time: '60 dk' },
];

export default function RouteDetail() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#fcfcfc]">
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <Header />

      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative h-80">
          <Image source={require('../../assets/rota/camii.webp')} className="h-full w-full" />
          <View className="absolute inset-0 bg-black/25" />

          <TouchableOpacity
            onPress={() => router.push('/rota')}
            className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2"
            activeOpacity={0.85}
          >
            <Text className="text-[13px] font-semibold text-[#111827]">← Rotalara Don</Text>
          </TouchableOpacity>

          <View className="absolute bottom-[60px] left-5">
            <Text
              className="text-[28px] font-bold text-white"
              style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
              Tarihi Merkez Turu
            </Text>
          </View>
        </View>

        <View className="-mt-[35px] mx-5 flex-row rounded-[18px] bg-white py-5">
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">🕒 Süre</Text>
            <Text className="text-[15px] font-bold text-[#222]">3 saat</Text>
          </View>
          <View className="my-auto h-[70%] w-px bg-[#eee]" />
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">📍 Mesafe</Text>
            <Text className="text-[15px] font-bold text-[#222]">5.2 km</Text>
          </View>
          <View className="my-auto h-[70%] w-px bg-[#eee]" />
          <View className="flex-1 items-center">
            <Text className="mb-1 text-[11px] text-[#888]">⭐ Puan</Text>
            <Text className="text-[15px] font-bold text-[#222]">4.8</Text>
          </View>
        </View>

        <View className="m-5 rounded-[18px] border border-[#f0f0f0] bg-white p-5">
          <Text className="mb-2 text-lg font-bold text-[#1a1a1a]">Rota Hakkında</Text>
          <Text className="text-sm leading-[22px] text-[#666]">
            Edirne'nin en önemli tarihi yapılarını kapsayan, şehrin ruhunu hissedeceğiniz merkez rota. Mimar Sinan'ın izinden giderek eşsiz camileri ve çarşıları keşfedin.
          </Text>
        </View>

        <Text className="mb-4 ml-6 text-lg font-bold text-[#1a1a1a]">Duraklar ({stops.length})</Text>
        
        {stops.map((stop) => (
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