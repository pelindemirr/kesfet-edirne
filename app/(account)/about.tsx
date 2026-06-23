import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function EdirneAboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-[#f8fafc]">
      <Header />

      {/* Modern Üst Bar */}
      <View className="flex-row items-center justify-between border-b border-[#f1f5f9] bg-white px-4 py-3.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white"
        >
          <IconSymbol name="chevron.left" size={16} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-[14px] font-black uppercase tracking-widest text-[#0f172a]">
          {t('about.headerTitle')}
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        {/* 🏛️ 1. UNESCO Kartı */}
        <View className="mb-6 overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-md shadow-black/5">
          <Image 
            source={require('../../assets/about/edirnekoruma.png')} 
            className="h-44 w-full"
            resizeMode="cover"
          />
          <View className="p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-[#e30613]/10">
                <IconSymbol name="sparkles" size={12} color="#e30613" />
              </View>
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#e30613]">
                {t('about.unesco_tag')}
              </Text>
            </View>
            
            <Text className="mb-2 text-[20px] font-extrabold text-[#0f172a]">
              {t('about.unesco_title')}
            </Text>
            <Text className="text-[13px] leading-[20px] text-[#475569]">
              {t('about.unesco_desc_start')}
              <Text className="font-bold text-[#0f172a]">{t('about.unesco_desc_bold')}</Text>
              {t('about.unesco_desc_end')}
            </Text>
          </View>
        </View>

        {/* 📜 2. Osmanlı Başkenti Kartı */}
        <View className="mb-6 overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-md shadow-black/5">
          <Image 
            source={require('../../assets/about/baskent.png')} 
            className="h-44 w-full"
            resizeMode="cover"
          />
          <View className="p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-[#0284c7]/10">
                <IconSymbol name="building.columns" size={12} color="#0284c7" />
              </View>
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#0284c7]">
                {t('about.ottoman_tag')}
              </Text>
            </View>
            
            <Text className="mb-2 text-[20px] font-extrabold text-[#0f172a]">
              {t('about.ottoman_title')}
            </Text>
            <Text className="text-[13px] leading-[20px] text-[#475569]">
              {t('about.ottoman_desc')}
            </Text>
          </View>
        </View>

        {/* 🗺️ 3. Coğrafi Konum / Nehirler Kartı */}
        <View className="mb-6 overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-md shadow-black/5">
          <Image 
            source={require('../../assets/about/sinirlaredirne.png')} 
            className="h-44 w-full"
            resizeMode="cover"
          />
          <View className="p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-[#16a34a]/10">
                <IconSymbol name="map" size={12} color="#16a34a" />
              </View>
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#16a34a]">
                {t('about.location_tag')}
              </Text>
            </View>
            
            <Text className="mb-2 text-[20px] font-extrabold text-[#0f172a]">
              {t('about.location_title')}
            </Text>
            <Text className="text-[13px] leading-[20px] text-[#475569]">
              {t('about.location_desc_start')}
              <Text className="font-bold text-[#0f172a]">{t('about.location_desc_bold')}</Text>
              {t('about.location_desc_end')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}