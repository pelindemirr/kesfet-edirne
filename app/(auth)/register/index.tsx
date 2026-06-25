import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/components/auth/auth-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFocusEffect, useRouter } from 'expo-router'; // useFocusEffect eklendi
import React, { useCallback } from 'react'; // useCallback eklendi
import { useTranslation } from 'react-i18next'; // i18n import edildi
import { TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // clearError fonksiyonunu Context'ten alıyoruz
  const { register, loading, error, clearError } = useAuth();

  // 💡 SAYFAYA GİRİLDİĞİNDE VEYA ÇIKILDIĞINDA ESKİ HATALARI TEMİZLE
  useFocusEffect(
    useCallback(() => {
      // Sayfa açıldığında hatayı temizle
      if (clearError) clearError();

      return () => {
        // Sayfadan çıkıldığında hatayı temizle
        if (clearError) clearError();
      };
    }, [clearError])
  );

  return (
    <View className="flex-1 bg-[#f3f4f6] pt-20 mt-5">
      <View className="items-center px-5">
        <ThemedText className="mb-1 text-center text-[38px] font-bold leading-[40px] text-[#e30613]">
          {/* JSON'daki login objesini tekrar kullanıyoruz */}
          {t('login.appName')}
        </ThemedText>
        <ThemedText className="mb-5 text-center text-[14px] text-[#4b5563]">
          {t('login.subtitle')}
        </ThemedText>

        <TouchableOpacity
          className="mb-6 flex-row items-center gap-1"
          onPress={() => router.push('/')}
        >
          <IconSymbol name="arrow.left" size={16} color="#374151" />
          <ThemedText className="text-[14px] font-medium text-[#374151]">
            {t('login.backToHome')}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <RegisterForm
        errorMessage={error}
        isSubmitting={loading}
        onRegister={async (name, email, password) => {
          console.log('[RegisterScreen] Register started for:', email, 'name:', name);
          try {
            // İşleme başlamadan önce varsa eski hataları temizle
            if (clearError) clearError();

            const success = await register(name, email, password);

            if (success) {
              console.log('[RegisterScreen] Register successful!');
              
              // 💡 EXPO ROUTER CRASH ÇÖZÜMÜ: Yönlendirmeyi biraz beklet
              setTimeout(() => {
                router.replace('/');
              }, 100);
            }
          } catch (error) {
            console.error('[RegisterScreen] Register error:', error);
          }
        }}
      />
    </View>
  );
}