
import AppHeader from '@/components/layout/Header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { fetchLiveWeather, fetchUsdTryRate } from '@/services/home-live-data';

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

const rotaIcon = require('../../assets/icon/rota.png');
const mapIcon = require('../../assets/icon/map.png');

const eventsIcon = require('../../assets/icon/events.png');
const groupsIcon = require('../../assets/icon/groups.png');
const editIcon = require('../../assets/icon/edit.png');
const star = require('../../assets/icon/stars.png');

export default function HomeScreen() {
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [weatherDescription, setWeatherDescription] = useState('Güncel');
  const [usdTryRate, setUsdTryRate] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      try {
        const [weather, currency] = await Promise.all([
          fetchLiveWeather(),
          fetchUsdTryRate(),
        ]);

        if (!isMounted) {
          return;
        }

        setTemperatureC(weather.temperatureC);
        setWeatherDescription(weather.description);
        setUsdTryRate(currency.usdTry);
      } catch {
        if (!isMounted) {
          return;
        }

        setTemperatureC(null);
        setUsdTryRate(null);
      }
    };

    loadLiveData();

    return () => {
      isMounted = false;
    };
  }, []);

  const weatherChipText = useMemo(() => {
    if (temperatureC == null) {
      return '☁️ Hava yükleniyor';
    }

    return `☀️ ${Math.round(temperatureC)}° ${weatherDescription}`;
  }, [temperatureC, weatherDescription]);

  const currencyChipText = useMemo(() => {
    if (usdTryRate == null) {
      return '$ Kur yükleniyor';
    }

    return `$ USD ${usdTryRate.toFixed(2)}`;
  }, [usdTryRate]);

  return (
    <View className="flex-1 bg-[#f7f4f2]">
      <AppHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-24">
          <View className="relative overflow-hidden bg-[#c40018] pb-6">
            <View className="absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-white/10" />
            <View className="absolute -left-8 bottom-6 h-[90px] w-[90px] rounded-full bg-white/5" />

            <View className="px-5 pt-5">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center">
                    <Image source={star} className="mr-2 h-6 w-6" resizeMode="contain" style={{ tintColor: '#ffffff' }} />
                    <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="text-[28px] font-black leading-[32px] text-white">Keşfi Edirne</ThemedText>
                  </View>
                  <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="mt-1 text-[13px] leading-[18px] text-white/90">
                    Tarihi keşfedin, rotanızı planlayın
                  </ThemedText>
                </View>

              </View>

            

              <View
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.14,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 5,
                }}
                className="rounded-[22px] border border-[#f1eaea] bg-white"
              >
                <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
                  <View className="flex-1 pr-3">
                    <ThemedText className="text-[27px] font-extrabold text-[#202020]">Bugün nereyi keşfedelim?</ThemedText>
                    <ThemedText className="mt-1 text-[13px] text-[#6f6f6f]">Rotalar ve etkinlikler</ThemedText>
                  </View>

                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1]">
                    <IconSymbol name="arrow.right" size={20} color="#d32f2f" />
                  </View>
                </View>

                <View className="mx-5 h-[1px] bg-[#f1eded]" />

                <View className="flex-row flex-wrap px-4 pb-3 pt-3 ">
                  <View className="mb-2 mr-2 rounded-full border border-[#ffd1cf] bg-[#fff3f2] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#ff7a59]">{weatherChipText}</ThemedText>
                  </View>
                  <View className="mb-2 ml-5 rounded-full border border-[#cfead6] bg-[#eef9f0] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#1b8f49]">{currencyChipText}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-2 flex-row flex-wrap justify-between px-4">
            <Link href="/explore" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff4f4]">
                  <Image source={mapIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Harita</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Kendi rotanızı planlayın.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/rota" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff6ea]">
                  <Image source={rotaIcon} className="h-6 w-6" resizeMode="contain" style={{ tintColor: '#d08a1f' }} />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Rotalar</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Özel hazırlanmış hazır rotalar.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/events" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#edf5ff]">
                  <Image source={eventsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Etkinlikler</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Bölgenizde olan etkinlikler.</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/community" asChild>
              <TouchableOpacity style={cardShadow} className="mb-3 min-h-[140px] w-[48.5%] rounded-[18px] border border-[#ece5e1] bg-white p-4">
                <View className="mb-[22px] h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#f5edff]">
                  <Image source={groupsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2.5 text-base font-extrabold text-[#15324b]">Topluluk</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">Toplulukla paylaşılan rotalara ulaşın.</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mx-4 mb-4 mt-0.5 rounded-[18px] border border-[#ffd4cf] bg-[#fff6f4] p-4">
            <View className="mb-2.5 flex-row items-start">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-[14px] bg-[#e53935]">
                <Image source={editIcon} className="h-5 w-5" resizeMode="contain" style={{ tintColor: '#ffffff' }} />
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