import { useAuth } from '@/components/auth/auth-context';
import Header from '@/components/layout/Header';
import { useRoutes } from '@/components/routes/routes-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createCommunityReview, getCommunityRouteById, type CommunityRoutePlaceItem } from '@/services/api/endpoints/community';
import { useAuthStore } from '@/stores/use-auth-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RouteComment = {
  id: number;
  author: string;
  authorInitial: string;
  date: string;
  text: string;
  likes: number;
};

type CommunityPlace = {
  id: number;
  name: string;
  desc: string;
  tag: string;
};

function formatDate(text: string) {
  const [day, month, year] = text.split('.').map(Number);
  const months = [
    'Ocak',
    'Subat',
    'Mart',
    'Nisan',
    'Mayis',
    'Haziran',
    'Temmuz',
    'Agustos',
    'Eylul',
    'Ekim',
    'Kasim',
    'Aralik',
  ];

  if (!day || !month || !year) {
    return text;
  }

  return `${day} ${months[month - 1]} ${year}`;
}

function mapPlace(item: CommunityRoutePlaceItem, index: number): CommunityPlace {
  const name = item.name ?? item.title ?? `Durak ${index + 1}`;

  return {
    id: index + 1,
    name,
    desc: item.description ?? '',
    tag: 'Mekan',
  };
}

