import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAvatarsList, getProfile, updateUserAvatar, type AvatarItem } from '@/services/api/endpoints/profile';
import { useAuthStore } from '@/stores/use-auth-store';
import { getProfileAvatar, useProfileStore, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { displayName } = useAuth();
  const profileDisplayName = useProfileStore((state) => state.displayName);
  const profileAvatarId = useProfileStore((state) => state.avatarId);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const defaultName = profileName?.trim() || profileDisplayName?.trim() || displayName?.trim() || 'Kullanici';
  const defaultEmail = useMemo(() => {
    if (profileEmail?.trim()) return profileEmail.trim();
    return `${defaultName.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')}@gmail.com`;
  }, [defaultName, profileEmail]);
  
  const [avatarsList, setAvatarsList] = useState<AvatarItem[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [selectedAvatarKey, setSelectedAvatarKey] = useState<string | null>(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

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

  useEffect(() => {
    let mounted = true;

    async function loadAvatars() {
      try {
        setLoadingAvatars(true);
        const res = await getAvatarsList();
        if (!mounted) return;
        
        if (res.status === 'success' && res.data) {
          console.log('[ProfileSettings] Backend\'den gelen avatarlar:', res.data);
          setAvatarsList(res.data);
        }
      } catch (e) {
        console.error('[ProfileSettings] loadAvatars error', e);
      } finally {
        setLoadingAvatars(false);
      }
    }

    async function loadProfile() {
      if (!authUser?.id || !authToken) return;

      try {
        const res = await getProfile(authUser.id, authToken);
        console.log('[ProfileSettings] profile raw response:', JSON.stringify(res, null, 2));

        if (!mounted) return;

        if (res.bodyStatus === 'success' || res.status === 200 || res.status === 201) {
          const user = res.data?.user;
          const badges = res.data?.badges || [];

          if (user) {
            console.log('[ProfileSettings] Backend\'den gelen user avatar:', user.avatar);
            setProfile({ displayName: user.full_name, avatarId: resolveAvatarId(user.avatar) });
            setProfileName(user.full_name ?? null);
            setProfileEmail(user.email ?? null);
            setSelectedAvatarKey(user.avatar ?? null);
          } else {
            // Olası alternatif response yapıları için güvenli fallback.
            const fallbackUser = (res as any)?.user ?? (res as any)?.data?.data?.user;
            if (fallbackUser) {
              console.log('[ProfileSettings] Fallback user avatar:', fallbackUser.avatar);
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

    return () => {
      mounted = false;
    };
  }, [authToken, authUser]);

  const handleSaveChanges = async () => {
    if (!selectedAvatarKey || !authUser?.id || !authToken) return;

    try {
      setSavingAvatar(true);
      console.log('[ProfileSettings] Seçili Avatar:', selectedAvatarKey);
      console.log('[ProfileSettings] Backend\'e Gönderiliyor:', { userId: authUser.id, avatar: selectedAvatarKey });
      
      const response = await updateUserAvatar(authUser.id, authToken, selectedAvatarKey);
      
      if (!mounted) return;
      
      console.log('[ProfileSettings] Avatar update başarılı response:', response);
      
      // Update local store
      setProfile({
        avatarId: resolveAvatarId(selectedAvatarKey),
      });
      
      setShowAvatarOptions(false);
      alert(`✅ Avatar "${selectedAvatarKey}" başarıyla güncellendi!`);
    } catch (e) {
      console.error('[ProfileSettings] Avatar update error:', e);
      alert('Avatar güncellenirken hata oluştu.');
    } finally {
      setSavingAvatar(false);
    }
  };

  let mounted = true;
  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <View className="bg-[#d80018] px-4 pb-4 pt-10">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <IconSymbol name="chevron.left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-[24px] font-extrabold text-white">Profili Düzenle</Text>
            <Text className="mt-0.5 text-[13px] text-white/90">Avatar ve bilgilerinizi güncelleyin</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="text-[30px] font-bold text-[#111827]">Profil Fotoğrafı</Text>

          <View className="mt-5 items-center">
            <View className="relative h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e60000] bg-[#fff1f2]">
              <Image 
                source={showAvatarOptions && selectedAvatarKey ? getAvatarImageByKey(selectedAvatarKey).source : savedAvatar.source} 
                className="h-full w-full" 
                resizeMode="cover" 
              />
              <View className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-[#e60000] px-2 py-1">
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowAvatarOptions((value) => !value)}
              className="mt-4 flex-row items-center justify-between rounded-full border border-[#ffd0d4] bg-[#fff5f6] px-4 py-2.5"
              activeOpacity={0.85}
            >
              <IconSymbol name="slider.horizontal.3" size={18} color="#b10016" />
              <Text className="flex-1 text-center text-[14px] font-semibold text-[#b10016]">
                Avatarı değiştirmek ister misiniz? 
              </Text>
              <IconSymbol name="slider.horizontal.3" size={18} color="#b10016" />
            </TouchableOpacity>

            {showAvatarOptions && (
              <View className="mt-4 w-full">
                <Text className="mb-2 text-center text-[14px] font-semibold text-[#111827]">Hazır avatar seçin</Text>
                
                {selectedAvatarKey && (
                  <View className="mb-3 rounded-[10px] bg-[#dbeafe] p-2">
                    <Text className="text-center text-[12px] font-semibold text-[#1e40af]">
                      Seçili: <Text className="font-bold">{selectedAvatarKey}</Text>
                    </Text>
                  </View>
                )}

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
                          onPress={() => {
                            console.log('[ProfileSettings] Avatar seçildi:', avatar.key, avatar);
                            setSelectedAvatarKey(avatar.key);
                          }}
                          className="w-[48%] rounded-[14px] border bg-white p-3"
                          style={{
                            borderColor: isSelected ? '#e60000' : '#e5e7eb',
                            backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                          }}
                        >
                          <View className="items-center">
                            <Image source={avatarImage.source} className="h-20 w-20 rounded-full" resizeMode="cover" />
                            <Text className="mt-2 text-[13px] font-semibold text-[#111827]">{avatar.label}</Text>
                            <Text className="mt-1 text-[11px] text-[#6b7280]">
                              {isSelected ? 'Seçili' : 'Seçilebilir'}
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

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Kişisel Bilgiler</Text>

          <Text className="mb-1 text-[14px] font-medium text-[#111827]">İsim</Text>
          <View className="mb-4 rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] px-3 py-3">
            <Text className="text-[15px] text-[#111827]">{defaultName}</Text>
          </View>

          <Text className="mb-1 text-[14px] font-medium text-[#111827]">E-posta</Text>
          <View className="rounded-[10px] border border-[#d1d5db] bg-[#eef0f3] px-3 py-3">
            <Text className="text-[15px] text-[#6b7280]">{defaultEmail}</Text>
          </View>
        </View>

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Kazanılan Rozetler</Text>

          {fetchedBadges.length === 0 ? (
            <View className="items-center py-8">
              <Text className="mb-2 text-[18px] font-semibold text-[#6b7280]">Henüz rozet kazanmadınız</Text>
              <Text className="text-center text-[14px] text-[#9ca3af]">Rotalar oluşturarak, paylaşarak ve etkinliklere katılarak rozetler kazanın!</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-start gap-2">
              {fetchedBadges.map((badge, idx) => (
                <View key={`badge-${idx}`} className="mb-3 rounded-[10px] border-2 border-[#dbeafe] bg-[#f0f9ff] px-3.5 py-2.5">
                  <Text className="text-[13px] font-bold text-[#1e3a8a]">{badge.title}</Text>
                  {badge.description ? (
                    <Text className="mt-0.5 text-[11px] text-[#3730a3]">{badge.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          onPress={handleSaveChanges} 
          disabled={savingAvatar}
          className="mt-4 items-center rounded-[10px] bg-[#e60000] py-3.5"
          style={{ opacity: savingAvatar ? 0.6 : 1 }}
        >
          {savingAvatar ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-[16px] font-bold text-white">Değişiklikleri Kaydet</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
