import Header from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from 'react-native';

// Android'de LayoutAnimation'ın sorunsuz çalışması için gerekli yapılandırma
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STORIES = [
  {
    title: 'Ters Lale Hikâyesi',
    spot: 'Selimiye Camii\'ndeki inatçılığın ve hüznün sembolü...',
    content: "Selimiye Camii'nin müezzin mahfilindeki taş işlemelerde ters bir lale motifi bulunur.\n\nRivayete göre caminin yapılacağı alanda bir kadına ait lale bahçesi vardır. Kadın bahçesini vermek istemez ve inşaatın başlamasını geciktirir. Sonunda bahçenin bir kısmı alınır ancak bu olay unutulmaz. Mimar Sinan da bu inatçılığı ve yaşanan sıkıntıyı sembolize etmek için laleyi ters şekilde işlemiştir.\n\nBir başka yoruma göre ise ters lale; hüznü, faniliği ve Allah karşısındaki tevazuyu temsil etmektedir.",
    icon: 'sparkles',
    badge: 'Selimiye Camii'
  },
  {
    title: 'Sağlık Müzesi\'nin Şifahane Hikâyesi',
    spot: 'Su sesi, musiki ve güzel kokularla ruhlara gelen şifa...',
    content: "1488 yılında Sultan II. Bayezid tarafından yaptırılan darüşşifa (hastane), döneminin en ileri sağlık merkezlerinden biriydi.\n\nBurada akıl hastaları zincire vurulmak yerine:\n• Su sesi,\n• Kuş sesleri,\n• Müzik terapisi,\n• Güzel kokular\nile tedavi edilmeye çalışılırdı.\n\nHalk arasında anlatılan bir hikâyeye göre, ağır ruhsal sorunlar yaşayan bazı hastalar günlerce akan suyun sesi ve ney dinletileriyle sakinleşir, hatta tamamen iyileşerek taburcu olurlardı. Bu nedenle yapı 'şifa dağıtan saray' olarak anılmıştır.",
    icon: 'heart.text.square',
    badge: 'II. Bayezid Külliyesi'
  },
  {
    title: 'Meriç Köprüsü\'ndeki Bekleyiş',
    spot: 'Savaş yıllarından günümüze uzanan hüzünlü bir aşk efsanesi...',
    content: "Meriç Köprüsü ile ilgili halk arasında anlatılan romantik bir hikâye vardır.\n\nSavaş yıllarında genç bir asker sevdiği kıza dönme sözü verir. Kız her gün köprüye gelip onu bekler. Ancak asker geri dönemez. Yıllar boyunca köprüde bekleyen genç kızın gözyaşlarının Meriç Nehri'ne karıştığı söylenir.\n\nBu nedenle bazı yaşlı Edirneliler gün batımında köprüye bakınca nehrin hüzünlü aktığını anlatırlar.",
    icon: 'eye',
    badge: 'Meriç Köprüsü'
  },
  {
    title: 'Üç Şerefeli Minare Efsanesi',
    spot: 'Birbirini hiç görmeden yukarı tırmanan üç gizemli yol...',
    content: "Üç Şerefeli Camii adını farklı sayıda şerefeye sahip minarelerinden alır.\n\nRivayete göre caminin mimarı minarelerin her birini farklı şekilde tasarlayarak dönemin ustalarına meydan okumuştur. Özellikle üç şerefeli minareye çıkan üç ayrı merdivenin birbirini görmeden yukarı ulaşması halk arasında 'usta sırrı' olarak anlatılır.",
    icon: 'building.columns',
    badge: 'Üç Şerefeli Camii'
  },
  {
    title: 'Kırkpınar\'ın Doğuşu',
    spot: 'Rumeli topraklarında fışkıran kırk pınarın efsanevi yiğitleri...',
    content: "Kırkpınar Yağlı Güreşleri'nin kökeni, Osmanlı'nın Rumeli sancağına geçiş yıllarına dayanır. Akıncılar arasında yapılan ve saatlerce süren, yenişemeyen kırk yiğit pehlivanın efsanevi öyküsünü barındırır. Güreştikleri yerde fışkıran kırk pınar, bugün bu geleneğin doğduğu kutsal toprakları simgeler.",
    icon: 'trophy',
    badge: 'Tarihi Kırkpınar'
  }
];

export default function EdirneStoriesScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // İlk kart varsayılan açık gelir

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
          <Text className="text-[20px] font-black tracking-tight text-[#0f172a]">Kültür Mirası</Text>
          <Text className="text-[12px] font-medium text-[#64748b]">Dilden dile aktarılan Edirne efsaneleri</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
      >
        {STORIES.map((story, index) => {
          const isExpanded = expandedIndex === index;
          
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
                      name={story.icon as any} 
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