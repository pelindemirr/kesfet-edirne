import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginForm({
  onLogin,
  errorMessage,
  isSubmitting = false,
}: {
  onLogin?: (email: string, password: string) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const displayedError = localError ?? errorMessage ?? null;

  return (
    <View
      className="mt-4 w-[90%] max-w-[380px] self-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10"
    >
      <ThemedText className="mb-1 text-[33px] font-bold leading-[38px] text-[#e30613]">Hoş Geldiniz</ThemedText>
      <ThemedText className="mb-5 text-[22px] text-[#4b5563]">Hesabınıza giriş yapınız</ThemedText>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">E-posta</ThemedText>
      <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="envelope" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Mail adresinizi giriniz"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre</ThemedText>
      <View className="mb-5 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="lock" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Şifrenizi giriniz"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
          <IconSymbol
            name={showPassword ? 'eye.slash' : 'eye'}
            size={16}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>

      {displayedError ? (
        <View className="mb-4 rounded-[8px] bg-[#fef2f2] px-3 py-2">
          <ThemedText className="text-[12px] font-medium text-[#b91c1c]">{displayedError}</ThemedText>
        </View>
      ) : null}

      <TouchableOpacity className="mb-4 self-end">
        <ThemedText className="text-[12px] font-semibold text-[#e30613]" onPress={() => router.push('/forgot-password' as any)}>Şifremi unuttum</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className="mb-4 items-center rounded-[8px] bg-[#e30613] py-3"
        disabled={isSubmitting}
        onPress={() => {
          setLocalError(null);
          if (!email.trim()) {
            setLocalError('Lütfen e-posta adresinizi giriniz.');
            return;
          }
          if (!password.trim()) {
            setLocalError('Lütfen şifrenizi giriniz.');
            return;
          }
          console.log('[LoginForm] Attempting login with email:', email);
          onLogin?.(email, password);
        }}
      >
        <ThemedText className="text-[14px] font-bold text-white">
          {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </ThemedText>
      </TouchableOpacity>

      <View className="flex-row items-center justify-center gap-1">
        <ThemedText className="text-[12px] text-[#6b7280]">Hesabınız yok mu?</ThemedText>
        <TouchableOpacity onPress={() => router.push('/register' as any)}>
          <ThemedText className="text-[12px] font-bold text-[#e30613]">Kayıt olun</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}