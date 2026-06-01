import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordForm({
  onSubmit,
  isSubmitting = false,
  successMessage,
  errorMessage,
}: {
  onSubmit?: (email: string) => void;
  isSubmitting?: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}) {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const displayedError = localError ?? errorMessage ?? null;

  return (
    <View className="mt-4 w-[90%] max-w-[380px] self-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10">
      <ThemedText className="mb-1 text-[26px] font-bold leading-[30px] text-[#e30613]">Şifrenizi Sıfırlayın</ThemedText>
      <ThemedText className="mb-4 text-[14px] text-[#4b5563]">Kayıtlı e-posta adresinizi girin, sıfırlama bağlantısı gönderelim.</ThemedText>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">E-posta</ThemedText>
      <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="envelope" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Kayıtlı e-posta adresiniz"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {displayedError ? (
        <View className="mb-4 rounded-[8px] bg-[#fef2f2] px-3 py-2">
          <ThemedText className="text-[12px] font-medium text-[#b91c1c]">{displayedError}</ThemedText>
        </View>
      ) : null}

      {successMessage ? (
        <View className="mb-4 rounded-[8px] bg-[#ecfdf5] px-3 py-2">
          <ThemedText className="text-[12px] font-medium text-[#065f46]">{successMessage}</ThemedText>
        </View>
      ) : null}

      <TouchableOpacity
        className="mb-4 items-center rounded-[8px] bg-[#e30613] py-3"
        disabled={isSubmitting}
        onPress={() => {
          setLocalError(null);
          if (!email.trim()) {
            setLocalError('Lütfen e-posta adresinizi giriniz.');
            return;
          }
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setLocalError('Lütfen geçerli bir e-posta adresi giriniz.');
            return;
          }

          onSubmit?.(email);
        }}
      >
        <ThemedText className="text-[14px] font-bold text-white">{isSubmitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
