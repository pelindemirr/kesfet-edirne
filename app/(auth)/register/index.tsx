import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/components/auth/auth-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View className="flex-1 bg-[#f3f4f6] pt-20 mt-5">
      <View className="items-center px-5">
        <ThemedText className="mb-1 text-center text-[38px] font-bold leading-[40px] text-[#e30613]">Keşfi Edirne</ThemedText>
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

      <RegisterForm
        onRegister={async (name, email, password) => {
          setIsLoading(true);
          console.log('[RegisterScreen] Register started for:', email, 'name:', name);
          try {
            const success = await register(name, email, password);

            if (success) {
              console.log('[RegisterScreen] Register successful!');
              Alert.alert('Başarılı', 'Hesabınız başarıyla oluşturuldu!', [
                {
                  text: 'Tamam',
                  onPress: () => {
                    console.log('[RegisterScreen] Redirecting to home');
                    router.replace('/');
                  },
                },
              ]);
            } else {
              console.log('[RegisterScreen] Register failed - API error');
              Alert.alert('Kayıt Başarısız', 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.');
            }
          } catch (error) {
            console.error('[RegisterScreen] Register error:', error);
            Alert.alert('Hata', error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </View>
  );
}