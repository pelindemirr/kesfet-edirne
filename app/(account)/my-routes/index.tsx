import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { useRoutes, type CommunitySavedRoute } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

// API entegrasyonu
import {
  deleteUserCreatedRoute,
  getUserCreatedRoutes,
  unsaveCommunityRoute,
  type CommunityRouteApiItem
} from '@/services/api/endpoints/community';

import { useAuthStore } from '@/stores/use-auth-store';
import { getProfileAvatar, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n eklendi
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'created' | 'saved';

function getRouteTitle(route: CommunityRouteApiItem, t: any) {
  return route.route_name || route.routeName || route.title || t('myRoutes.defaultRouteName');
}

function getRouteDescription(route: CommunityRouteApiItem) {
  return route.description || route.place_preview || route.placePreview || '';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
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
  const { t } = useTranslation(); // Çeviri fonksiyonu tanımlandı
  
  const { savedCommunityRoutes, savedCommunityRoutesLoading, refreshSavedRoutes } = useRoutes() as any;
  
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);

  const [selectedTab, setSelectedTab] = useState<TabKey>(params.tab === 'saved' ? 'saved' : 'created');
  const [createdRoutes, setCreatedRoutes] = useState<CommunityRouteApiItem[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);

  const [localSavedRoutes, setLocalSavedRoutes] = useState<CommunitySavedRoute[]>([]);
  const [unsavingId, setUnsavingId] = useState<number | string | null>(null);
  const [deletingCreatedId, setDeletingCreatedId] = useState<number | string | null>(null);

  useEffect(() => {
    setSelectedTab(params.tab === 'saved' ? 'saved' : 'created');
  }, [params.tab]);

  useEffect(() => {
    if (savedCommunityRoutes) {
      setLocalSavedRoutes(savedCommunityRoutes);
    }
  }, [savedCommunityRoutes]);

  const loadCreatedRoutes = async () => {
    if (!authUser?.id) return;
    try {
      setLoadingCreated(true);
      const createdResponse = await getUserCreatedRoutes(authUser.id, authToken ?? undefined);
      const createdData = Array.isArray(createdResponse.data)
        ? createdResponse.data
        : (createdResponse.data as any)?.routes ?? [];
      setCreatedRoutes(createdData as CommunityRouteApiItem[]);
    } catch (error) {
      console.error('[MyRoutes] loadRoutes error', error);
    } finally {
      setLoadingCreated(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCreatedRoutes();
    }
  }, [authUser?.id, authToken, isAuthenticated]);

  const handleUnsaveRoute = (route: CommunitySavedRoute) => {
    if (unsavingId !== null) return;

    Alert.alert(
      t('myRoutes.alerts.unsaveTitle'),
      t('myRoutes.alerts.unsaveMessage', { title: route.title }),
      [
        { text: t('myRoutes.alerts.cancel'), style: 'cancel' },
        {
          text: t('myRoutes.alerts.remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              setUnsavingId(route.id);
              const response = await unsaveCommunityRoute(route.id, authToken ?? undefined);

              if (response.status === 200 || response.bodyStatus === 'success') {
                setLocalSavedRoutes((prev) => prev.filter((r: any) => String(r.id) !== String(route.id)));
                if (typeof refreshSavedRoutes === 'function') {
                  refreshSavedRoutes();
                }
              } else {
                Alert.alert(t('myRoutes.alerts.error'), response.message || t('myRoutes.alerts.unsaveError'));
              }
            } catch (error) {
              console.error('[MyRoutes] Unsave error:', error);
              Alert.alert(t('myRoutes.alerts.error'), t('myRoutes.alerts.unsaveFailed'));
            } finally {
              setUnsavingId(null);
            }
          },
        },
      ]
    );
  };

  const handleDeleteCreatedRoute = (route: CommunityRouteApiItem) => {
    const routeId = route.id;
    if (!routeId || deletingCreatedId !== null) return;

    Alert.alert(
      t('myRoutes.alerts.deleteTitle'),
      t('myRoutes.alerts.deleteMessage', { title: getRouteTitle(route, t) }),
      [
        { text: t('myRoutes.alerts.cancel'), style: 'cancel' },
        {
          text: t('myRoutes.alerts.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingCreatedId(routeId);
              
              const response = await deleteUserCreatedRoute(routeId, authToken ?? undefined);
              
              const res = response as any;
              if (res.status === 'success' || res.bodyStatus === 'success' || res.status === 200) {
                setCreatedRoutes((prev) => prev.filter((r: any) => String(r.id) !== String(routeId)));
              } else {
                Alert.alert(t('myRoutes.alerts.error'), response.message || t('myRoutes.alerts.deleteError'));
              }
            } catch (error) {
              console.error('[MyRoutes] Delete route error:', error);
              Alert.alert(t('myRoutes.alerts.error'), t('myRoutes.alerts.deleteFailed'));
            } finally {
              setDeletingCreatedId(null);
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f3f4f6]">
        <Header />
        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full max-w-[360px] rounded-[18px] border border-[#ffd6d6] bg-white p-5">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-[14px] bg-[#fef2f2]">
              <IconSymbol name="lock.fill" size={24} color="#dc2626" />
            </View>
            <Text className="mb-1 text-[20px] font-bold text-[#111827]">{t('myRoutes.authRequired')}</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              {t('myRoutes.authDesc')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="items-center rounded-[12px] bg-[#dc2626] py-3"
            >
              <Text className="text-[14px] font-bold text-white">{t('myRoutes.loginButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const renderRouteList = (routes: CommunityRouteApiItem[], loading: boolean, emptyText: string) => {
    if (loading) {
      return <ActivityIndicator color="#dc2626" />;
    }

    if (routes.length === 0) {
      return <Text className="text-[14px] text-[#6b7280]">{emptyText}</Text>;
    }

    return (
      <View className="gap-3">
        {routes.map((route) => {
          const rating = Number(route.average_rating ?? route.averageRating ?? 0) || 0;
          const reviewCount = Number(route.review_count ?? route.reviewCount ?? 0) || 0;
          const district = route.district ?? t('myRoutes.defaultDistrict');
          const stopCount = Number(route.place_count ?? route.placeCount ?? route.stop_count ?? route.stopCount ?? 0);
          const placePreview = route.place_preview ?? route.placePreview ?? '';

          const safeUser = authUser as any;
          const rawAvatar = safeUser?.avatar || safeUser?.avatar_url || safeUser?.imageUrl || '';
          const rawName = safeUser?.name || safeUser?.fullName || safeUser?.username || t('myRoutes.me');

          const selfAvatarSource = rawAvatar ? getProfileAvatar(resolveAvatarId(rawAvatar) ?? 'man').source : null;

          return (
            <View key={String(route.id)} className="overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white">
              <View className="px-4 py-4">
                
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="h-11 w-11 overflow-hidden rounded-full bg-[#f3f4f6]">
                      {selfAvatarSource ? (
                        <Image source={selfAvatarSource} className="h-full w-full" resizeMode="cover" />
                      ) : (
                        <View className="h-full w-full items-center justify-center bg-[#dc2626]">
                          <Text className="text-[15px] font-bold text-white">
                            {rawName ? rawName.charAt(0).toUpperCase() : 'B'}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-[16px] font-bold text-[#111827]" numberOfLines={1}>
                        {rawName}
                      </Text>
                      <Text className="text-[12px] text-[#6b7280]">{district}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="rounded-full bg-[#fff1f2] px-2.5 py-1">
                      <Text className="text-[12px] font-semibold text-[#dc2626]">
                        ⭐ {rating.toFixed(1)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDeleteCreatedRoute(route)}
                      disabled={deletingCreatedId === route.id}
                      className="h-8 w-8 items-center justify-center rounded-full bg-[#fee2e2]"
                      style={{ opacity: deletingCreatedId === route.id ? 0.5 : 1 }}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="trash.fill" size={14} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-[17px] font-extrabold text-[#111827]">
                  {getRouteTitle(route, t)}
                </Text>

                {getRouteDescription(route) ? (
                  <Text className="mt-1 text-[13px] leading-[19px] text-[#4b5563]">
                    {getRouteDescription(route)}
                  </Text>
                ) : null}

                {placePreview ? (
                  <Text className="mt-2 text-[12px] text-[#6b7280]">
                    <Text className="font-semibold text-[#111827]">{t('myRoutes.stopsPrefix')}</Text>
                    {placePreview}
                  </Text>
                ) : null}

                <View className="mt-3 flex-row flex-wrap items-center gap-2">
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">📍 {stopCount} {t('myRoutes.stops')}</Text>
                  </View>
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">💬 {reviewCount} {t('myRoutes.comments')}</Text>
                  </View>
                  {(route as any).createdAt || route.created_at ? (
                    <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                      <Text className="text-[12px] text-[#374151]">📅 {formatDate((route as any).createdAt || route.created_at)}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSavedRouteList = (routes: CommunitySavedRoute[], loading: boolean, emptyText: string) => {
    if (loading) {
      return <ActivityIndicator color="#dc2626" />;
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
                
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-3">
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
                      <Text className="text-[16px] font-bold text-[#111827]" numberOfLines={1}>
                        {route.authorName}
                      </Text>
                      <Text className="text-[12px] text-[#6b7280]">{route.district || t('myRoutes.defaultDistrict')}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="rounded-full bg-[#fff1f2] px-2.5 py-1">
                      <Text className="text-[12px] font-semibold text-[#dc2626]">
                        ⭐ {route.rating ? route.rating.toFixed(1) : '0.0'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleUnsaveRoute(route)}
                      disabled={unsavingId === route.id}
                      className="h-8 w-8 items-center justify-center rounded-full bg-[#fee2e2]"
                      style={{ opacity: unsavingId === route.id ? 0.5 : 1 }}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="bookmark.fill" size={14} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-[17px] font-extrabold text-[#111827]">
                  {route.title}
                </Text>
                
                {route.placePreview ? (
                  <Text className="mt-1 text-[13px] leading-[19px] text-[#4b5563]">{route.placePreview}</Text>
                ) : null}

                <View className="mt-3 flex-row flex-wrap items-center gap-2">
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">📍 {route.stopCount || 0} {t('myRoutes.stops')}</Text>
                  </View>
                  <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                    <Text className="text-[12px] text-[#374151]">💬 {route.commentCount || 0} {t('myRoutes.comments')}</Text>
                  </View>
                  {route.createdAt ? (
                    <View className="rounded-full bg-[#f8fafc] px-2.5 py-1">
                      <Text className="text-[12px] text-[#374151]">📅 {formatDate(route.createdAt)}</Text>
                    </View>
                  ) : null}
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
              <Text className="text-[24px] font-extrabold text-[#111827]">{t('myRoutes.title')}</Text>
              <Text className="mt-1 text-[13px] text-[#6b7280]">
                {t('myRoutes.subtitle')}
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center rounded-[12px] bg-[#f8fafc] p-1">
            <TouchableOpacity
              onPress={() => setSelectedTab('created')}
              className={`flex-1 items-center rounded-[10px] px-3 py-2 ${selectedTab === 'created' ? 'bg-white' : ''}`}
            >
              <Text className={`${selectedTab === 'created' ? 'font-bold text-[#111827]' : 'text-[#6b7280]'}`}>
                {t('myRoutes.tabCreated')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('saved')}
              className={`flex-1 items-center rounded-[10px] px-3 py-2 ${selectedTab === 'saved' ? 'bg-white' : ''}`}
            >
              <Text className={`${selectedTab === 'saved' ? 'font-bold text-[#111827]' : 'text-[#6b7280]'}`}>
                {t('myRoutes.tabSaved')}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'created' ? (
            <View>
              <TouchableOpacity
                onPress={() => router.push('/explore')}
                className="mb-3 items-center rounded-[12px] bg-[#dc2626] py-3"
              >
                <Text className="text-[14px] font-bold text-white">{t('myRoutes.createRouteButton')}</Text>
              </TouchableOpacity>

              {renderRouteList(createdRoutes, loadingCreated, t('myRoutes.emptyCreated'))}
            </View>
          ) : (
            <View>
              {renderSavedRouteList(localSavedRoutes, savedCommunityRoutesLoading, t('myRoutes.emptySaved'))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}