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

  // Kullanıcı adı çok uzunsa taşmasın diye maksimum karakter veya güvenli varsayılan
  const buttonText = isAuthenticated ? displayName ?? 'Profil' : 'Giriş Yap';

  const handleProfilePress = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    Alert.alert('Hesap', 'Çıkış yapmak ister misiniz?', [
      { text: 'İptal', style: 'cancel' },
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
    // Üst kısımda güvenli alan (StatusBar) boşluğu için pt-12 (gerekirse ayarlayabilirsin) ve tam ortalama
    <View className="flex-row items-center justify-between bg-[#b10016] px-4 pb-4 pt-12">
      
      {/* Sol Menü Butonu */}
      <TouchableOpacity 
        className="h-10 w-10 items-center justify-center rounded-xl bg-white/10" 
        onPress={() => router.push('/menu')}
      >
        <IconSymbol name="line.3.horizontal" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Orta Başlık Alanı */}
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-[18px] font-black tracking-wide text-white">
          Keşfi Edirne
        </Text>
        <Text className="text-[11px] font-medium text-white/80 tracking-wider uppercase mt-0.5">
          Tarihi Keşfedin
        </Text>
      </View>

      {/* Sağ Profil / Giriş Butonu */}
      <TouchableOpacity
        className="min-w-[70px] max-w-[100px] flex-row items-center justify-center gap-2 rounded-full bg-white/15 px-3 py-1.5"
        onPress={handleProfilePress}
      >
        {isAuthenticated && (
          <View className="h-5 w-5 overflow-hidden rounded-full border border-white/20 bg-white/10">
            <Image source={profileAvatar.source} className="h-full w-full" resizeMode="cover" />
          </View>
        )}
        <Text 
          numberOfLines={1} 
          ellipsizeMode="tail" 
          className="text-center text-[12px] font-bold text-white"
        >
          {buttonText}
        </Text>
      </TouchableOpacity>

    </View>
  );
}