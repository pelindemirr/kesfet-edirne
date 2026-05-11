import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SortOption = 'Populer' | 'En Iyi' | 'Yeni';

type CommunityRoute = {
  id: number;
  authorName: string;
  authorInitial: string;
  createdAt: string;
  title: string;
  description: string;
  stopCount: number;
  district: string;
  rating: number;
  reviewCount: number;
  commentCount: number;
  popularityScore: number;
};

const routeList: CommunityRoute[] = [
  {
    id: 1,
    authorName: 'Ahmet Yilmaz',
    authorInitial: 'A',
    createdAt: '15.02.2024',
    title: 'Tarihi Merkez Turu',
    description: "Edirne'nin en onemli tarihi yapilarini kesfedin",
    stopCount: 3,
    district: 'Merkez',
    rating: 4.8,
    reviewCount: 124,
    commentCount: 45,
    popularityScore: 98,
  },
  {
    id: 2,
    authorName: 'Zeynep Kaya',
    authorInitial: 'Z',
    createdAt: '20.02.2024',
    title: 'Kopruler ve Nehir Rotasi',
    description: "Edirne'nin unlu tarihi koprulerini gezin",
    stopCount: 3,
    district: 'Merkez',
    rating: 4.6,
    reviewCount: 89,
    commentCount: 32,
    popularityScore: 91,
  },
  {
    id: 3,
    authorName: 'Merve Demir',
    authorInitial: 'M',
    createdAt: '08.03.2024',
    title: 'Selimiye ve Carsi Turu',
    description: 'Selimiye cevresinde yuruyus ve alisveris rotasi',
    stopCount: 5,
    district: 'Merkez',
    rating: 4.9,
    reviewCount: 61,
    commentCount: 19,
    popularityScore: 87,
  },
  {
    id: 4,
    authorName: 'Can Yildirim',
    authorInitial: 'C',
    createdAt: '28.02.2024',
    title: 'Kesan Doga ve Lezzet Rotasi',
    description: 'Kesan tarafinda doga duraklari ve yerel tatlar',
    stopCount: 4,
    district: 'Kesan',
    rating: 4.7,
    reviewCount: 52,
    commentCount: 27,
    popularityScore: 84,
  },
];

const sortOptions: SortOption[] = ['Populer', 'En Iyi', 'Yeni'];

function parseDate(dateText: string) {
  const [day, month, year] = dateText.split('.').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export default function CommunityRoutesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('Populer');
  const [selectedDistrict, setSelectedDistrict] = useState('Tum Ilceler');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [districtMenuOpen, setDistrictMenuOpen] = useState(false);

  const districtOptions = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(routeList.map((route) => route.district)));
    return ['Tum Ilceler', ...uniqueDistricts];
  }, []);

  const filteredRoutes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('tr-TR');

    const baseFiltered = routeList.filter((route) => {
      const matchesDistrict = selectedDistrict === 'Tum Ilceler' || route.district === selectedDistrict;

      if (!normalizedSearch) {
        return matchesDistrict;
      }

      const searchable = `${route.title} ${route.description} ${route.authorName}`.toLocaleLowerCase('tr-TR');
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
  }, [searchQuery, selectedDistrict, selectedSort]);

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
          {filteredRoutes.map((route) => (
            <View key={route.id} className="rounded-[16px] border border-[#e5e7eb] bg-white px-4 pb-3 pt-4">
              <View className="mb-4 flex-row items-start">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-[#dc2626]">
                  <Text className="text-[14px] font-bold text-white">{route.authorInitial}</Text>
                </View>
                <View>
                  <Text className="text-[16px] font-semibold text-[#111827]">{route.authorName}</Text>
                  <Text className="text-[12px] text-[#6b7280]">{route.createdAt}</Text>
                </View>
              </View>

              <Text className="mb-2 text-[20px] font-bold text-[#111827]">{route.title}</Text>
              <Text className="mb-4 text-[15px] leading-[22px] text-[#4b5563]">{route.description}</Text>

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
                          authorName: route.authorName,
                          authorInitial: route.authorInitial,
                          createdAt: route.createdAt,
                          title: route.title,
                          description: route.description,
                          stopCount: String(route.stopCount),
                          district: route.district,
                          rating: route.rating.toFixed(1),
                          reviewCount: String(route.reviewCount),
                          commentCount: String(route.commentCount),
                          views: String(route.popularityScore * 12),
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

          {filteredRoutes.length === 0 && (
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