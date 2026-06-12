import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getFavoritePlaces, togglePlaceFavorite, type FavoritePlaceItem } from '@/services/api/endpoints/actions';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryEmoji(category?: string) {
  if (!category) return '📍';
  const c = category.toLocaleLowerCase('tr-TR');
  if (c.includes('tarihi')) return '🏛';
  if (c.includes('alışveriş') || c.includes('çarşı')) return '🛍';
  if (c.includes('yemek') || c.includes('restoran') || c.includes('kafe')) return '🍽';
  if (c.includes('doğa') || c.includes('park')) return '🌿';
  if (c.includes('müze')) return '🎨';
  if (c.includes('cami') || c.includes('ibadet')) return '🕌';
  return '📍';
}

export default function FavoritePlacesScreen() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);

  const [places, setPlaces] = useState<FavoritePlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | string | null>(null);

 const loadFavorites = useCallback(async () => {
  if (!authUser?.id) return;
  try {
    setLoading(true);
    const response = await getFavoritePlaces(authUser.id, authToken ?? undefined);
    
    // API artık bize datayı array olarak döndürdüğü için doğrudan kontrol edebiliriz
    if (response.status === 200 || response.status === 'success' || response.bodyStatus === 'success') {
      setPlaces(Array.isArray(response.data) ? response.data : []);
    } else {
      setPlaces([]);
    }
  } catch (error) {
    console.error('[FavoritePlaces] load error', error);
    setPlaces([]);
  } finally {
    setLoading(false);
  }
}, [authUser?.id, authToken]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = async (place: FavoritePlaceItem) => {
    if (!authUser?.id || removingId === place.id) return;

    Alert.alert(
      'Favoriden Çıkar',
      `"${place.name}" favorilerinizden çıkarılsın mı?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: async () => {
            setRemovingId(place.id);
            try {
              await togglePlaceFavorite(Number(authUser.id), place.id);
              setPlaces((prev) => prev.filter((p) => p.id !== place.id));
            } catch (error) {
              Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      {/* Üst bar */}
      <View className="flex-row items-center border-b border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2"
        >
          <IconSymbol name="chevron.left" size={18} color="#374151" />
          <Text className="text-[14px] font-medium text-[#374151]">Geri</Text>
        </TouchableOpacity>
        <Text className="ml-4 text-[18px] font-bold text-[#111827]">Favori Mekanlarım</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#dc2626" />
          <Text className="mt-3 text-[14px] text-[#6b7280]">Favoriler yükleniyor...</Text>
        </View>
      ) : places.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full items-center rounded-[20px] border border-[#fde8cc] bg-white px-6 py-10">
            <Text className="mb-3 text-[52px]">❤️</Text>
            <Text className="mb-2 text-center text-[20px] font-extrabold text-[#111827]">
              Henüz favori mekan yok
            </Text>
            <Text className="text-center text-[14px] leading-[22px] text-[#6b7280]">
              Mekanları gezerken kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <Text className="mb-3 text-[13px] text-[#6b7280]">{places.length} favori mekan</Text>

          <View className="gap-3">
            {places.map((place) => (
              <View
                key={String(place.id)}
                className="overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white"
              >
                <View className="px-4 py-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      {/* Emoji ikonu */}
                      <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-[#fff1f2]">
                        <Text className="text-[22px]">{getCategoryEmoji(place.category)}</Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-[16px] font-bold text-[#111827]">{place.name}</Text>
                        <View className="mt-1 flex-row items-center gap-2">
                          {place.category ? (
                            <View className="rounded-full bg-[#f3f4f6] px-2 py-0.5">
                              <Text className="text-[11px] font-semibold text-[#6b7280]">{place.category}</Text>
                            </View>
                          ) : null}
                          {place.district ? (
                            <Text className="text-[12px] text-[#9ca3af]">📍 {place.district}</Text>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    {/* Favoriden çıkar butonu */}
                    <TouchableOpacity
                      onPress={() => handleRemove(place)}
                      disabled={removingId === place.id}
                      className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#fff1f2]"
                      style={{ opacity: removingId === place.id ? 0.5 : 1 }}
                    >
                      <Text className="text-[18px]">❤️</Text>
                    </TouchableOpacity>
                  </View>

                  {place.favorited_at ? (
                    <Text className="mt-2 text-[11px] text-[#9ca3af]">
                      Eklenme: {formatDate(place.favorited_at)}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}