import LoginFormTW from '@/components/LoginFormTW';
import { useAuth } from '@/components/auth/auth-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  return (
    <View className="flex-1 bg-[#f3f4f6] pt-16">
      <View className="items-center">
        <ThemedText className="mb-1 text-center text-[32px] font-bold text-[#dc2626]">Keşfi Edirne</ThemedText>
        <ThemedText className="mb-6 text-center text-[14px] text-[#6b7280]">
          Tarihi keşfedin, rotanızı planlayın
        </ThemedText>

        <TouchableOpacity
          className="mb-6 flex-row items-center gap-1"
          onPress={() => router.push('/')}
        >
          <IconSymbol name="arrow.left" size={16} color="#1d4ed8" />
          <ThemedText className="text-[14px] font-semibold text-[#1d4ed8]">Ana Sayfaya Dön</ThemedText>
        </TouchableOpacity>
      </View>

      <LoginFormTW
        onLogin={() => {
          signIn();
          router.replace('/');
        }}
      />
    </View>
  );
}
