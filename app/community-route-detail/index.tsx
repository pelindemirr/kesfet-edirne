import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Stop = {
  id: number;
  name: string;
  desc: string;
  tag: string;
};

type RouteComment = {
  id: number;
  author: string;
  authorInitial: string;
  date: string;
  text: string;
  likes: number;
};

const stopsByRouteId: Record<string, Stop[]> = {
  '1': [
    { id: 1, name: 'Selimiye Camii', desc: "Mimar Sinan'in ustalik eseri", tag: 'Tarihi' },
    { id: 2, name: 'Eski Camii', desc: 'Buyuk hat sanati ornekleri', tag: 'Tarihi' },
    { id: 3, name: 'Uc Serefeli Camii', desc: 'Osmanli mimarisinin onemli ornegi', tag: 'Tarihi' },
  ],
  '2': [
    { id: 1, name: 'Mecidiye Koprusu', desc: 'Tunca kiyisinda tarihi gecis noktasi', tag: 'Tarihi' },
    { id: 2, name: 'Meric Koprusu', desc: 'Nehir manzarali yuruyus alani', tag: 'Doga' },
    { id: 3, name: 'Karaagac Tren Istasyonu', desc: 'Kent hafizasinin simge duragi', tag: 'Tarihi' },
  ],
};

const commentsByRouteId: Record<string, RouteComment[]> = {
  '1': [
    {
      id: 1,
      author: 'Ali Veli',
      authorInitial: 'A',
      date: '20.02.2024',
      text: 'Harika bir rota! Ozellikle Selimiye Camii muhtesem.',
      likes: 12,
    },
    {
      id: 2,
      author: 'Ayse Yilmaz',
      authorInitial: 'A',
      date: '21.02.2024',
      text: 'Cok faydali oldu, tesekkurler! Hafta sonu gidecegim.',
      likes: 8,
    },
  ],
  '2': [
    {
      id: 1,
      author: 'Ece Kara',
      authorInitial: 'E',
      date: '05.03.2024',
      text: 'Nehir kenari cok keyifliydi, rota akici.',
      likes: 6,
    },
    {
      id: 2,
      author: 'Mert Akin',
      authorInitial: 'M',
      date: '09.03.2024',
      text: 'Kopruler bolumu cok etkileyiciydi.',
      likes: 4,
    },
  ],
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

export default function CommunityRouteDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    authorName?: string;
    authorInitial?: string;
    createdAt?: string;
    title?: string;
    description?: string;
    stopCount?: string;
    district?: string;
    rating?: string;
    reviewCount?: string;
    commentCount?: string;
    views?: string;
  }>();

  const routeId = params.id ?? '1';
  const authorName = params.authorName ?? 'Ahmet Yilmaz';
  const authorInitial = params.authorInitial ?? 'A';
  const createdAt = formatDate(params.createdAt ?? '15.02.2024');
  const title = params.title ?? 'Tarihi Merkez Turu';
  const description = params.description ?? "Edirne'nin en onemli tarihi yapilarini kesfedin";
  const rating = params.rating ?? '4.8';
  const reviewCount = params.reviewCount ?? '124';
  const views = params.views ?? '1250';
  const district = params.district ?? 'Merkez';
  const stops = stopsByRouteId[routeId] ?? stopsByRouteId['1'];
  const comments = commentsByRouteId[routeId] ?? commentsByRouteId['1'];
  const commentCount = String(comments.length);

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Header />

      <View className="flex-row items-center justify-between border-b border-[#e5e7eb] bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="h-9 w-9 items-center justify-center rounded-full">
          <IconSymbol name="chevron.left" size={20} color="#374151" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full">
            <IconSymbol name="bookmark" size={18} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full">
            <IconSymbol name="square.and.arrow.up" size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="border-b border-[#e5e7eb] bg-white px-4 pb-4 pt-4">
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
            <Text className="text-[14px] text-[#374151]">👁 {views}</Text>
            <Text className="text-[14px] text-[#374151]">💬 {commentCount}</Text>
            <Text className="text-[14px] text-[#374151]">📍 {district}</Text>
          </View>
        </View>

        <View className="bg-white px-4 py-4">
          <Text className="mb-4 text-[24px] font-bold text-[#111827]">📍 {stops.length} Durak</Text>

          {stops.map((stop, index) => (
            <View key={stop.id} className="flex-row">
              <View className="mr-3 items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#dc2626]">
                  <Text className="text-[14px] font-bold text-white">{stop.id}</Text>
                </View>
                {index !== stops.length - 1 && <View className="mt-1 h-12 w-[1.5px] bg-[#fca5a5]" />}
              </View>

              <View className="mb-4 flex-1 pt-0.5">
                <Text className="text-[20px] font-semibold text-[#111827]">{stop.name}</Text>
                <Text className="mt-0.5 text-[14px] text-[#4b5563]">{stop.desc}</Text>
                <Text className="mt-1 text-[12px] text-[#9ca3af]">{stop.tag}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mx-4 mt-4 rounded-[14px] bg-[#eef0f3] p-4">
          <Text className="mb-3 text-[18px] font-semibold text-[#111827]">Bu rotayi degerlendirin</Text>
          <View className="flex-row gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Text key={idx} className="text-[30px] text-[#c7ced8]">☆</Text>
            ))}
          </View>
        </View>

        <View className="px-4 pb-6 pt-5">
          <Text className="mb-3 text-[24px] font-bold text-[#111827]">Yorumlar ({commentCount})</Text>
          <TextInput
            placeholder="Goruslerinizi paylasin..."
            placeholderTextColor="#9ca3af"
            className="rounded-[12px] border border-[#d1d5db] bg-white px-3 py-3 text-[15px] text-[#111827]"
          />

          <TouchableOpacity className="mt-3 items-center rounded-[10px] bg-[#dc2626] py-2.5">
            <Text className="text-[14px] font-bold text-white">Yorum Yap</Text>
          </TouchableOpacity>

          <View className="mt-4 gap-4">
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
                    <Text className="text-[15px] text-[#6b7280]">♡</Text>
                    <Text className="text-[13px] text-[#6b7280]">{comment.likes}</Text>
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
