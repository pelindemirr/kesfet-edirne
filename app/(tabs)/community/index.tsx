import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { useRoutes } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getCommunityRoutes, type CommunityRouteApiItem } from '@/services/api/endpoints/community';
import { getProfileAvatar, type ProfileAvatarId } from '@/stores/use-profile-store';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SortOption = 'Popüler' | 'En İyi' | 'Yeni';

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

const sortOptions: SortOption[] = ['Popüler', 'En İyi', 'Yeni'];

// İlettiğin sabit ilçe listesi
const FIXED_DISTRICTS = ['Merkez', 'Enez', 'İpsala', 'Süloğlu', 'Uzunköprü', 'Lalapaşa', 'Keşan', 'Meriç', 'Havsa'];

function parseDate(dateText: string) {
  if (!dateText) return 0;
  if (dateText.includes('T') || dateText.includes('-')) {
    const ts = Date.parse(dateText);
    return Number.isNaN(ts) ? 0 : ts;
  }
  const parts = dateText.split('.').map(Number);
  if (parts.length >= 3 && parts.every((p) => !Number.isNaN(p))) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).getTime();
  }
  return 0;
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
  const authorName = item.creatorName ?? item.creator_name ?? item.authorName ?? item.author_name ?? 'Anonim Kullanıcı';
  const createdAt = item.createdAt ?? item.created_at ?? '';
  const routeName = item.routeName ?? item.route_name ?? item.title ?? 'Adsız Rota';
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
  const { isCommunityRouteSaved, saveCommunityRoute, unsaveCommunityRoute } = useRoutes();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('Yeni');
  const [selectedDistrict, setSelectedDistrict] = useState('Tüm İlçeler');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [districtMenuOpen, setDistrictMenuOpen] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [savingRouteId, setSavingRouteId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<CommunityRoute[]>([]);

  // Sayfa her odaklandığında otomatik API isteği atar
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  // Filtre dropdown listesi için ilçeleri hazırlar
  const districtOptions = useMemo(() => {
    // API'den gelen rotalardaki farklı ilçeleri al (Bilinmiyor ve boş olanları ele)
    const uniqueApiDistricts = Array.from(
      new Set(routes.map((route) => route.district).filter((d) => d && d !== 'Bilinmiyor'))
    );

    // İlettiğin sabit liste ile API'den gelenleri birleştir (böylece veri olmasa da ilçeler listelenir)
    const allDistricts = Array.from(new Set([...FIXED_DISTRICTS, ...uniqueApiDistricts]));

    // Türkçe karakterlere duyarlı olarak alfabetik sırala
    allDistricts.sort((a, b) => a.localeCompare(b, 'tr-TR'));

    return ['Tüm İlçeler', ...allDistricts];
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('tr-TR');

    const baseFiltered = routes.filter((route) => {
      const matchesDistrict = selectedDistrict === 'Tüm İlçeler' || route.district === selectedDistrict;

      if (!normalizedSearch) {
        return matchesDistrict;
      }

      const searchable = `${route.title} ${route.description} ${route.authorName} ${route.district}`.toLocaleLowerCase('tr-TR');
      return matchesDistrict && searchable.includes(normalizedSearch);
    });

    const sorted = [...baseFiltered];

    if (selectedSort === 'Popüler') {
      sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (selectedSort === 'En İyi') {
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

  const handleToggleSave = async (route: CommunityRoute) => {
    if (savingRouteId === route.id) return;

    setSavingRouteId(route.id);

    if (isCommunityRouteSaved(route.id)) {
      const success = await unsaveCommunityRoute(route.id);
      if (!success) {
        Alert.alert('Hata', 'Rota kaldırılamadı. Lütfen tekrar deneyin.');
      }
      setSavingRouteId(null);
      return;
    }

    const success = await saveCommunityRoute({
      id: route.id,
      title: route.title,
      description: route.description,
      authorName: route.authorName,
      authorInitial: route.authorInitial,
      createdAt: route.createdAt,
      placePreview: route.placePreview,
      stopCount: route.stopCount,
      district: route.district,
      rating: route.rating,
      reviewCount: route.reviewCount,
      commentCount: route.commentCount,
      popularityScore: route.popularityScore,
      creatorAvatarId: route.creatorAvatarId,
    });

    if (!success) {
      Alert.alert('Hata', 'Rota kaydedilemedi. Lütfen tekrar deneyin.');
    }

    setSavingRouteId(null);
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

      <View className="bg-white px-4 pb-3 pt-4 shadow-sm">
        <Text className="text-[22px] font-extrabold text-[#0f172a]">Topluluk Rotaları</Text>
        <Text className="mt-1 text-[13px] text-[#6b7280]">Paylaşılan rotaları keşfedin</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 88 }}>
        <View className="mb-3 flex-row items-center rounded-[12px] border border-[#e6e9ee] bg-white px-3 py-2.5 shadow-sm">
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
          {/* Sıralama Menüsü */}
          <View className="relative flex-1">
            <TouchableOpacity
              onPress={() => {
                setSortMenuOpen(!sortMenuOpen);
                if (districtMenuOpen) setDistrictMenuOpen(false);
              }}
              className="flex-row items-center justify-between rounded-[12px] border border-[#e6e9ee] bg-white px-3 py-2.5 shadow-sm"
            >
              <Text className="text-[14px] font-medium text-[#0f172a]">{selectedSort}</Text>
              <IconSymbol name="chevron.down" size={16} color="#6b7280" />
            </TouchableOpacity>

            {sortMenuOpen && (
              <View className="absolute top-12 z-20 w-full rounded-[12px] border border-[#e6e9ee] bg-white p-1.5 shadow-lg">
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

          {/* İlçe Seçim Menüsü */}
          <View className="relative flex-1">
            <TouchableOpacity
              onPress={() => {
                setDistrictMenuOpen(!districtMenuOpen);
                if (sortMenuOpen) setSortMenuOpen(false);
              }}
              className="flex-row items-center justify-between rounded-[12px] border border-[#e6e9ee] bg-white px-3 py-2.5 shadow-sm"
            >
              <Text className="text-[14px] font-medium text-[#0f172a]" numberOfLines={1}>
                {selectedDistrict}
              </Text>
              <IconSymbol name="chevron.down" size={16} color="#6b7280" />
            </TouchableOpacity>

            {districtMenuOpen && (
              <View className="absolute top-12 z-20 w-full max-h-60 rounded-[12px] border border-[#e6e9ee] bg-white p-1.5 shadow-lg overflow-hidden">
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
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
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        <View className="gap-3">
          {loadingRoutes ? (
            <View className="items-center rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-8">
              <ActivityIndicator size="large" color="#dc2626" />
              <Text className="mt-3 text-[14px] text-[#6b7280]">Topluluk rotaları yükleniyor...</Text>
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
                  <Text className="font-semibold text-[#111827]">Önizleme: </Text>
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
                <View className="flex-row items-center justify-between gap-2">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-[14px] font-semibold text-[#374151]">⭐ {route.rating.toFixed(1)} ({route.reviewCount})</Text>
                    <Text className="text-[14px] text-[#4b5563]">💬 {route.commentCount}</Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      disabled={savingRouteId === route.id}
                      onPress={() => {
                        void handleToggleSave(route);
                      }}
                      className={`rounded-[10px] border px-3 py-2 ${isCommunityRouteSaved(route.id) ? 'border-[#fecaca] bg-[#fff1f2]' : 'border-[#d1d5db] bg-white'} ${savingRouteId === route.id ? 'opacity-60' : ''}`}
                    >
                      <Text className={`text-[13px] font-bold ${isCommunityRouteSaved(route.id) ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
                        {savingRouteId === route.id
                          ? 'İşleniyor...'
                          : isCommunityRouteSaved(route.id)
                            ? 'Kaydedildi'
                            : 'Kaydet'}
                      </Text>
                    </TouchableOpacity>

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
                      <Text className="text-[13px] font-bold text-white">İncele</Text>
                    </TouchableOpacity>
                  </View>
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