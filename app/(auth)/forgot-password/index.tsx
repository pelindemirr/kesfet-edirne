import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { forgotPassword } from '@/services/api/endpoints/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-[#f3f4f6] pt-20 mt-5">
      <View className="items-center px-5 ">
        <ThemedText className="mb-1 text-center font-bold text-[#e30613]" style={{ fontSize: 38, lineHeight: 40 }}>Keşfi Edirne</ThemedText>
        <ThemedText className="mb-5 text-center text-[14px] text-[#4b5563]">Şifrenizi sıfırlamak için e-posta adresinizi girin</ThemedText>

        <TouchableOpacity
          className="mb-6 flex-row items-center gap-1"
          onPress={() => router.push('/')}
        >
          <IconSymbol name="arrow.left" size={16} color="#374151" />
          <ThemedText className="text-[14px] font-medium text-[#374151]">Ana Sayfaya Dön</ThemedText>
        </TouchableOpacity>
      </View>

      <ForgotPasswordForm
        errorMessage={error}
        successMessage={success}
        isSubmitting={loading}
        onSubmit={async (email) => {
          setError(null);
          setSuccess(null);
          setLoading(true);
          try {
            await forgotPassword(email);
            setSuccess('E-posta gönderildi. Gelen kutunuzu kontrol edin.');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'İstek gönderilemedi.');
          } finally {
            setLoading(false);
          }
        }}
      />

      <View className="mt-4 items-center">
        <TouchableOpacity onPress={() => router.push('/login') }>
          <ThemedText className="text-[13px] font-semibold text-[#e30613]">Giriş sayfasına dön</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
