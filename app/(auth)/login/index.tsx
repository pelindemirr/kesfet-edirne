import LoginForm from '@/components/auth/LoginForm';
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
    <View className="flex-1 bg-[#f3f4f6] pt-20 mt-5">
      <View className="items-center px-5 ">
        <ThemedText className="mb-1 text-center font-bold text-[#e30613]" style={{ fontSize: 38, lineHeight: 40 }}>Keşfi Edirne</ThemedText>
        <ThemedText className="mb-5 text-center text-[14px] text-[#4b5563]">
          Tarihi keşfedin, rotanızı planlayın
        </ThemedText>

        <TouchableOpacity
          className="mb-6 flex-row items-center gap-1"
          onPress={() => router.push('/')}
        >
          <IconSymbol name="arrow.left" size={16} color="#374151" />
          <ThemedText className="text-[14px] font-medium text-[#374151]">Ana Sayfaya Dön</ThemedText>
        </TouchableOpacity>
      </View>

      <LoginForm
        onLogin={(email) => {
          const nameFromEmail = email.split('@')[0]?.trim() || 'Kullanıcı';
          signIn({ displayName: nameFromEmail });
          router.replace('/');
        }}
      />
    </View>
  );
}