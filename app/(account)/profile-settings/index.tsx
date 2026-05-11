import { useAuth } from '@/components/auth/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type UserTag = {
  id: string;
  title: string;
  subtitle: string;
  tone: 'blue' | 'green' | 'yellow' | 'gray';
};

const userTags: UserTag[] = [
  { id: 'traveler', title: 'Gezgin', subtitle: '5 yer ziyaret etti', tone: 'blue' },
  { id: 'explorer', title: 'Kasif', subtitle: '10 rota tamamladi', tone: 'green' },
  { id: 'social', title: 'Sosyal Gezgin', subtitle: '5 rota paylasti', tone: 'yellow' },
  { id: 'history', title: 'Tarih Meraklisi', subtitle: 'Tarihi duraklari sever', tone: 'gray' },
];

const tagStyleByTone: Record<UserTag['tone'], { card: string; border: string; title: string; subtitle: string }> = {
  blue: {
    card: '#e9f2ff',
    border: '#8ab6ff',
    title: '#1d4ed8',
    subtitle: '#2563eb',
  },
  green: {
    card: '#e7f8ee',
    border: '#74d39b',
    title: '#0f9f53',
    subtitle: '#0f9f53',
  },
  yellow: {
    card: '#fff8dc',
    border: '#f5cd35',
    title: '#b77900',
    subtitle: '#b77900',
  },
  gray: {
    card: '#f3f4f6',
    border: '#e5e7eb',
    title: '#9ca3af',
    subtitle: '#9ca3af',
  },
};

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { displayName } = useAuth();

  const defaultName = displayName?.trim() || 'Kullanici';
  const defaultEmail = useMemo(() => `${defaultName.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')}@gmail.com`, [defaultName]);
  const [name, setName] = useState(defaultName);

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <View className="bg-[#d80018] px-4 pb-4 pt-10">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <IconSymbol name="chevron.left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View>
            <Text className="text-[24px] font-extrabold text-white">Profili Düzenle</Text>
            <Text className="mt-0.5 text-[13px] text-white/90">Avatar ve bilgilerinizi güncelleyin</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="text-[30px] font-bold text-[#111827]">Profil Fotoğrafı</Text>

          <View className="mt-5 items-center">
            <View className="relative h-24 w-24 items-center justify-center rounded-full bg-[#e60000]">
              <Text className="text-[42px] font-bold text-white">{name.charAt(0).toUpperCase() || 'K'}</Text>

              <TouchableOpacity className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#e60000]">
                <Text className="text-[16px] text-white">+</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row flex-wrap justify-center gap-2">
              {userTags.slice(0, 3).map((tag) => (
                <View key={tag.id} className="rounded-full border border-[#f5cd35] bg-[#fff8dc] px-2.5 py-1">
                  <Text className="text-[12px] font-semibold text-[#946200]">{tag.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Kişisel Bilgiler</Text>

          <Text className="mb-1 text-[14px] font-medium text-[#111827]">İsim</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="mb-4 rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] px-3 py-3 text-[15px] text-[#111827]"
            placeholder="İsim"
            placeholderTextColor="#9ca3af"
          />

          <Text className="mb-1 text-[14px] font-medium text-[#111827]">E-posta</Text>
          <TextInput
            value={defaultEmail}
            editable={false}
            className="rounded-[10px] border border-[#d1d5db] bg-[#eef0f3] px-3 py-3 text-[15px] text-[#6b7280]"
          />
          <Text className="mt-2 text-[12px] text-[#9ca3af]">E-posta değiştirilemez</Text>
        </View>

        <View className="mt-4 rounded-[14px] border border-[#e3e5ea] bg-white p-5">
          <Text className="mb-4 text-[30px] font-bold text-[#111827]">Kullanıcı Etiketleri</Text>

          <View className="flex-row flex-wrap justify-between">
            {userTags.map((tag) => {
              const style = tagStyleByTone[tag.tone];

              return (
                <View
                  key={tag.id}
                  className="mb-3 w-[48.5%] rounded-[12px] px-3 py-3"
                  style={{ backgroundColor: style.card, borderColor: style.border, borderWidth: 1 }}
                >
                  <Text className="text-[16px] font-bold" style={{ color: style.title }}>{tag.title}</Text>
                  <Text className="mt-1 text-[13px]" style={{ color: style.subtitle }}>{tag.subtitle}</Text>
                </View>
              );
            })}
          </View>

          <View className="mt-2 self-center rounded-full bg-[#f3f4f6] px-4 py-2">
            <Text className="text-[13px] font-semibold text-[#4b5563]">3 / 4 etiket aktif</Text>
          </View>
        </View>

        <TouchableOpacity className="mt-4 items-center rounded-[10px] bg-[#e60000] py-3.5">
          <Text className="text-[16px] font-bold text-white">Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
