import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm({
  onRegister,
  errorMessage,
  isSubmitting = false,
}: {
  onRegister?: (name: string, email: string, password: string) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const displayedError = localError ?? errorMessage ?? null;

  return (
    <View
      className="mt-4 w-[90%] max-w-[380px] self-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10"
    >
      <ThemedText className="mb-1 text-[33px] font-bold leading-[38px] text-[#e30613]">Hesap Oluşturun</ThemedText>
      <ThemedText className="mb-5 text-[22px] text-[#4b5563]">Yeni bir hesap oluşturun</ThemedText>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Ad Soyad</ThemedText>
      <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="person" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Ad Soyad"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
      </View>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">E-posta</ThemedText>
      <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="envelope" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Mail adresinizi"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre</ThemedText>
      <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
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

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre Tekrar</ThemedText>
      <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
        <IconSymbol name="lock" size={16} color="#6b7280" />
        <TextInput
          className="ml-2 flex-1 text-[13px] text-[#111827]"
          placeholder="Şifrenizi tekrar giriniz"
          placeholderTextColor="#9ca3af"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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

      <TouchableOpacity
        className="mb-4 items-center rounded-[8px] bg-[#e30613] py-3"
        disabled={isSubmitting}
        onPress={() => {
          setLocalError(null);
          if (!name.trim()) {
            setLocalError('Lütfen adınızı giriniz.');
            return;
          }
          if (!email.trim()) {
            setLocalError('Lütfen e-posta adresinizi giriniz.');
            return;
          }
          if (!password.trim()) {
            setLocalError('Lütfen şifrenizi giriniz.');
            return;
          }
          if (password.length < 6) {
            setLocalError('Şifre en az 6 karakter olmalıdır.');
            return;
          }
          if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            setLocalError('Şifre en az bir harf ve bir rakam içermelidir.');
            return;
          }
          if (!confirmPassword.trim()) {
            setLocalError('Lütfen şifrenizi tekrar giriniz.');
            return;
          }
          if (password !== confirmPassword) {
            setLocalError('Şifreler eşleşmiyor.');
            return;
          }
          console.log('[RegisterForm] Attempting register with email:', email, 'name:', name);
          onRegister?.(name, email, password);
        }}
      >
        <ThemedText className="text-[14px] font-bold text-white">
          {isSubmitting ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
        </ThemedText>
      </TouchableOpacity>

      <View className="flex-row items-center justify-center gap-1">
        <ThemedText className="text-[12px] text-[#6b7280]">Hesabınız var mı?</ThemedText>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <ThemedText className="text-[12px] font-bold text-[#e30613]">Giriş yapın</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}