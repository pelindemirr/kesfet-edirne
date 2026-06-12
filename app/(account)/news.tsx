import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function EdirneNewsScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      {/* Uygulamanın kendi üst barı */}
      <Header />

      {/* 🧭 Üst Navigasyon Barı */}
      <View className="flex-row items-center border-b border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2"
        >
          <IconSymbol name="chevron.left" size={18} color="#374151" />
          <Text className="text-[14px] font-medium text-[#374151]">Geri</Text>
        </TouchableOpacity>
        <Text className="ml-4 text-[18px] font-bold text-[#111827]">Edirne Haberleri</Text>
      </View>

      {/* Sitenin kendisini güvenle uygulamanın içine gömüyoruz */}
      <View className="flex-1 relative">
        <WebView
          source={{ uri: 'https://www.edirnehaber.org/' }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setVisible(true)}
          onLoadEnd={() => setVisible(false)}
        />
        
        {/* Site arkada yüklenirken dönecek şık kırmızı loading göstergesi */}
        {visible && (
          <View className="absolute left-0 right-0 top-0 bottom-0 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#dc2626" />
            <Text className="mt-3 text-[14px] text-[#6b7280]">Son gelişmeler yükleniyor...</Text>
          </View>
        )}
      </View>
    </View>
  );
}