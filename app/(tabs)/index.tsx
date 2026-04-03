
import AppHeader from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const cardShadow = {
  shadowColor: '#7a0010',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

const sectionShadow = {
  shadowColor: '#7a0010',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#f7f4f2]">
      <AppHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-24">
          <View className="relative overflow-hidden bg-[#d40012] pb-4">
            <View className="absolute -right-7 -top-7 h-[126px] w-[126px] rounded-full bg-white/10" />
            <View className="px-6 pt-4">
              <ThemedText className="mb-0.5 text-2xl font-extrabold text-white">Keşfi Edirne</ThemedText>
              <ThemedText className="mb-1.5 text-sm text-white">Tarihi keşfedin, rotanızı planlayın</ThemedText>
              <View className="mb-4 flex-row items-center">
                <View className="mr-1">
                  <IconSymbol name="mappin.and.ellipse" size={14} color="#fff" />
                </View>
                <ThemedText className="text-[13px] font-semibold text-white">Edirne, Merkez</ThemedText>
              </View>

              <View className="mb-2 rounded-[22px]">
                <View className="flex-row items-center justify-between rounded-[22px] bg-white p-[18px]">
                  <View className="flex-1 pr-3">
                    <ThemedText className="mb-1 text-base font-extrabold text-[#2f2f2f]">Bugün nereyi keşfedelim?</ThemedText>
                    <ThemedText className="text-[13px] text-[#6f6f6f]">Rotalar, yerler ve etkinlikler</ThemedText>
                  </View>
                  <IconSymbol name="arrow.right" size={22} color="#d32f2f" />
                </View>

                <View className="flex-row flex-wrap px-3.5 pt-3">
                  <View className="mb-2 mr-2 rounded-full border border-[#ffd1cf] bg-[#fff3f2] px-3 py-1.5">
                    <ThemedText className="text-xs font-bold text-[#ff7a59]">☀️ 24° Güneşli</ThemedText>
                  </View>
                  <View className="mb-2 rounded-full border border-[#cfead6] bg-[#eef9f0] px-3 py-1.5">
                    <ThemedText className="text-xs font-bold text-[#1b8f49]">$ USD $34.52</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-2 flex-row flex-wrap justify-between px-4">
            <Link href="/explore" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff4f4]">
                  <IconSymbol name="map" size={28} color="#e53935" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Harita</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Yerleşim yerlerini keşfedin</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/rota" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff6ea]">
                  <IconSymbol name="scope" size={28} color="#fb8c00" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Rotalar</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Hazır rotalar</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/events" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#edf5ff]">
                  <IconSymbol name="calendar" size={28} color="#1e88e5" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Etkinlikler</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Güncel etkinlikler</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/community" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#f5edff]">
                  <IconSymbol name="person.3" size={28} color="#8e24aa" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Topluluk</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Paylaşılan rotalar</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mx-4 mb-4 mt-0.5 rounded-[18px] border border-[#ffd4cf] bg-[#fff6f4] p-4">
            <View className="mb-2.5 flex-row items-start">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-[14px] bg-[#e53935]">
                <IconSymbol name="sparkles" size={22} color="#fff" />
              </View>
              <View className="flex-1">
                <ThemedText className="mb-1 text-base font-extrabold text-[#e53935]">Neden Üye Olmalısınız?</ThemedText>
                <ThemedText className="text-[13px] leading-[18px] text-[#9b4c42]">
                  Kendi rotalarınızı oluşturun, favorilerinizi kaydedin ve rozet kazanın
                </ThemedText>
              </View>
            </View>

            <View className="mb-3">
              <ThemedText className="mb-1.5 text-[13px] text-[#2e7d32]">✓ Özel rota oluşturma ve kaydetme</ThemedText>
              <ThemedText className="mb-1.5 text-[13px] text-[#2e7d32]">✓ Rotalarınızı toplulukla paylaşma</ThemedText>
              <ThemedText className="text-[13px] text-[#2e7d32]">✓ Rozet kazanma ve ilerleme takibi</ThemedText>
            </View>

            <TouchableOpacity className="items-center rounded-[14px] bg-[#e53935] py-3">
              <ThemedText className="text-[15px] font-extrabold text-white">Ücretsiz Üye Ol</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={sectionShadow} className="mx-4 mb-4 rounded-[18px] border border-[#eee5e2] bg-white p-4">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#222]">Popüler Rotalar</ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-[13px] font-bold text-[#d32f2f]">Tümü →</ThemedText>
              </TouchableOpacity>
            </View>

            <View className="mb-2 flex-row items-center rounded-xl border border-[#f1eeee] bg-white p-2.5">
              <View className="h-12 w-12 rounded-[10px] bg-[#e0e0e0]" />
              <View className="flex-1 px-2.5">
                <ThemedText className="mb-0.5 text-sm font-extrabold text-[#222]">Tarihi Merkez Turu</ThemedText>
                <ThemedText className="text-xs text-[#888]">6 durak · ⭐ 4.8</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={22} color="#d32f2f" />
            </View>

            <View className="flex-row items-center rounded-xl border border-[#f1eeee] bg-white p-2.5">
              <View className="h-12 w-12 rounded-[10px] border border-[#e0e0e0] bg-[#f5f5f5]" />
              <View className="flex-1 px-2.5">
                <ThemedText className="mb-0.5 text-sm font-extrabold text-[#222]">Meriç Kıyısı Gezisi</ThemedText>
                <ThemedText className="text-xs text-[#888]">4 durak · ⭐ 4.6</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={22} color="#d32f2f" />
            </View>
          </View>

          <View style={sectionShadow} className="mx-4 mb-4 rounded-[18px] border border-[#eee5e2] bg-white p-4">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#222]">Yaklaşan Etkinlikler</ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-[13px] font-bold text-[#d32f2f]">Tümü →</ThemedText>
              </TouchableOpacity>
            </View>

            <View className="mb-2 flex-row items-center rounded-xl border border-[#f1eeee] bg-white p-2.5">
              <View className="flex-1 px-2.5">
                <ThemedText className="mb-0.5 text-sm font-extrabold text-[#222]">Kırkpınar Yağlı Güreş Festivali</ThemedText>
                <ThemedText className="text-xs text-[#888]">Kültürel · 5-11 Temmuz 2026</ThemedText>
              </View>
              <IconSymbol name="calendar" size={22} color="#d32f2f" />
            </View>

            <View className="flex-row items-center rounded-xl border border-[#f1eeee] bg-white p-2.5">
              <View className="flex-1 px-2.5">
                <ThemedText className="mb-0.5 text-sm font-extrabold text-[#222]">Edirne Festivali</ThemedText>
                <ThemedText className="text-xs text-[#888]">Festival · 1-5 Mayıs 2026</ThemedText>
              </View>
              <IconSymbol name="calendar" size={22} color="#d32f2f" />
            </View>
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#ddc7f2] bg-[#f6edff] p-4">
            <View className="mb-2.5 flex-row items-center justify-between">
              <ThemedText className="text-[15px] font-extrabold text-[#8e24aa]">Topluluk Rotaları</ThemedText>
              <TouchableOpacity>
                <ThemedText className="text-[13px] font-bold text-[#8e24aa]">Keşfet →</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText className="mb-2.5 text-[13px] leading-[18px] text-[#8e24aa]">
              Diğer gezginlerin paylaştığı rotaları keşfedin ve kendi rotalarınızı paylaşın
            </ThemedText>

            <TouchableOpacity className="items-center rounded-xl bg-[#8e24aa] py-2.5">
              <ThemedText className="text-sm font-extrabold text-white">Topluluğu Gör</ThemedText>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-4 rounded-[18px] border border-[#ffd9d2] bg-[#fff6f2] p-4">
            <ThemedText className="mb-1 text-[15px] font-extrabold text-[#d32f2f]">Edirne Hakkında</ThemedText>
            <ThemedText className="text-[13px] leading-[18px] text-[#d32f2f]">
              Tarihi ve kültürel zenginlikleriyle UNESCO Dünya Mirası Listesi'nde yer alan Edirne, Mimar Sinan'ın
              ustalık eseri Selimiye Camii ve Kırkpınar Yağlı Güreşleri ile ünlüdür.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}