import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { resetPassword } from '@/services/api/endpoints/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const token = useMemo(() => (Array.isArray(params.token) ? params.token[0] : params.token) ?? '', [params.token]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-[#f3f4f6] pt-20 mt-5">
      <View className="items-center px-5 ">
        <ThemedText className="mb-1 text-center font-bold text-[#e30613]" style={{ fontSize: 38, lineHeight: 40 }}>Keşfi Edirne</ThemedText>
        <ThemedText className="mb-5 text-center text-[14px] text-[#4b5563]">
          Yeni şifrenizi belirleyin
        </ThemedText>

        <TouchableOpacity
          className="mb-6 flex-row items-center gap-1"
          onPress={() => router.push('/login')}
        >
          <IconSymbol name="arrow.left" size={16} color="#374151" />
          <ThemedText className="text-[14px] font-medium text-[#374151]">Giriş Sayfasına Dön</ThemedText>
        </TouchableOpacity>
      </View>

      <ResetPasswordForm
        errorMessage={error}
        successMessage={success}
        isSubmitting={loading}
        onSubmit={async (newPassword) => {
          setError(null);
          setSuccess(null);

          if (!token) {
            setError('Token bulunamadı. Mail linkini tekrar açın.');
            return;
          }

          setLoading(true);
          try {
            await resetPassword(token, newPassword);
            setSuccess('Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
              router.replace('/login');
            }, 1200);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Şifre güncellenemedi.');
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}