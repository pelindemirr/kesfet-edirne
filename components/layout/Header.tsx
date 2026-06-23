import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getProfileAvatar, useProfileStore } from '@/stores/use-profile-store';

export default function AppHeader() {
  const router = useRouter();
  const { displayName, isAuthenticated, signOut } = useAuth();
  const profileAvatarId = useProfileStore((state) => state.avatarId);
  const profileAvatar = getProfileAvatar(profileAvatarId);
  
  const { t, i18n } = useTranslation();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Buton metni
  const buttonText = isAuthenticated 
    ? displayName ?? (i18n.language === 'tr' ? 'Profil' : 'Profile') 
    : (i18n.language === 'tr' ? 'Giriş Yap' : 'Login');

  // ARTIK HER DURUMDA MENÜYÜ AÇIYORUZ
  const handleProfilePress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setDropdownVisible(false);
  };

  const handleSignOutPress = () => {
    setDropdownVisible(false);
    Alert.alert(
      i18n.language === 'tr' ? 'Çıkış Yap' : 'Sign Out',
      i18n.language === 'tr' ? 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?' : 'Are you sure you want to sign out from your account?',
      [
        { text: i18n.language === 'tr' ? 'İptal' : 'Cancel', style: 'cancel' },
        {
          text: i18n.language === 'tr' ? 'Çıkış Yap' : 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View className="z-50 bg-[#b10016] px-4 pb-4 pt-12">
      <View className="flex-row items-center justify-between">
        
        {/* Sol Menü Butonu */}
        <TouchableOpacity 
          className="h-10 w-10 items-center justify-center rounded-xl bg-white/10" 
          onPress={() => router.push('/menu')}
        >
          <IconSymbol name="line.3.horizontal" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Orta Başlık Alanı */}
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-[18px] font-black tracking-wide text-white">
            Keşfet Edirne
          </Text>
          <Text className="text-[11px] font-medium text-white/80 tracking-wider uppercase mt-0.5">
            {i18n.language === 'tr' ? 'Tarihi Keşfedin' : 'Discover History'}
          </Text>
        </View>

        {/* Sağ Profil / Giriş Butonu */}
        <TouchableOpacity
          className="min-w-[75px] max-w-[110px] flex-row items-center justify-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"
          onPress={handleProfilePress}
        >
          {isAuthenticated && (
            <View className="h-5 w-5 overflow-hidden rounded-full border border-white/20 bg-white/10">
              <Image source={profileAvatar.source} className="h-full w-full" resizeMode="cover" />
            </View>
          )}
          <Text 
            numberOfLines={1} 
            ellipsizeMode="tail" 
            className="text-center text-[12px] font-bold text-white"
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🏛️ DROPDOWN MODAL */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="none"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-transparent" 
          activeOpacity={1} 
          onPress={() => setDropdownVisible(false)}
        >
          <View 
            style={{ top: 85, right: 16 }} 
            className="absolute w-48 rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-xl shadow-black/20"
          >
            <View 
              style={{ top: -6, right: 20 }} 
              className="absolute h-3 w-3 rotate-45 border-l border-t border-[#e5e7eb] bg-white" 
            />

            {/* 1. SEÇENEK: Duruma Göre "Giriş Yap" veya "Profil Ayarları" */}
            {isAuthenticated ? (
              <TouchableOpacity 
                className="flex-row items-center gap-2 rounded-lg px-3 py-2.5 active:bg-gray-100"
                onPress={() => {
                  setDropdownVisible(false);
                  router.push('/(account)/profile-settings');
                }}
              >
                <IconSymbol name="person.crop.circle" size={16} color="#4b5563" />
                <Text className="text-[13px] font-semibold text-[#111827]">
                  {i18n.language === 'tr' ? 'Profil Ayarları' : 'Profile Settings'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="flex-row items-center gap-2 rounded-lg px-3 py-2.5 active:bg-gray-100"
                onPress={() => {
                  setDropdownVisible(false);
                  router.push('/(auth)/login');
                }}
              >
                <IconSymbol name="person.crop.circle.badge.plus" size={16} color="#4b5563" />
                <Text className="text-[13px] font-semibold text-[#111827]">
                  {i18n.language === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Login / Sign Up'}
                </Text>
              </TouchableOpacity>
            )}

            <View className="my-1 h-[1px] bg-gray-100" />

            {/* 🌍 2. Seçenekler: Açık Dil Seçimi (TR / EN) */}
            <View className="bg-gray-50/50 py-1">
              {/* TR Butonu */}
              <TouchableOpacity 
                className={`flex-row items-center justify-between rounded-lg px-3 py-2.5 ${i18n.language === 'tr' ? 'bg-[#f3f4f6]' : 'active:bg-gray-100'}`}
                onPress={() => setLanguage('tr')}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-[14px]">🇹🇷</Text>
                  <Text className={`text-[13px] ${i18n.language === 'tr' ? 'font-bold text-[#111827]' : 'font-semibold text-[#4b5563]'}`}>Türkçe</Text>
                </View>
                {i18n.language === 'tr' && <IconSymbol name="checkmark" size={14} color="#b10016" />}
              </TouchableOpacity>

              {/* EN Butonu */}
              <TouchableOpacity 
                className={`flex-row items-center justify-between rounded-lg px-3 py-2.5 ${i18n.language === 'en' ? 'bg-[#f3f4f6]' : 'active:bg-gray-100'}`}
                onPress={() => setLanguage('en')}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-[14px]">🇬🇧</Text>
                  <Text className={`text-[13px] ${i18n.language === 'en' ? 'font-bold text-[#111827]' : 'font-semibold text-[#4b5563]'}`}>English</Text>
                </View>
                {i18n.language === 'en' && <IconSymbol name="checkmark" size={14} color="#b10016" />}
              </TouchableOpacity>
            </View>

            {/* Çıkış Yap (SADECE GİRİŞ YAPILMIŞSA GÖRÜNÜR) */}
            {isAuthenticated && (
              <>
                <View className="my-1 h-[1px] bg-gray-100" />
                <TouchableOpacity 
                  className="flex-row items-center gap-2 rounded-lg px-3 py-2.5 bg-red-50 active:bg-red-100"
                  onPress={handleSignOutPress}
                >
                  <IconSymbol name="power" size={14} color="#dc2626" />
                  <Text className="text-[13px] font-bold text-[#dc2626]">
                    {i18n.language === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}