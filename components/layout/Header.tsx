import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getProfileAvatar, useProfileStore } from '@/stores/use-profile-store';

export default function AppHeader() {
  const router = useRouter();
  const { displayName, isAuthenticated, signOut } = useAuth();
  const profileAvatarId = useProfileStore((state) => state.avatarId);
  const profileAvatar = getProfileAvatar(profileAvatarId);

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
      <TouchableOpacity className="h-20 w-20 items-center justify-center rounded-xl" onPress={() => router.push('/menu')}>
        <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
      </TouchableOpacity>

      <View className="flex-1 items-center px-2">
        <Text className="text-[18px] font-extrabold text-white mt-10">Keşfi Edirne</Text>
        <Text className="mt-0.5 text-[12px] text-white/95">Tarihi keşfedin</Text>
      </View>

      <TouchableOpacity
        className="w-[92px] items-center justify-center rounded-lg bg-white/10 px-2 py-1 overflow-hidden pt-4"
        onPress={handleProfilePress}
      >
        {isAuthenticated ? (
          <View className="mb-1 h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white/10 ">
            <Image source={profileAvatar.source} className="h-full w-full" resizeMode="cover" />
          </View>
        ) : null}
        <Text numberOfLines={1} ellipsizeMode="tail" className="text-center text-[13px] font-bold pt-2 text-white">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}