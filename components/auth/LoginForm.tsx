import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n eklendi
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginForm({
  onLogin,
  errorMessage,
  isSubmitting = false,
  clearErrors,
}: {
  onLogin?: (email: string, password: string) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  clearErrors?: () => void;
}) {
  const { t } = useTranslation(); // t fonksiyonu tanımlandı
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  // SAYFAYA GİRİLDİĞİNDE VEYA ÇIKILDIĞINDA ESKİ HATALARI TEMİZLE
  useEffect(() => {
    setLocalError(null);
    if (clearErrors) {
      clearErrors(); // Üst katmandaki (authContext vb.) eski mesajları siler
    }
    
    return () => {
      if (clearErrors) clearErrors();
    };
  }, [clearErrors]);

  const displayedError = localError ?? errorMessage ?? null;

  return (
    <View
      className="mt-4 w-[90%] max-w-[380px] self-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10"
    >
      <ThemedText className="mb-1 text-[33px] font-bold leading-[38px] text-[#e30613]">
        {t('loginForm.title')}
      </ThemedText>
      <ThemedText className="mb-5 text-[22px] text-[#4b5563]">
        {t('loginForm.subtitle')}
      </ThemedText>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
        {t('loginForm.emailLabel')}
      </ThemedText>
      <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="envelope" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder={t('loginForm.emailPlaceholder')}
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
        {t('loginForm.passwordLabel')}
      </ThemedText>
      <View className="mb-5 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="lock" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder={t('loginForm.passwordPlaceholder')}
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
        <ThemedText className="text-[12px] font-semibold text-[#e30613]" onPress={() => router.push('/forgot-password' as any)}>
          {t('loginForm.forgotPassword')}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className="mb-4 items-center rounded-[8px] bg-[#e30613] py-3"
        disabled={isSubmitting}
        onPress={() => {
          setLocalError(null);
          if (!email.trim()) {
            setLocalError(t('loginForm.emptyEmailError'));
            return;
          }
          if (!password.trim()) {
            setLocalError(t('loginForm.emptyPasswordError'));
            return;
          }
          console.log('[LoginForm] Attempting login with email:', email);
          onLogin?.(email, password);
        }}
      >
        <ThemedText className="text-[14px] font-bold text-white">
          {isSubmitting ? t('loginForm.loggingIn') : t('loginForm.loginButton')}
        </ThemedText>
      </TouchableOpacity>

      <View className="flex-row items-center justify-center gap-1">
        <ThemedText className="text-[12px] text-[#6b7280]">
          {t('loginForm.noAccount')}
        </ThemedText>
        <TouchableOpacity onPress={() => {
          if (clearErrors) clearErrors(); 
          router.push('/register' as any);
        }}>
          <ThemedText className="text-[12px] font-bold text-[#e30613]">
            {t('loginForm.signUp')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}