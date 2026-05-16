import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/components/auth/auth-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
        onLogin={async (email, password) => {
          setIsLoading(true);
          console.log('[LoginScreen] Login started for:', email);
          try {
            const success = await login(email, password);

            if (success) {
              console.log('[LoginScreen] Login successful! Redirecting to home');
              router.replace('/');
            } else {
              console.log('[LoginScreen] Login failed - invalid credentials or API error');
              Alert.alert('Giriş Başarısız', 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
            }
          } catch (error) {
            console.error('[LoginScreen] Login error:', error);
            Alert.alert('Hata', error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </View>
  );
}