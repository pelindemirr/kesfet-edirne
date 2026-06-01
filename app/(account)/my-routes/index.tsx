import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUserCreatedRoutes, getUserSavedRoutes, type CommunityRouteApiItem } from '@/services/api/endpoints/community';
import { useAuthStore } from '@/stores/use-auth-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'created' | 'saved';

function getRouteTitle(route: CommunityRouteApiItem) {
  return route.route_name || route.routeName || route.title || 'Rota';
}

function getRouteDescription(route: CommunityRouteApiItem) {
  return route.description || route.place_preview || route.placePreview || '';
}

export default function MyRoutesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { isAuthenticated } = useAuth();
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);

  const [selectedTab, setSelectedTab] = useState<TabKey>(params.tab === 'saved' ? 'saved' : 'created');
  const [createdRoutes, setCreatedRoutes] = useState<CommunityRouteApiItem[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<CommunityRouteApiItem[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    setSelectedTab(params.tab === 'saved' ? 'saved' : 'created');
  }, [params.tab]);

  useEffect(() => {
    let mounted = true;

    async function loadRoutes() {
      if (!authUser?.id) return;

      try {
        setLoadingCreated(true);
        setLoadingSaved(true);

        const [createdResponse, savedResponse] = await Promise.all([
          getUserCreatedRoutes(authUser.id, authToken ?? undefined),
          getUserSavedRoutes(authUser.id, authToken ?? undefined),
        ]);

        if (!mounted) return;

        const createdData = Array.isArray(createdResponse.data) ? createdResponse.data : (createdResponse.data as any)?.routes ?? [];
        const savedData = Array.isArray(savedResponse.data) ? savedResponse.data : (savedResponse.data as any)?.routes ?? [];

        setCreatedRoutes(createdData as CommunityRouteApiItem[]);
        setSavedRoutes(savedData as CommunityRouteApiItem[]);
      } catch (error) {
        console.error('[MyRoutes] loadRoutes error', error);
      } finally {
        setLoadingCreated(false);
        setLoadingSaved(false);
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
            <View>{renderRouteList(savedRoutes, loadingSaved, 'Henüz kaydettiğiniz rota yok.')}</View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
