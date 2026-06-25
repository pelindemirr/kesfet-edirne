import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAvatarsList, getProfile, updateUserAvatar, type AvatarItem } from '@/services/api/endpoints/profile';
import { useAuthStore } from '@/stores/use-auth-store';
import { getProfileAvatar, useProfileStore, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n import edildi
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const editIcon = require('../../../assets/icon/edit.png');

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation(); // Çeviri fonksiyonu
  const { displayName } = useAuth();
  const profileDisplayName = useProfileStore((state) => state.displayName);
  const profileAvatarId = useProfileStore((state) => state.avatarId);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const defaultName = profileName?.trim() || profileDisplayName?.trim() || displayName?.trim() || t('profileSettings.defaultUser');
  const defaultEmail = useMemo(() => {
    if (profileEmail?.trim()) return profileEmail.trim();
    return `${defaultName.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')}@gmail.com`;
  }, [defaultName, profileEmail]);
  
  const [avatarsList, setAvatarsList] = useState<AvatarItem[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [selectedAvatarKey, setSelectedAvatarKey] = useState<string | null>(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  // 🔔 PROFESYONEL BİLDİRİM (TOAST) STATE'LERİ
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const params = useLocalSearchParams<{ open?: string }>();
  const savedAvatar = getProfileAvatar(profileAvatarId);

  const authToken = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const [fetchedBadges, setFetchedBadges] = useState<Array<{ title: string; description?: string }>>([]);

  const resolveAvatarId = (avatar?: string): ProfileAvatarId | undefined => {
    if (!avatar) return undefined;
    const normalizedAvatar = avatar.toLowerCase();
    if (normalizedAvatar === 'man' || normalizedAvatar === 'klasik') return 'man';
    if (normalizedAvatar === 'woman' || normalizedAvatar === 'modern') return 'woman';
    if (normalizedAvatar === 'man2' || normalizedAvatar === 'sportif') return 'man2';
    if (normalizedAvatar === 'woman2' || normalizedAvatar === 'zarif') return 'woman2';
    return undefined;
  };

  const getAvatarImageByKey = (key: string) => {
    const avatarId = resolveAvatarId(key);
    if (!avatarId) return getProfileAvatar('man');
    return getProfileAvatar(avatarId);
  };

  // Şık bildirim gösterme tetikleyicisi
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    let mounted = true;

    async function loadAvatars() {
      try {
        setLoadingAvatars(true);
        const res = await getAvatarsList();
        if (!mounted) return;
        
        if (res.status === 'success' && res.data) {
          setAvatarsList(res.data);
        }
      } catch (e) {
        console.error('[ProfileSettings] loadAvatars error', e);
      } finally {
        if (mounted) setLoadingAvatars(false);
      }
    }

    async function loadProfile() {
      if (!authUser?.id || !authToken) return;

      try {
        const res = await getProfile(authUser.id, authToken);
        if (!mounted) return;

        if (res.bodyStatus === 'success' || res.status === 200 || res.status === 201) {
          const user = res.data?.user;
          const badges = res.data?.badges || [];

          if (user) {
            setProfile({ displayName: user.full_name, avatarId: resolveAvatarId(user.avatar) });
            setProfileName(user.full_name ?? null);
            setProfileEmail(user.email ?? null);
            setSelectedAvatarKey(user.avatar ?? null);
          } else {
            const fallbackUser = (res as any)?.user ?? (res as any)?.data?.data?.user;
            if (fallbackUser) {
              setProfile({
                displayName: fallbackUser.full_name,
                avatarId: resolveAvatarId(fallbackUser.avatar),
              });
              setProfileName(fallbackUser.full_name ?? null);
              setProfileEmail(fallbackUser.email ?? null);
              setSelectedAvatarKey(fallbackUser.avatar ?? null);
            }
          }
          setFetchedBadges(badges);
        }
      } catch (e) {
        console.error('[ProfileSettings] loadProfile error', e);
      }
    }

    loadAvatars();
    loadProfile();

    try {
      if ((params as any)?.open === 'avatar') {
        setShowAvatarOptions(true);
      }
    } catch (e) {}

    return () => {
      mounted = false;
    };
  }, [authToken, authUser]);

  const handleSaveChanges = async () => {
    if (!selectedAvatarKey || !authUser?.id || !authToken) return;

    try {
      setSavingAvatar(true);
      const response = await updateUserAvatar(authUser.id, authToken, selectedAvatarKey);
      
      setProfile({
        avatarId: resolveAvatarId(selectedAvatarKey),
      });
      
      setShowAvatarOptions(false);
      showToast(t('profileSettings.avatarSuccess'), 'success');
    } catch (e) {
      console.error('[ProfileSettings] Avatar update error:', e);
      showToast(t('profileSettings.avatarError'), 'error');
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      {/* Üst Bar */}
      <View className="bg-[#d80018] px-4 pb-4 pt-12">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <IconSymbol name="chevron.left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-[24px] font-extrabold text-white">{t('profileSettings.headerTitle')}</Text>
            <Text className="mt-0.5 text-[13px] text-white/90">{t('profileSettings.headerSubtitle')}</Text>
          </View>
        </View>
      </View>

      {/* 🔔 ULTRASONİK VE MODERN TOAST BİLDİRİM KUTUSU */}
      {toastMessage && (
        <View 
          style={{ top: 100 }}
          className={`absolute left-[5%] right-[5%] z-50 flex-row items-center rounded-xl p-3.5 shadow-lg ${
            toastType === 'success' 
              ? 'bg-[#e8f5e9] border border-[#a5d6a7]' 
              : 'bg-[#ffebee] border border-[#ef9a9a]'
          }`}
        >
          <View className="mr-2.5">
            <IconSymbol 
              name={toastType === 'success' ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'} 
              size={20} 
              color={toastType === 'success' ? '#2e7d32' : '#c62828'} 
            />
          </View>
          <Text 
            className={`flex-1 text-[13px] font-bold ${
              toastType === 'success' ? 'text-[#1b5e20]' : 'text-[#7f1d1d]'
            }`}
          >
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        
        {/* Profil Fotoğrafı Kartı */}
        <View className="rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="text-[20px] font-bold text-[#111827]">{t('profileSettings.profilePhotoTitle')}</Text>

          <View className="mt-5 items-center">
            <View className="relative h-24 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e60000] bg-[#fff1f2]">
              <Image 
                source={showAvatarOptions && selectedAvatarKey ? getAvatarImageByKey(selectedAvatarKey).source : savedAvatar.source} 
                className="h-full w-full" 
                resizeMode="cover" 
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowAvatarOptions((value) => !value)}
              className="mt-4 flex-row items-center justify-center rounded-full border border-[#ffd0d4] bg-[#fff5f6] px-4 py-2.5"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center">
                <Text className="text-[13px] font-semibold text-[#b10016]">{t('profileSettings.changePhotoBtn')}</Text>
                <Image source={editIcon} className="ml-2 h-5 w-5" resizeMode="contain" style={{ tintColor: '#b10016' }} />
              </View>
            </TouchableOpacity>

            {showAvatarOptions && (
              <View className="mt-4 w-full">
                <Text className="mb-3 text-center text-[13px] font-semibold text-[#6b7280]">{t('profileSettings.selectNewAvatar')}</Text>
                
                {loadingAvatars ? (
                  <View className="py-8">
                    <ActivityIndicator size="large" color="#e60000" />
                  </View>
                ) : (
                  <View className="flex-row flex-wrap justify-between gap-y-3">
                    {avatarsList.map((avatar) => {
                      const isSelected = avatar.key === selectedAvatarKey;
                      const avatarImage = getAvatarImageByKey(avatar.key);

                      return (
                        <TouchableOpacity
                          key={avatar.id}
                          onPress={() => setSelectedAvatarKey(avatar.key)}
                          className="w-[48%] rounded-[14px] border p-3"
                          style={{
                            borderColor: isSelected ? '#e60000' : '#e5e7eb',
                            backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                          }}
                        >
                          <View className="items-center">
                            <Image source={avatarImage.source} className="h-16 w-16 rounded-full" resizeMode="cover" />
                            <Text className="mt-2 text-[13px] font-bold text-[#111827]">{avatar.label}</Text>
                            <Text 
                              className={`mt-0.5 text-[11px] font-medium ${
                                isSelected ? 'text-[#e60000]' : 'text-[#9ca3af]'
                              }`}
                            >
                              {isSelected ? t('profileSettings.selected') : t('profileSettings.select')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Kişisel Bilgiler Kartı */}
        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[20px] font-bold text-[#111827]">{t('profileSettings.personalInfoTitle')}</Text>

          <Text className="mb-1 text-[12px] font-semibold text-[#4b5563]">{t('profileSettings.nameLabel')}</Text>
          <View className="mb-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-3">
            <Text className="text-[14px] font-medium text-[#111827]">{defaultName}</Text>
          </View>

          <Text className="mb-1 text-[12px] font-semibold text-[#4b5563]">{t('profileSettings.emailLabel')}</Text>
          <View className="rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] px-3 py-3">
            <Text className="text-[14px] font-medium text-[#6b7280]">{defaultEmail}</Text>
          </View>
        </View>

        {/* Kazanılan Rozetler Kartı */}
        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[20px] font-bold text-[#111827]">{t('profileSettings.badgesTitle')}</Text>

          {fetchedBadges.length === 0 ? (
            <View className="items-center py-6">
              <Text className="mb-1 text-[15px] font-bold text-[#6b7280]">{t('profileSettings.noBadgesTitle')}</Text>
              <Text className="text-center text-[12px] text-[#9ca3af]">{t('profileSettings.noBadgesDesc')}</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-start gap-2">
              {fetchedBadges.map((badge, idx) => (
                <View key={`badge-${idx}`} className="mb-2 rounded-[10px] border border-[#dbeafe] bg-[#f0f9ff] px-3 py-2">
                  <Text className="text-[12px] font-bold text-[#1e3a8a]">{badge.title}</Text>
                  {badge.description && (
                    <Text className="mt-0.5 text-[10px] text-[#3730a3]">{badge.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity 
          onPress={handleSaveChanges} 
          disabled={savingAvatar}
          className="mt-5 items-center justify-center rounded-[12px] bg-[#e60000] py-3.5 shadow-sm active:opacity-90"
          style={{ opacity: savingAvatar ? 0.6 : 1 }}
        >
          {savingAvatar ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-[15px] font-bold text-white">{t('profileSettings.saveChangesBtn')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}