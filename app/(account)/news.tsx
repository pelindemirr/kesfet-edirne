import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n eklendi
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from 'react-native';

// Android'de LayoutAnimation'ın sorunsuz çalışması için gerekli yapılandırma
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// İkonları çevirilerden bağımsız olarak sabit tutuyoruz
const STORY_ICONS = [
  'sparkles',
  'heart.text.square',
  'eye',
  'building.columns',
  'trophy'
];

export default function EdirneStoriesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // İlk kart varsayılan açık gelir

  // JSON içindeki "stories" dizisini obje listesi olarak çekiyoruz
  const stories = t('storiesScreen.stories', { returnObjects: true }) as Array<{
    title: string;
    spot: string;
    content: string;
    badge: string;
  }>;

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-[#fcfaf7]">
      <Header />
      
      {/* 🧭 Modern Minimalist Üst Navigasyon */}
      <View className="flex-row items-center border-b border-[#f1ece7] bg-white px-5 py-4 shadow-sm shadow-black/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#eef0f6] bg-[#fafbfc]"
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={20} color="#1e293b" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-[20px] font-black tracking-tight text-[#0f172a]">
            {t('storiesScreen.headerTitle')}
          </Text>
          <Text className="text-[12px] font-medium text-[#64748b]">
            {t('storiesScreen.headerSubtitle')}
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
      >
        {stories.map((story, index) => {
          const isExpanded = expandedIndex === index;
          // İkonu statik diziden alıyoruz
          const iconName = STORY_ICONS[index] || 'sparkles';
          
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => toggleExpand(index)}
              activeOpacity={0.95}
              className={`mb-4 overflow-hidden rounded-[24px] border border-[#f1ece7] bg-white p-5 shadow-md shadow-black/5 transition-all ${
                isExpanded ? 'border-[#b10016]/20 bg-white ring-1 ring-[#b10016]/10' : ''
              }`}
            >
              <View className="flex-row items-start justify-between gap-3">
                {/* Sol İkon ve Başlık Alanı */}
                <View className="flex-row flex-1 items-start gap-3.5">
                  <View className={`h-11 w-11 items-center justify-center rounded-2xl ${
                    isExpanded ? 'bg-[#b10016]/10' : 'bg-[#f8fafc]'
                  }`}>
                    <IconSymbol 
                      name={iconName as any} 
                      size={20} 
                      color={isExpanded ? '#b10016' : '#64748b'} 
                    />
                  </View>
                  
                  <View className="flex-1 pt-1">
                    {/* Küçük Lokasyon/Yapı Etiketi */}
                    <Text className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                      isExpanded ? 'text-[#b10016]' : 'text-[#94a3b8]'
                    }`}>
                      {story.badge}
                    </Text>
                    <Text className="text-[16px] font-black leading-5 text-[#0f172a]">
                      {story.title}
                    </Text>
                    
                    {!isExpanded && (
                      <Text className="text-[13px] text-[#64748b] mt-1" numberOfLines={1}>
                        {story.spot}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Sağ Açılır/Kapanır Chevron Ok Göstergesi */}
                <View className="pt-2">
                  <IconSymbol 
                    name={isExpanded ? 'chevron.up' : 'chevron.down'} 
                    size={16} 
                    color="#94a3b8" 
                  />
                </View>
              </View>

              {/* Genişleyen İçerik Bölümü */}
              {isExpanded && (
                <View className="mt-4 border-t border-[#f8fafc] pt-4">
                  <Text className="text-[14px] font-medium leading-[23px] text-[#334155] tracking-wide">
                    {story.content}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}