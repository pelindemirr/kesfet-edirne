import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AppHeader() {
  const router = useRouter();
  const { displayName, isAuthenticated, signOut } = useAuth();

  const buttonText = isAuthenticated ? displayName ?? 'Profil' : 'Giriş';

  const handleProfilePress = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    Alert.alert('Hesap', 'Çıkış yapmak ister misiniz?', [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View className="flex-row items-center justify-between bg-[#b10016] px-4 py-3">
      <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl" onPress={() => router.push('/menu')}>
        <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
      </TouchableOpacity>

      <View className="flex-1 items-center px-2">
        <Text className="text-[18px] font-extrabold text-white">Keşfi Edirne</Text>
        <Text className="mt-0.5 text-[12px] text-white/95">Tarihi keşfedin</Text>
      </View>

      <TouchableOpacity
        className="h-[30px] min-w-[48px] items-center justify-center rounded-lg bg-white/10 px-2"
        onPress={handleProfilePress}
      >
        <Text className="text-[15px] font-bold text-white">{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}