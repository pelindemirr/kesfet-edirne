import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AppHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between bg-[#b10016] px-4 py-3">
      <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl" onPress={() => router.push('/menu')}>
        <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
      </TouchableOpacity>

      <View className="flex-1 items-center px-2">
        <Text className="text-[18px] font-extrabold text-white">Keşfi Edirne</Text>
        <Text className="mt-0.5 text-[12px] text-white/95">Tarihi keşfedin</Text>
      </View>

      <TouchableOpacity className="h-[30px] min-w-[48px] items-center justify-center rounded-lg bg-white/10 px-2" onPress={() => router.push('/login')}>
        <Text className="text-[12px] font-bold text-white">Giriş</Text>
      </TouchableOpacity>
    </View>
  );
}