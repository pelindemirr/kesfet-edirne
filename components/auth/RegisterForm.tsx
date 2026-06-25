import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n import edildi
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm({
  onRegister,
  errorMessage,
  isSubmitting = false,
}: {
  onRegister?: (name: string, email: string, password: string) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}) {
  const { t } = useTranslation(); // Çeviri fonksiyonu
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [kvkkChecked, setKvkkChecked] = useState(false); 
  const [kvkkModalVisible, setKvkkModalVisible] = useState(false); 
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const displayedError = localError ?? errorMessage ?? null;

  return (
    // ↕️ SAYFA KAYMA SORUNUNU ÇÖZEN DIŞ SCROLLVIEW KATMANI
    <ScrollView 
      className="w-full"
      contentContainerStyle={{ paddingVertical: 16, alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View
        className="w-[90%] max-w-[380px] rounded-[16px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-lg shadow-black/10"
      >
        <ThemedText className="mb-1 text-[33px] font-bold leading-[38px] text-[#e30613]">
          {t('registerForm.title')}
        </ThemedText>
        <ThemedText className="mb-5 text-[22px] text-[#4b5563]">
          {t('registerForm.subtitle')}
        </ThemedText>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
          {t('registerForm.nameLabel')}
        </ThemedText>
        <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="person" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder={t('registerForm.namePlaceholder')}
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
          {t('registerForm.emailLabel')}
        </ThemedText>
        <View className="mb-3 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="envelope" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder={t('registerForm.emailPlaceholder')}
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
          {t('registerForm.passwordLabel')}
        </ThemedText>
        <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="lock" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder={t('registerForm.passwordPlaceholder')}
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

        <ThemedText className="mb-1.5 text-[12px] font-semibold text-[#111827]">
          {t('registerForm.confirmPasswordLabel')}
        </ThemedText>
        <View className="mb-4 flex-row items-center rounded-[8px] bg-[#f3f4f6] px-3 py-2.5">
          <IconSymbol name="lock" size={16} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 text-[13px] text-[#111827]"
            placeholder={t('registerForm.confirmPasswordPlaceholder')}
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

        {/* 🔐 KVKK ONAY CHECKBOX SATIRI */}
        <View className="mb-4 flex-row items-start gap-2 pr-2">
          <TouchableOpacity 
            onPress={() => setKvkkChecked(v => !v)}
            className={`mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border ${
              kvkkChecked ? 'border-[#e30613] bg-[#e30613]' : 'border-[#d1d5db] bg-white'
            }`}
            activeOpacity={0.8}
          >
            {kvkkChecked && (
              <IconSymbol name="checkmark" size={12} color="#ffffff" /> 
            )}
          </TouchableOpacity>

          <View className="flex-1 flex-row flex-wrap items-center">
            <TouchableOpacity onPress={() => setKvkkChecked(v => !v)} activeOpacity={1}>
              <ThemedText className="text-[12px] leading-[16px] text-[#4b5563]">
                {t('registerForm.kvkkText1')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setKvkkModalVisible(true)}>
              <ThemedText className="text-[12px] leading-[16px] font-bold text-[#e30613] underline">
                {t('registerForm.kvkkLink')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setKvkkChecked(v => !v)} activeOpacity={1}>
              <ThemedText className="text-[12px] leading-[16px] text-[#4b5563]">
                {t('registerForm.kvkkText2')}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
              setLocalError(t('registerForm.errors.emptyName'));
              return;
            }
            if (!email.trim()) {
              setLocalError(t('registerForm.errors.emptyEmail'));
              return;
            }
            if (!password.trim()) {
              setLocalError(t('registerForm.errors.emptyPassword'));
              return;
            }
            if (password.length < 6) {
              setLocalError(t('registerForm.errors.passwordLength'));
              return;
            }
            if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
              setLocalError(t('registerForm.errors.passwordPattern'));
              return;
            }
            if (!confirmPassword.trim()) {
              setLocalError(t('registerForm.errors.emptyConfirmPassword'));
              return;
            }
            if (password !== confirmPassword) {
              setLocalError(t('registerForm.errors.passwordMismatch'));
              return;
            }
            if (!kvkkChecked) {
              setLocalError(t('registerForm.errors.kvkkRequired'));
              return;
            }
            console.log('[RegisterForm] Attempting register with email:', email, 'name:', name);
            onRegister?.(name, email, password);
          }}
        >
          <ThemedText className="text-[14px] font-bold text-white">
            {isSubmitting ? t('registerForm.submitting') : t('registerForm.submitButton')}
          </ThemedText>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center gap-1">
          <ThemedText className="text-[12px] text-[#6b7280]">
            {t('registerForm.haveAccount')}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <ThemedText className="text-[12px] font-bold text-[#e30613]">
              {t('registerForm.loginText')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🏛️ MODAL: KURUMSAL KVKK AYDINLATMA METNİ PENCERESİ */}
      <Modal
        visible={kvkkModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setKvkkModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <View className="w-full max-w-[360px] rounded-[16px] bg-white p-5 shadow-2xl">
            <View className="mb-3 flex-row items-center justify-between border-b border-[#e5e7eb] pb-2">
              <Text className="text-[16px] font-bold text-[#111827]">
                {t('registerForm.kvkkModal.title')}
              </Text>
              <TouchableOpacity onPress={() => setKvkkModalVisible(false)} className="p-1">
                <Text className="text-[18px] font-bold text-[#6b7280]">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[260px] mb-4 pr-1" showsVerticalScrollIndicator>
              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                {t('registerForm.kvkkModal.section1Title')}
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                {t('registerForm.kvkkModal.section1Desc')}
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                {t('registerForm.kvkkModal.section2Title')}
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                {t('registerForm.kvkkModal.section2Desc')}
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                {t('registerForm.kvkkModal.section3Title')}
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280] mb-3">
                {t('registerForm.kvkkModal.section3Desc')}
              </Text>

              <Text className="text-[12px] leading-[18px] text-[#4b5563] font-semibold mb-1">
                {t('registerForm.kvkkModal.section4Title')}
              </Text>
              <Text className="text-[12px] leading-[18px] text-[#6b7280]">
                {t('registerForm.kvkkModal.section4Desc')}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setKvkkModalVisible(false)}
              className="w-full items-center rounded-[8px] bg-[#e30613] py-2.5"
            >
              <Text className="text-[13px] font-bold text-white">
                {t('registerForm.kvkkModal.closeButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}