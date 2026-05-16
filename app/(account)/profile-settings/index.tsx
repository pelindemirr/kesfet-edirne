import { useAuth } from '@/components/auth/auth-context';
import { useRoutes } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BADGE_TIER_BG, calculateUnlockedBadges, sortBadgesByTier, type UserBadgeData } from '@/services/badge-system';
import { getProfileAvatar, PROFILE_AVATARS, useProfileStore } from '@/stores/use-profile-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type UserTag = {
  id: string;
  title: string;
  subtitle: string;
  tone: 'blue' | 'green' | 'yellow' | 'gray';
};

const userTags: UserTag[] = [
  { id: 'traveler', title: 'Gezgin', subtitle: '5 yer ziyaret etti', tone: 'blue' },
  { id: 'explorer', title: 'Kaşif', subtitle: '10 rota tamamladi', tone: 'green' },
  { id: 'social', title: 'Sosyal Gezgin', subtitle: '5 rota paylasti', tone: 'yellow' },
  { id: 'history', title: 'Tarih Meraklısı', subtitle: 'Tarihi duraklari sever', tone: 'gray' },
];

const tagStyleByTone: Record<UserTag['tone'], { card: string; border: string; title: string; subtitle: string }> = {
  blue: {
    card: '#e9f2ff',
    border: '#8ab6ff',
    title: '#1d4ed8',
    subtitle: '#2563eb',
  },
  green: {
    card: '#e7f8ee',
    border: '#74d39b',
    title: '#0f9f53',
    subtitle: '#0f9f53',
  },
  yellow: {
    card: '#fff8dc',
    border: '#f5cd35',
    title: '#b77900',
    subtitle: '#b77900',
  },
  gray: {
    card: '#f3f4f6',
    border: '#e5e7eb',
    title: '#9ca3af',
    subtitle: '#9ca3af',
  },
};

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { displayName } = useAuth();
  const routes = useRoutes();
  const profileDisplayName = useProfileStore((state) => state.displayName);
  const profileAvatarId = useProfileStore((state) => state.avatarId);
  const setProfile = useProfileStore((state) => state.setProfile);

  const defaultName = profileDisplayName?.trim() || displayName?.trim() || 'Kullanici';
  const defaultEmail = useMemo(() => `${defaultName.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')}@gmail.com`, [defaultName]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profileAvatarId);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  useEffect(() => {
    setSelectedAvatarId(profileAvatarId);
  }, [profileAvatarId]);

  // Gerçek kullanıcı rozet verilerini context'ten al
  const userBadgeData: UserBadgeData = useMemo(
    () => ({
      totalSavedRoutes: routes.getTotalSavedCount(),
      totalSharedRoutes: routes.getTotalSharedCount(),
      totalVisitedPlaces: routes.getTotalVisitedPlaces(),
      totalEvents: 0, // Etkinlik context'i daha yapılmadı
      historicalRoutesCreated: routes.getHistoricalRoutesCount(),
      natureRoutesCreated: routes.getNatureRoutesCount(),
      totalFavoritesReceived: routes.getTotalLikesReceived(),
      daysActive: 25, // Kullanıcı kayıtlı günleri hesapla (şu an mock)
      communityContributions: routes.getTotalSharedCount() + routes.getTotalLikesReceived(),
    }),
    [routes]
  );

  // Kazanılan rozetleri hesapla
  const unlockedBadges = useMemo(() => {
    const badges = calculateUnlockedBadges(userBadgeData);
    return sortBadgesByTier(badges);
  }, [userBadgeData]);

  const savedAvatar = getProfileAvatar(profileAvatarId);
  const selectedAvatar = getProfileAvatar(selectedAvatarId);

  const handleSaveChanges = () => {
    setProfile({
      avatarId: selectedAvatarId,
    });
    setShowAvatarOptions(false);
  };

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

          <View>
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
              <Image source={savedAvatar.source} className="h-full w-full" resizeMode="cover" />
              <View className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-[#e60000] px-2 py-1">
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowAvatarOptions((value) => !value)}
              className="mt-4 flex-row items-center justify-center rounded-full border border-[#ffd0d4] bg-[#fff5f6] px-4 py-2.5"
              activeOpacity={0.85}
            >
              <IconSymbol name={showAvatarOptions ? 'chevron.up' : 'chevron.down'} size={18} color="#b10016" />
              <Text className="ml-2 text-[14px] font-semibold text-[#b10016]">
                Avatarı değiştirmek ister misiniz? 
              </Text>
            </TouchableOpacity>

            {showAvatarOptions && (
              <View className="mt-4 w-full">
                <Text className="mb-2 text-center text-[14px] font-semibold text-[#111827]">Hazır avatar seçin</Text>

                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {PROFILE_AVATARS.map((avatar) => {
                    const isSelected = avatar.id === selectedAvatarId;
                    const isSaved = avatar.id === profileAvatarId;

                    return (
                      <TouchableOpacity
                        key={avatar.id}
                        onPress={() => setSelectedAvatarId(avatar.id)}
                        className="w-[48%] rounded-[14px] border bg-white p-3"
                        style={{
                          borderColor: isSelected ? '#e60000' : '#e5e7eb',
                          backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                        }}
                      >
                        <View className="items-center">
                          <Image source={avatar.source} className="h-20 w-20 rounded-full" resizeMode="cover" />
                          <Text className="mt-2 text-[13px] font-semibold text-[#111827]">{avatar.label}</Text>
                          <Text className="mt-1 text-[11px] text-[#6b7280]">
                            {isSaved ? 'Kaydedildi' : isSelected ? 'Seçili' : 'Seçilebilir'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View className="mt-4 flex-row flex-wrap justify-center gap-2">
              {userTags.slice(0, 3).map((tag) => (
                <View key={tag.id} className="rounded-full border border-[#f5cd35] bg-[#fff8dc] px-2.5 py-1">
                  <Text className="text-[12px] font-semibold text-[#946200]">{tag.title}</Text>
                </View>
              ))}
            </View>
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
          <Text className="mt-2 text-[12px] text-[#9ca3af]">İsim ve e-posta daha sonra backend üzerinden gelecek.</Text>
        </View>

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Kullanıcı Etiketleri</Text>

          <View className="flex-row flex-wrap justify-between">
            {userTags.map((tag) => {
              const style = tagStyleByTone[tag.tone];

              return (
                <View
                  key={tag.id}
                  className="mb-3 w-[48.5%] rounded-[12px] px-3 py-3"
                  style={{ backgroundColor: style.card, borderColor: style.border, borderWidth: 1 }}
                >
                  <Text className="text-[16px] font-bold" style={{ color: style.title }}>{tag.title}</Text>
                  <Text className="mt-1 text-[13px]" style={{ color: style.subtitle }}>{tag.subtitle}</Text>
                </View>
              );
            })}
          </View>

          <View className="mt-2 self-center rounded-full bg-[#f3f4f6] px-4 py-2">
            <Text className="text-[13px] font-semibold text-[#4b5563]">3 / 4 etiket aktif</Text>
          </View>
        </View>

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Rozetlerim</Text>

          {unlockedBadges.length === 0 ? (
            <View className="items-center py-8">
              <Text className="mb-2 text-[18px] font-semibold text-[#6b7280]">Henüz rozet kazanmadınız</Text>
              <Text className="text-center text-[14px] text-[#9ca3af]">Rotalar oluşturarak, paylaşarak ve etkinliklere katılarak rozetler kazanın!</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {unlockedBadges.map((badge) => (
                <View
                  key={badge.id}
                  className="mb-4 w-[31%] items-center rounded-[12px] px-3 py-4"
                  style={{ backgroundColor: BADGE_TIER_BG[badge.tier] }}
                >
                  <Text className="text-[32px]">{badge.icon}</Text>
                  <Text className="mt-2 text-center text-[13px] font-bold text-[#111827]">{badge.name}</Text>
                  <Text className="mt-1 text-center text-[11px] text-[#6b7280]">{badge.description}</Text>

                  {/* Tier badge */}
                  <View className="mt-2 rounded-full bg-white px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-[#111827]">
                      {badge.tier === 'bronze' && '🥉 Bronz'}
                      {badge.tier === 'silver' && '🥈 Gümüş'}
                      {badge.tier === 'gold' && '🥇 Altın'}
                      {badge.tier === 'platinum' && '💎 Platin'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="mt-4 flex-row items-center justify-between rounded-[12px] bg-[#f0fdf4] p-3">
            <View className="flex-1">
              <Text className="font-bold text-[#15803d]">İlerleme</Text>
              <Text className="text-[12px] text-[#16a34a]">{unlockedBadges.length} / 15 rozet kazanıldı</Text>
            </View>
            <Text className="text-[24px]">🎯</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveChanges} className="mt-4 items-center rounded-[10px] bg-[#e60000] py-3.5">
          <Text className="text-[16px] font-bold text-white">Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
