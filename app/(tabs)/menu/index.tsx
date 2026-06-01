import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { useRoutes } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getProfile } from '@/services/api/endpoints/profile';
import { useAuthStore } from '@/stores/use-auth-store';
import { getProfileAvatar, useProfileStore } from '@/stores/use-profile-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type MenuAction = {
  id: string;
  label: string;
  icon: any;
  href: string;
  iconTint: string;
  cardClass: string;
  iconClass: string;
};

const profileTags = ['Gezgin', 'Kasif', 'Sosyal Gezgin'];

const mapIcon = require('../../../assets/icon/map.png');
const rotaIcon = require('../../../assets/icon/rota.png');
const eventsIcon = require('../../../assets/icon/events.png');
const groupsIcon = require('../../../assets/icon/groups.png');
const menuIcon = require('../../../assets/icon/menu.png');
const editIcon = require('../../../assets/icon/edit.png');

const menuActions: MenuAction[] = [
  {
    id: 'home',
    label: 'Ana Sayfa',
    icon: menuIcon,
    href: '/(tabs)',
    iconTint: '#d32f2f',
    cardClass: 'border-[#ffd8d6] bg-[#fff4f4]',
    iconClass: 'bg-[#ffe8e5]',
  },
  {
    id: 'map',
    label: 'Harita',
    icon: mapIcon,
    href: '/explore',
    iconTint: '#2b72d6',
    cardClass: 'border-[#d8e8ff] bg-[#f4f9ff]',
    iconClass: 'bg-[#e8f2ff]',
  },
  {
    id: 'saved',
    label: 'Hazır Rotalar',
    icon: rotaIcon,
    href: '/rota',
    iconTint: '#d08a1f',
    cardClass: 'border-[#ffe3bf] bg-[#fff8ee]',
    iconClass: 'bg-[#ffefd8]',
  },
  {
    id: 'created-routes',
    label: 'Kişisel Rotalarım',
    icon: rotaIcon,
    href: '/my-routes',
    iconTint: '#c75a12',
    cardClass: 'border-[#fff1e6] bg-[#fff9f2]',
    iconClass: 'bg-[#fff3e0]',
  },
  {
    id: 'community',
    label: 'Topluluk',
    icon: groupsIcon,
    href: '/community',
    iconTint: '#7656d6',
    cardClass: 'border-[#e6dbff] bg-[#f8f4ff]',
    iconClass: 'bg-[#efe7ff]',
  },
  {
    id: 'routes',
    label: 'Rotalar',
    icon: rotaIcon,
    href: '/rota',
    iconTint: '#d08a1f',
    cardClass: 'border-[#ffe3bf] bg-[#fff8ee]',
    iconClass: 'bg-[#ffefd8]',
  },
  {
    id: 'events',
    label: 'Etkinlikler',
    icon: eventsIcon,
    href: '/events',
    iconTint: '#0f8f8b',
    cardClass: 'border-[#d2ecea] bg-[#f0f8f8]',
    iconClass: 'bg-[#e6f4f3]',
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const { isAuthenticated, displayName, signOut } = useAuth();
  const authToken = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const routes = useRoutes();
  const profileAvatarId = useProfileStore((state) => state.avatarId);

  const [profileNameFromApi, setProfileNameFromApi] = useState<string | null>(null);
  const [profileEmailFromApi, setProfileEmailFromApi] = useState<string | null>(null);
  const [profileBadgesFromApi, setProfileBadgesFromApi] = useState<Array<{ title: string; description?: string }>>([]);
  const [loginStreakFromApi, setLoginStreakFromApi] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfileForMenu() {
      if (!isAuthenticated || !authUser?.id || !authToken) return;

      try {
        const response = await getProfile(authUser.id, authToken);
        if (!mounted) return;

        if (response.bodyStatus === 'success' || response.status === 200 || response.status === 201) {
          setProfileNameFromApi(response.data?.user?.full_name ?? null);
          setProfileEmailFromApi(response.data?.user?.email ?? null);
          setProfileBadgesFromApi(response.data?.badges ?? []);
          setLoginStreakFromApi(response.data?.user?.login_streak ?? null);
        }
      } catch (error) {
        console.error('[MenuScreen] Profil verisi alınamadı', error);
      }
    }

    loadProfileForMenu();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authUser, authToken]);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f3f4f6]">
        <Header />

        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full rounded-[18px] border border-[#f2d0d4] bg-white p-5 shadow-lg shadow-black/10">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-[#fdecee]">
              <IconSymbol name="person.3.fill" size={24} color="#b10016" />
            </View>
            <Text className="mb-1 text-[19px] font-bold text-[#111827]">Giriş gerekli</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              Profil menüsü, kayıtlı rotalarınız ve ayarlarınız yalnizca giriş yapan kullanıcılar için açıktır.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              className="items-center rounded-[12px] bg-[#b10016] py-3"
            >
              <Text className="text-[14px] font-bold text-white">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const userName = useMemo(
    () => profileNameFromApi?.trim() || displayName?.trim() || 'Kullanici',
    [profileNameFromApi, displayName]
  );
  const userEmail = useMemo(() => {
    if (profileEmailFromApi?.trim()) return profileEmailFromApi.trim();
    return `${userName.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')}@gmail.com`;
  }, [profileEmailFromApi, userName]);
  const profileAvatar = getProfileAvatar(profileAvatarId);

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-8">
        <View className="px-4 pb-2 pt-4">
         
        </View>

        <View className="mx-4 rounded-[16px] border border-[#e5e7eb] bg-white p-5 shadow-lg shadow-black/10">
          <View className="flex-row items-center">
            <View className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-[#e60000] bg-[#fff1f2]">
              <Image source={profileAvatar.source} className="h-full w-full" resizeMode="cover" />
            </View>

            <View className="flex-1">
              <Text className="text-[24px] font-extrabold text-[#111827]">{userName}</Text>
              <Text className="text-[14px] text-[#6b7280]">{userEmail}</Text>

             

              {profileBadgesFromApi.length > 0 ? (
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {profileBadgesFromApi.map((badge, index) => (
                    <View key={`menu-badge-${index}`} className="rounded-full border border-[#dbeafe] bg-[#eff6ff] px-2.5 py-1">
                      <Text className="text-[11px] font-semibold text-[#1d4ed8]">{badge.title}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View className="mt-5 flex-row justify-between gap-2">
            <View className="flex-1 rounded-[12px] bg-gradient-to-br from-[#fff7ed] to-[#ffefd8] border border-[#fed7aa] px-3 py-3.5">
              {loginStreakFromApi === 1 ? (
                <View className="items-center">
                  <Text className="text-[36px]">🔥</Text>
                  <Text className="mt-1 text-[12px] font-semibold text-[#b45309]">İlk Gün!</Text>
                </View>
              ) : (
                <>
                  <View className="flex-row items-center">
                    <Text className="text-[24px]">🔥</Text>
                    <Text className="ml-2 text-[24px] font-extrabold text-[#b45309]">{loginStreakFromApi ?? 0}</Text>
                  </View>
                  <Text className="mt-1 text-[11px] text-[#b45309] font-semibold">Gün Serisi</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View className="mx-4 mt-5">
  

          <View className="gap-2.5 pb-4">
            {menuActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => router.push(action.href as any)}
                className={`flex-row items-center rounded-[14px] border px-4 py-4 ${action.cardClass} shadow-sm shadow-black/5`}
              >
                {action.id === 'home' ? (
                  <View
                    className={`mr-3 h-9 w-9 items-center justify-center rounded-[10px] ${action.iconClass}`}
                  >
                    <IconSymbol name="house.fill" size={18} color={action.iconTint} />
                  </View>
                ) : (
                  <View
                    className={`mr-3 h-9 w-9 items-center justify-center rounded-[10px] ${action.iconClass}`}
                  >
                    <Image source={action.icon} className="h-5 w-5" resizeMode="contain" style={{ tintColor: action.iconTint }} />
                  </View>
                )}
                <Text className="flex-1 text-[18px] font-semibold text-[#0f172a]">{action.label}</Text>
                <IconSymbol name="chevron.right" size={18} color={action.iconTint} />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mb-2 mt-5 text-[17px] font-semibold text-[#64748b]">Hesap</Text>

          <TouchableOpacity
            onPress={() => router.push('/(account)/profile-settings' as any)}
              className="mb-2.5 flex-row items-center rounded-[14px] border border-[#d7dbe1] bg-white px-4 py-4 shadow-sm shadow-black/5"
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-[10px] bg-[#f3f4f6]">
              <Image source={editIcon} className="h-5 w-5" resizeMode="contain" style={{ tintColor: '#4b5563' }} />
            </View>
            <Text className="flex-1 text-[18px] font-semibold text-[#0f172a]">Profil Ayarları</Text>
            <IconSymbol name="chevron.right" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              signOut();
              router.replace('/(auth)/login' as any);
            }}
            className="flex-row items-center rounded-[14px] border border-[#f2b6be] bg-white px-4 py-4 shadow-sm shadow-black/5"
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-[10px] bg-[#fff1f2]">
              <IconSymbol name="paperplane.fill" size={16} color="#dc2626" />
            </View>
            <Text className="flex-1 text-[18px] font-semibold text-[#dc2626]">Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}