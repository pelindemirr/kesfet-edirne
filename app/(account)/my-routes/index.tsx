import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { useRoutes, type CommunitySavedRoute } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUserCreatedRoutes, type CommunityRouteApiItem } from '@/services/api/endpoints/community';
import { useAuthStore } from '@/stores/use-auth-store';
import { getProfileAvatar, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'created' | 'saved';

function getRouteTitle(route: CommunityRouteApiItem) {
  return route.route_name || route.routeName || route.title || 'Rota';
}

function getRouteDescription(route: CommunityRouteApiItem) {
  return route.description || route.place_preview || route.placePreview || '';
}

function resolveAvatarId(avatar?: string): ProfileAvatarId | undefined {
  if (!avatar) return undefined;

  const normalizedAvatar = avatar.toLocaleLowerCase('tr-TR');
  if (normalizedAvatar === 'man' || normalizedAvatar === 'klasik') return 'man';
  if (normalizedAvatar === 'woman' || normalizedAvatar === 'modern') return 'woman';
  if (normalizedAvatar === 'man2' || normalizedAvatar === 'sportif') return 'man2';
  if (normalizedAvatar === 'woman2' || normalizedAvatar === 'zarif') return 'woman2';
  return undefined;
}

export default function MyRoutesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { isAuthenticated } = useAuth();
  const { savedCommunityRoutes, savedCommunityRoutesLoading } = useRoutes();
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);

  const [selectedTab, setSelectedTab] = useState<TabKey>(params.tab === 'saved' ? 'saved' : 'created');
  const [createdRoutes, setCreatedRoutes] = useState<CommunityRouteApiItem[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);

  useEffect(() => {
    setSelectedTab(params.tab === 'saved' ? 'saved' : 'created');
  }, [params.tab]);

  useEffect(() => {
    let mounted = true;

    async function loadRoutes() {
      if (!authUser?.id) return;

      try {
        setLoadingCreated(true);

        const createdResponse = await getUserCreatedRoutes(authUser.id, authToken ?? undefined);

        if (!mounted) return;

        const createdData = Array.isArray(createdResponse.data) ? createdResponse.data : (createdResponse.data as any)?.routes ?? [];

        setCreatedRoutes(createdData as CommunityRouteApiItem[]);
      } catch (error) {
        console.error('[MyRoutes] loadRoutes error', error);
      } finally {
        setLoadingCreated(false);
      }
    }

    loadRoutes();

    return () => {
      mounted = false;
    };
  }, [authUser?.id, authToken]);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f3f4f6]">
        <Header />
        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full max-w-[360px] rounded-[18px] border border-[#ffd6d6] bg-white p-5">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-[14px] bg-[#fef2f2]">
              <IconSymbol name="lock.fill" size={24} color="#dc2626" />
            </View>
            <Text className="mb-1 text-[20px] font-bold text-[#111827]">Giriş gerekli</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              Kendi rotalarınızı ve kaydedilen rotaları görmek için giriş yapabilirsiniz.
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="items-center rounded-[12px] bg-[#dc2626] py-3">
              <Text className="text-[14px] font-bold text-white">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const renderRouteList = (routes: CommunityRouteApiItem[], loading: boolean, emptyText: string) => {
    if (loading) {
      return <ActivityIndicator />;
    }

    if (routes.length === 0) {
      return <Text className="text-[14px] text-[#6b7280]">{emptyText}</Text>;
    }

    return (
      <View className="gap-2">
        {routes.map((route) => (
          <View key={String(route.id)} className="rounded-[12px] border border-[#e5e7eb] bg-white px-3 py-3">
            <Text className="text-[15px] font-semibold text-[#111827]">{getRouteTitle(route)}</Text>
            {getRouteDescription(route) ? <Text className="mt-1 text-[13px] text-[#6b7280]">{getRouteDescription(route)}</Text> : null}
          </View>
        ))}
      </View>
    );
  };

  const renderSavedRouteList = (routes: CommunitySavedRoute[], loading: boolean, emptyText: string) => {
    if (loading) {
      return <ActivityIndicator />;
    }

    if (routes.length === 0) {
      return <Text className="text-[14px] text-[#6b7280]">{emptyText}</Text>;
    }

    return (
      <View className="gap-3">
        {routes.map((route) => {
          const avatarId = resolveAvatarId(route.creatorAvatarId);
          const avatarSource = avatarId ? getProfileAvatar(avatarId).source : null;

          return (
            <View key={route.id} className="overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white">
              <View className="px-4 py-4">
                <View className="mb-3 flex-row items-center gap-3">
                  <View className="h-11 w-11 overflow-hidden rounded-full bg-[#f3f4f6]">
                    {avatarSource ? (
                      <Image source={avatarSource} className="h-full w-full" resizeMode="cover" />
                    ) : (
                      <View className="h-full w-full items-center justify-center bg-[#dc2626]">
                        <Text className="text-[15px] font-bold text-white">{route.authorInitial}</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-[#111827]">{route.authorName}</Text>
                    <Text className="text-[12px] text-[#6b7280]">{route.district}</Text>
                  </View>

                  <View className="rounded-full bg-[#fff1f2] px-2.5 py-1">
                    <Text className="text-[12px] font-semibold text-[#dc2626]">⭐ {route.rating.toFixed(1)}</Text>
                  </View>
                </View>

                <Text className="text-[17px] font-extrabold text-[#111827]">{route.title}</Text>
                {route.placePreview ? <Text className="mt-1 text-[13px] leading-[19px] text-[#4b5563]">{route.placePreview}</Text> : null}

                <View className="mt-3 flex-row flex-wrap items-center gap-2">
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">📍 {route.stopCount} durak</Text>
                  </View>
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">💬 {route.commentCount}</Text>
                  </View>
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">{route.createdAt}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="rounded-[18px] border border-[#e5e7eb] bg-white p-5">
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-[24px] font-extrabold text-[#111827]">Rotalarım</Text>
              <Text className="mt-1 text-[13px] text-[#6b7280]">Kendi oluşturduklarınızı ve kaydettiklerinizi ayrı görün.</Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center rounded-[12px] bg-[#f8fafc] p-1">
            <TouchableOpacity
              onPress={() => setSelectedTab('created')}
              className={`flex-1 items-center rounded-[10px] px-3 py-2 ${selectedTab === 'created' ? 'bg-white' : ''}`}
            >
              <Text className={`${selectedTab === 'created' ? 'font-bold text-[#111827]' : 'text-[#6b7280]'}`}>Rotalarım</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('saved')}
              className={`flex-1 items-center rounded-[10px] px-3 py-2 ${selectedTab === 'saved' ? 'bg-white' : ''}`}
            >
              <Text className={`${selectedTab === 'saved' ? 'font-bold text-[#111827]' : 'text-[#6b7280]'}`}>Kaydedilenler</Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'created' ? (
            <View>
              <TouchableOpacity onPress={() => router.push('/rota')} className="mb-3 items-center rounded-[12px] bg-[#dc2626] py-3">
                <Text className="text-[14px] font-bold text-white">Yeni Rota Oluştur</Text>
              </TouchableOpacity>

              {renderRouteList(createdRoutes, loadingCreated, 'Henüz oluşturduğunuz rota yok.')}
            </View>
          ) : (
            <View>{renderSavedRouteList(savedCommunityRoutes, savedCommunityRoutesLoading, 'Henüz kaydettiğiniz rota yok.')}</View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
