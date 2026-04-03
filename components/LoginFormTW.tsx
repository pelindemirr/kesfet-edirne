import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginFormTW({
  onLogin,
}: {
  onLogin?: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <View className="mt-6 w-[90%] max-w-[380px] self-center rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6">
      <ThemedText className="mb-3 text-[28px] font-bold text-[#dc2626]">Keşfi Edirne</ThemedText>
      <ThemedText className="mb-1 text-[18px] font-bold text-[#111827]">Hoş Geldiniz</ThemedText>
      <ThemedText className="mb-5 text-[12px] text-[#6b7280]">Hesabınıza giriş yapın</ThemedText>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">E-posta</ThemedText>
      <View className="mb-3 flex-row items-center rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
        <IconSymbol name="envelope" size={16} color="#6b7280" />
        <TextInput
          className="flex-1 ml-2 text-[13px] text-[#111827]"
          placeholder="ornek@email.com"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">Şifre</ThemedText>
      <View className="mb-4 flex-row items-center rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
        <IconSymbol name="lock" size={16} color="#6b7280" />
        <TextInput
          className="flex-1 ml-2 text-[13px] text-[#111827]"
          placeholder="••••••••"
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

      <TouchableOpacity className="mb-4 self-end">
        <ThemedText className="text-[12px] font-semibold text-[#dc2626]">Şifremi unuttum</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        className="mb-4 items-center rounded-[10px] bg-[#dc2626] py-2.5"
        onPress={() => onLogin?.(email, password)}
      >
        <ThemedText className="text-[14px] font-bold text-white">Giriş Yap</ThemedText>
      </TouchableOpacity>

      <View className="flex-row items-center justify-center gap-1">
        <ThemedText className="text-[12px] text-[#6b7280]">Hesabınız yok mu?</ThemedText>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <ThemedText className="text-[12px] font-bold text-[#dc2626]">Kayıt olun</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
