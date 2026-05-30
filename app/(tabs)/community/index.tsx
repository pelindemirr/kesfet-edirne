import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getCommunityRoutes, type CommunityRouteApiItem } from '@/services/api/endpoints/community';
import { getProfileAvatar, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SortOption = 'Populer' | 'En Iyi' | 'Yeni';

type CommunityRoute = {
  id: string;
  authorName: string;
  authorInitial: string;
  creatorAvatarId?: ProfileAvatarId;
  createdAt: string;
  title: string;
  description: string;
  placePreview: string;
  stopCount: number;
  district: string;
  rating: number;
  reviewCount: number;
  commentCount: number;
  popularityScore: number;
};

const sortOptions: SortOption[] = ['Populer', 'En Iyi', 'Yeni'];

function parseDate(dateText: string) {
  if (!dateText) return 0;

  const normalized = dateText.includes('.') ? dateText : dateText.replace(/-/g, '.');
  const parts = normalized.split('.').map(Number);

  if (parts.length >= 3 && parts.every((part) => !Number.isNaN(part))) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).getTime();
  }

  const fallback = Date.parse(dateText);
  return Number.isNaN(fallback) ? 0 : fallback;
}

function getAuthorInitial(authorName: string) {
  return authorName.trim().charAt(0).toLocaleUpperCase('tr-TR') || 'K';
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

function normalizeRoute(item: CommunityRouteApiItem, index: number): CommunityRoute {
  const authorName =
    item.creatorName ??
    item.creator_name ??
    item.authorName ??
    item.author_name ??
    'Anonim Kullanici';
  const createdAt = item.createdAt ?? item.created_at ?? '';
  const routeName = item.routeName ?? item.route_name ?? item.title ?? 'Adsiz Rota';
  const placeCount = item.placeCount ?? item.place_count ?? item.stopCount ?? item.stop_count ?? 0;
  const averageRating = item.averageRating ?? item.average_rating ?? item.rating ?? 0;
  const reviewCount = item.reviewCount ?? item.review_count ?? item.commentCount ?? item.comment_count ?? 0;
  const creatorAvatarId = resolveAvatarId(item.creatorAvatar ?? item.creator_avatar);
  const placePreview = item.placePreview ?? item.place_preview ?? '';

  return {
    id: String(item.id ?? index),
    authorName,
    authorInitial: item.authorInitial ?? item.author_initial ?? getAuthorInitial(authorName),
    creatorAvatarId,
    createdAt,
    title: routeName,
    description: item.description ?? '',
    placePreview,
    stopCount: placeCount,
    district: item.district ?? 'Bilinmiyor',
    rating: Number(averageRating) || 0,
    reviewCount: Number(reviewCount) || 0,
    commentCount: Number(reviewCount) || 0,
    popularityScore: item.popularityScore ?? item.popularity_score ?? item.views ?? 0,
  };
}

function extractRouteItems(responseData: CommunityRouteApiItem[] | { routes?: CommunityRouteApiItem[] } | undefined) {
  if (Array.isArray(responseData)) return responseData;
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.routes)) {
    return responseData.routes;
  }
  return [];
}