export default function CommunityRouteDetail() {
  const router = useRouter();
  const { displayName } = useAuth();
  const token = useAuthStore((state) => state.token);
  const { saveCommunityRoute, unsaveCommunityRoute, isCommunityRouteSaved } = useRoutes();
  const params = useLocalSearchParams<{
    id?: string;
    routeName?: string;
    route_name?: string;
    authorName?: string;
    creatorName?: string;
    authorInitial?: string;
    createdAt?: string;
    description?: string;
    placeCount?: string;
    place_count?: string;
    stopCount?: string;
    district?: string;
    averageRating?: string;
    average_rating?: string;
    rating?: string;
    reviewCount?: string;
    review_count?: string;
    commentCount?: string;
    views?: string;
    creatorAvatar?: string;
    creator_avatar?: string;
  }>();

  const routeId = params.id ?? '1';
  const authorName = params.creatorName ?? params.authorName ?? 'Anonim Kullanici';
  const authorInitial = params.authorInitial ?? authorName.charAt(0).toLocaleUpperCase('tr-TR') ?? 'A';
  const [createdAt, setCreatedAt] = useState(formatDate(params.createdAt ?? '15.02.2024'));
  const [title, setTitle] = useState(params.routeName ?? params.route_name ?? 'Tarihi Merkez Turu');
  const [description, setDescription] = useState(params.description ?? "Edirne'nin en onemli tarihi yapilarini kesfedin");
  const [rating, setRating] = useState(params.averageRating ?? params.average_rating ?? params.rating ?? '4.8');
  const [reviewCount, setReviewCount] = useState(params.reviewCount ?? params.review_count ?? params.commentCount ?? '124');
  const views = params.views ?? '1250';
  const [district, setDistrict] = useState(params.district ?? 'Bilinmiyor');
  const [stopCount, setStopCount] = useState<number>(Number(params.placeCount ?? params.place_count ?? params.stopCount ?? 0));
  const [places, setPlaces] = useState<CommunityPlace[]>([]);
  const [comments, setComments] = useState<RouteComment[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [savingRoute, setSavingRoute] = useState(false);
  const commentCount = String(comments.length);
  const saved = isCommunityRouteSaved(routeId);

  useEffect(() => {
    let mounted = true;

    async function loadRouteDetail() {
      try {
        const response = await getCommunityRouteById(routeId);

        if (!mounted) return;

        if (response.status === 200 || response.bodyStatus === 'success') {
          const data = response.data;

          if (data) {
            setTitle(data.routeName ?? data.route_name ?? title);
            setDescription(data.description ?? description);
            setDistrict(data.district ?? district);
            setReviewCount(String(data.reviewCount ?? data.review_count ?? reviewCount));
            setRating(String(data.averageRating ?? data.average_rating ?? rating));

            const placesFromApi = Array.isArray(data.places) ? data.places : [];
            setPlaces(placesFromApi.map(mapPlace));
            // Prefer backend-provided place count if available, otherwise derive from places
            const backendPlaceCount = Number(data.placeCount ?? data.place_count ?? placesFromApi.length ?? 0);
            setStopCount(backendPlaceCount);
          }
        }
      } catch (error) {
        console.error('[COMMUNITY_ROUTE_DETAIL] loadRouteDetail error', error);
      }
    }

    loadRouteDetail();

    return () => {
      mounted = false;
    };
  }, [description, district, rating, reviewCount, routeId, title]);

  const placePreviewText = useMemo(() => {
    if (places.length === 0) {
      return params.creatorAvatar ? '' : '';
    }

    return places.map((place) => place.name).join(', ');
  }, [params.creatorAvatar, places]);

  const toggleSaveRoute = async () => {
    if (savingRoute) {
      return;
    }

    setSavingRoute(true);

    if (saved) {
      const success = await unsaveCommunityRoute(routeId);
      if (!success) {
        Alert.alert('Hata', 'Rota kaldırılamadı. Lütfen tekrar deneyin.');
      }
      setSavingRoute(false);
      return;
    }

    const success = await saveCommunityRoute({
      id: routeId,
      title,
      description,
      authorName,
      authorInitial,
      createdAt,
      placePreview: placePreviewText,
      stopCount,
      district,
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
      commentCount: Number(commentCount) || 0,
      popularityScore: Number(views) || 0,
      creatorAvatarId: params.creatorAvatar ?? params.creator_avatar,
    });

    if (!success) {
      Alert.alert('Hata', 'Rota kaydedilemedi. Lütfen tekrar deneyin.');
    }

    setSavingRoute(false);
  };

  const handleSubmitReview = async () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      Alert.alert('Yorum gerekli', 'Lutfen once bir yorum yazin.');
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      Alert.alert('Puan gerekli', 'Lutfen 1 ile 5 arasinda bir yildiz secin.');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await createCommunityReview(routeId, trimmedComment, selectedRating, token ?? undefined);
      console.log('[COMMUNITY_REVIEW] submit response:', response);

      setComments((prev) => [
        {
          id: Date.now(),
          author: displayName ?? 'Sen',
          authorInitial: (displayName ?? 'S').charAt(0).toLocaleUpperCase('tr-TR'),
          date: new Date().toLocaleDateString('tr-TR'),
          text: trimmedComment,
          likes: 0,
        },
        ...prev,
      ]);

      setCommentText('');
      setSelectedRating(0);
      Alert.alert('Tesekkurler', 'Yorumunuz basariyla gonderildi.');
    } catch (error) {
      console.error('[COMMUNITY_REVIEW] submit error', error);
      Alert.alert('Hata', 'Yorum gonderilemedi.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      <View className="flex-row items-center justify-between border-b border-[#e5e7eb] bg-white px-4 py-3 shadow-sm shadow-black/5">
        <TouchableOpacity
          onPress={() => router.replace('/community' as any)}
          className="flex-row items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2"
        >
          <IconSymbol name="chevron.left" size={18} color="#374151" />
          <Text className="text-[14px] font-medium text-[#374151]">Geri</Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            disabled={savingRoute}
            onPress={() => {
              void toggleSaveRoute();
            }}
            className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${saved ? 'border-[#fecaca] bg-[#fff1f2]' : 'border-[#e5e7eb] bg-[#f9fafb]'} ${savingRoute ? 'opacity-60' : ''}`}
          >
            <IconSymbol name={saved ? 'bookmark.fill' : 'bookmark'} size={18} color={saved ? '#dc2626' : '#374151'} />
            <Text className={`text-[13px] font-semibold ${saved ? 'text-[#dc2626]' : 'text-[#374151]'}`}>
              {savingRoute ? 'İşleniyor...' : saved ? 'Kaydedildi' : 'Kaydet'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f9fafb]">
            <IconSymbol name="square.and.arrow.up" size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mx-4 mt-3 overflow-hidden rounded-[18px] bg-[#111827] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[12px] uppercase tracking-[1.5px] text-white/70">Topluluk rotası</Text>
            <Text className="mt-1 text-[16px] font-semibold text-white">Diğer kullanıcıların önerisi</Text>
          </View>
          <View className="rounded-full bg-white/10 px-3 py-1.5">
            <Text className="text-[12px] font-semibold text-white">{saved ? 'Cihazınıza kaydedildi' : 'Henüz kaydedilmedi'}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-3 border-b border-[#e5e7eb] bg-white px-4 pb-4 pt-4">
          <View className="mb-4 flex-row items-start">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#dc2626]">
              <Text className="text-[16px] font-bold text-white">{authorInitial}</Text>
            </View>
            <View>
              <Text className="text-[18px] font-semibold text-[#111827]">{authorName}</Text>
              <Text className="text-[12px] text-[#6b7280]">{createdAt}</Text>
            </View>
          </View>

          <Text className="mb-2 text-[36px] font-bold leading-[40px] text-[#111827]">{title}</Text>
          <Text className="mb-3 text-[16px] leading-[22px] text-[#4b5563]">{description}</Text>

          <View className="flex-row items-center gap-3">
            <Text className="text-[16px] font-semibold text-[#111827]">⭐ {rating}</Text>
            <Text className="text-[13px] text-[#6b7280]">({reviewCount})</Text>
            <Text className="text-[14px] text-[#374151]">💬 {commentCount}</Text>
            <Text className="text-[14px] text-[#374151]">📍 {district}</Text>
          </View>
        </View>

        <View className="bg-white px-4 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[24px] font-bold text-[#111827]">📍 {stopCount} Durak</Text>
            <TouchableOpacity
              disabled={savingRoute}
              onPress={() => {
                void toggleSaveRoute();
              }}
              className={`rounded-full px-4 py-2 ${saved ? 'bg-[#fff1f2]' : 'bg-[#f3f4f6]'} ${savingRoute ? 'opacity-60' : ''}`}
            >
              <Text className={`text-[13px] font-semibold ${saved ? 'text-[#dc2626]' : 'text-[#374151]'}`}>
                {savingRoute ? 'İşleniyor...' : saved ? 'Kaydedildi' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </View>

          {places.length === 0 ? (
            <View className="rounded-[12px] border border-dashed border-[#fca5a5] bg-[#fff7f7] px-4 py-5">
              <Text className="text-[15px] font-semibold text-[#7f1d1d]">Durak bilgisi bulunamadı</Text>
              <Text className="mt-1 text-[13px] leading-[20px] text-[#9f1239]">
                Bu rotaya ait mekan listesi backend yanıtında gelmedi.
              </Text>
            </View>
          ) : (
            places.map((stop, index) => (
              <View key={stop.id} className="flex-row">
                <View className="mr-3 items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-[#dc2626] shadow-sm shadow-black/10">
                    <Text className="text-[14px] font-bold text-white">{stop.id}</Text>
                  </View>
                  {index !== places.length - 1 && <View className="mt-1 h-12 w-[1.5px] bg-[#fca5a5]" />}
                </View>

                <View className="mb-4 flex-1 rounded-[14px] border border-[#eef0f3] bg-[#fafafa] px-4 py-3 pt-3">
                  <Text className="text-[20px] font-semibold text-[#111827]">{stop.name}</Text>
                  <Text className="mt-0.5 text-[14px] leading-[20px] text-[#4b5563]">{stop.desc}</Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <Text className="rounded-full bg-[#fff1f2] px-2 py-0.5 text-[11px] font-semibold text-[#dc2626]">{stop.tag}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="mx-4 mt-4 rounded-[14px] bg-[#eef0f3] p-4">
          <Text className="mb-3 text-[18px] font-semibold text-[#111827]">Bu rotayı değerlendirin</Text>
          <View className="flex-row gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <TouchableOpacity key={idx} onPress={() => setSelectedRating(idx + 1)}>
                <Text className={`text-[30px] ${selectedRating > idx ? 'text-[#f59e0b]' : 'text-[#c7ced8]'}`}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 pb-6 pt-5">
          <Text className="mb-3 text-[24px] font-bold text-[#111827]">Yorumlar ({commentCount})</Text>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Görüşlerinizi paylaşın..."
            placeholderTextColor="#9ca3af"
            multiline
            className="min-h-[96px] rounded-[12px] border border-[#d1d5db] bg-white px-3 py-3 text-[15px] text-[#111827]"
          />

          <TouchableOpacity
            onPress={handleSubmitReview}
            disabled={submittingReview}
            className="mt-3 items-center rounded-[10px] bg-[#dc2626] py-2.5"
            style={{ opacity: submittingReview ? 0.65 : 1 }}
          >
            <Text className="text-[14px] font-bold text-white">{submittingReview ? 'Gönderiliyor...' : 'Yorum Yap'}</Text>
          </TouchableOpacity>

          <View className="mt-4 gap-4">
            {comments.length === 0 ? (
              <View className="rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4">
                <Text className="text-[14px] font-medium text-[#111827]">Henüz yorum yok</Text>
                <Text className="mt-1 text-[13px] text-[#6b7280]">İlk yorumu siz bırakabilirsiniz.</Text>
              </View>
            ) : null}

            {comments.map((comment) => (
              <View key={comment.id} className="flex-row items-start">
                <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-[#d1d5db]">
                  <Text className="text-[13px] text-[#374151]">{comment.authorInitial}</Text>
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[19px] font-medium text-[#111827]">{comment.author}</Text>
                    <Text className="text-[12px] text-[#9ca3af]">{comment.date}</Text>
                  </View>
                  <Text className="mt-1 text-[15px] text-[#374151]">{comment.text}</Text>

                  <View className="mt-1 flex-row items-center gap-1">
                   
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