export default function CommunityRoutesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('Populer');
  const [selectedDistrict, setSelectedDistrict] = useState('Tum Ilceler');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [districtMenuOpen, setDistrictMenuOpen] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routes, setRoutes] = useState<CommunityRoute[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadCommunityRoutes() {
      try {
        setLoadingRoutes(true);
        const response = await getCommunityRoutes();

        if (!mounted) return;

        if (response.status === 200 || response.bodyStatus === 'success') {
          const items = extractRouteItems(response.data);
          const normalizedRoutes = items.map(normalizeRoute);

          console.log('[COMMUNITY_ROUTES] Normalized routes:', normalizedRoutes);
          setRoutes(normalizedRoutes);
        } else {
          console.log('[COMMUNITY_ROUTES] Non-success response:', response);
          setRoutes([]);
        }
      } catch (error) {
        console.error('[COMMUNITY_ROUTES] loadCommunityRoutes error', error);
        if (mounted) {
          setRoutes([]);
        }
      } finally {
        if (mounted) {
          setLoadingRoutes(false);
        }
      }
    }

    loadCommunityRoutes();

    return () => {
      mounted = false;
    };
  }, []);

  const districtOptions = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(routes.map((route) => route.district).filter(Boolean)));
    return ['Tum Ilceler', ...uniqueDistricts];
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('tr-TR');

    const baseFiltered = routes.filter((route) => {
      const matchesDistrict = selectedDistrict === 'Tum Ilceler' || route.district === selectedDistrict;

      if (!normalizedSearch) {
        return matchesDistrict;
      }

      const searchable = `${route.title} ${route.description} ${route.authorName} ${route.district}`.toLocaleLowerCase('tr-TR');
      return matchesDistrict && searchable.includes(normalizedSearch);
    });

    const sorted = [...baseFiltered];

    if (selectedSort === 'Populer') {
      sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (selectedSort === 'En Iyi') {
      sorted.sort((a, b) => {
        if (b.rating === a.rating) {
          return b.reviewCount - a.reviewCount;
        }
        return b.rating - a.rating;
      });
    } else {
      sorted.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));
    }

    return sorted;
  }, [routes, searchQuery, selectedDistrict, selectedSort]);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#f3f4f6]">
        <Header />

        <View className="flex-1 items-center justify-center px-5">
          <View className="w-full max-w-[360px] rounded-[18px] border border-[#ffd6d6] bg-white p-5">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-[14px] bg-[#fef2f2]">
              <IconSymbol name="lock.fill" size={24} color="#dc2626" />
            </View>
            <Text className="mb-1 text-[20px] font-bold text-[#111827]">Topluluk rotaları için giriş gerekli</Text>
            <Text className="mb-4 text-[14px] leading-[20px] text-[#6b7280]">
              Diğer kullanıcıların paylaştığı rotaları görmek ve incelemek için lütfen giriş yapın.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="items-center rounded-[12px] bg-[#dc2626] py-3"
            >
              <Text className="text-[14px] font-bold text-white">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      <View className="border-b border-[#e5e7eb] bg-white px-4 pb-3 pt-4">
        <Text className="text-[26px] font-bold text-[#111827]">Topluluk Rotaları</Text>
        <Text className="mt-1 text-[15px] text-[#6b7280]">Paylaşılan rotaları keşfedin</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 88 }}>
        <View className="mb-3 flex-row items-center rounded-[14px] border border-[#d5d9df] bg-[#eef1f5] px-3 py-2.5">
          <IconSymbol name="magnifyingglass" size={18} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rota veya yer ara..."
            placeholderTextColor="#9ca3af"
            className="ml-2 flex-1 text-[14px] text-[#111827]"
          />
        </View>

        <View className="mb-3 flex-row gap-2">
          <View className="relative flex-1">
            <TouchableOpacity
              onPress={() => {
                setSortMenuOpen(!sortMenuOpen);
                if (districtMenuOpen) {
                  setDistrictMenuOpen(false);
                }
              }}
              className="flex-row items-center justify-between rounded-[12px] border border-[#d5d9df] bg-[#eef1f5] px-3 py-2.5"
            >
              <Text className="text-[14px] font-medium text-[#111827]">{selectedSort}</Text>
              <IconSymbol name="chevron.down" size={16} color="#6b7280" />
            </TouchableOpacity>

            {sortMenuOpen && (
              <View className="absolute top-12 z-20 w-full rounded-[12px] border border-[#d5d9df] bg-white p-1.5">
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedSort(option);
                      setSortMenuOpen(false);
                    }}
                    className={`flex-row items-center justify-between rounded-[8px] px-2.5 py-2.5 ${
                      selectedSort === option ? 'bg-[#f3f4f6]' : ''
                    }`}
                  >
                    <Text className={`text-[14px] ${selectedSort === option ? 'font-semibold text-[#111827]' : 'text-[#6b7280]'}`}>
                      {option}
                    </Text>
                    {selectedSort === option && <IconSymbol name="checkmark" size={15} color="#6b7280" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="relative flex-1">
            <TouchableOpacity
              onPress={() => {
                setDistrictMenuOpen(!districtMenuOpen);
                if (sortMenuOpen) {
                  setSortMenuOpen(false);
                }
              }}
              className="flex-row items-center justify-between rounded-[12px] border border-[#d5d9df] bg-[#eef1f5] px-3 py-2.5"
            >
              <Text className="text-[14px] font-medium text-[#111827]">{selectedDistrict}</Text>
              <IconSymbol name="chevron.down" size={16} color="#6b7280" />
            </TouchableOpacity>

            {districtMenuOpen && (
              <View className="absolute top-12 z-20 w-full rounded-[12px] border border-[#d5d9df] bg-white p-1.5">
                {districtOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedDistrict(option);
                      setDistrictMenuOpen(false);
                    }}
                    className={`flex-row items-center justify-between rounded-[8px] px-2.5 py-2.5 ${
                      selectedDistrict === option ? 'bg-[#f3f4f6]' : ''
                    }`}
                  >
                    <Text className={`text-[14px] ${selectedDistrict === option ? 'font-semibold text-[#111827]' : 'text-[#6b7280]'}`}>
                      {option}
                    </Text>
                    {selectedDistrict === option && <IconSymbol name="checkmark" size={15} color="#6b7280" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className="gap-3">
          {loadingRoutes ? (
            <View className="items-center rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-8">
              <ActivityIndicator size="large" color="#dc2626" />
              <Text className="mt-3 text-[14px] text-[#6b7280]">Topluluk rotalari yukleniyor...</Text>
            </View>
          ) : null}

          {filteredRoutes.map((route) => (
            <View key={route.id} className="rounded-[16px] border border-[#e5e7eb] bg-white px-4 pb-3 pt-4">
              <View className="mb-4 flex-row items-start">
                <View className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-[#f3f4f6]">
                  {route.creatorAvatarId ? (
                    <Image source={getProfileAvatar(route.creatorAvatarId).source} className="h-full w-full" resizeMode="cover" />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-[#dc2626]">
                      <Text className="text-[14px] font-bold text-white">{route.authorInitial}</Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text className="text-[16px] font-semibold text-[#111827]">{route.authorName}</Text>
                  <Text className="text-[12px] text-[#6b7280]">{route.createdAt}</Text>
                </View>
              </View>

              <Text className="mb-2 text-[20px] font-bold text-[#111827]">{route.title}</Text>
              <Text className="mb-4 text-[15px] leading-[22px] text-[#4b5563]">{route.description}</Text>

              {route.placePreview ? (
                <Text className="mb-3 text-[13px] leading-[20px] text-[#6b7280]">
                  <Text className="font-semibold text-[#111827]">Onizleme: </Text>
                  {route.placePreview}
                </Text>
              ) : null}

              <View className="mb-4 flex-row items-center gap-2">
                <Text className="text-[14px] text-[#dc2626]">📍</Text>
                <Text className="text-[14px] text-[#374151]">{route.stopCount} durak</Text>
                <Text className="text-[#9ca3af]">•</Text>
                <Text className="text-[14px] text-[#374151]">{route.district}</Text>
              </View>

              <View className="border-t border-[#eef0f3] pt-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-[14px] font-semibold text-[#374151]">⭐ {route.rating.toFixed(1)} ({route.reviewCount})</Text>
                    <Text className="text-[14px] text-[#4b5563]">💬 {route.commentCount}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '../community-route-detail',
                        params: {
                          id: String(route.id),
                          routeName: route.title,
                          creatorName: route.authorName,
                          authorInitial: route.authorInitial,
                          createdAt: route.createdAt,
                          description: route.description,
                          placeCount: String(route.stopCount),
                          district: route.district,
                          averageRating: route.rating.toFixed(1),
                          reviewCount: String(route.reviewCount),
                          commentCount: String(route.commentCount),
                          views: String(route.popularityScore * 12),
                          creatorAvatar: route.creatorAvatarId ?? '',
                        },
                      })
                    }
                    className="rounded-[10px] bg-[#dc2626] px-4 py-2"
                  >
                    <Text className="text-[13px] font-bold text-white">Incele</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {!loadingRoutes && filteredRoutes.length === 0 && (
            <View className="items-center rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-8">
              <Text className="text-[16px] font-semibold text-[#111827]">Filtreye uygun rota bulunamadı</Text>
              <Text className="mt-1 text-[13px] text-[#6b7280]">Arama metnini veya filtreleri değiştirebilirsin.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}