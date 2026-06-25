import { useAuth } from '@/components/auth/auth-context';
import ChatbotScreen from '@/components/chatbot/ChatbotScreen';
import AppHeader from '@/components/layout/Header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getCategoryLabel, getEventTimingLabel, getUpcomingEvents, type Event } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { fetchLiveWeather, fetchUsdTryRate } from '../../services/home-live-data';

const rotaIcon = require('../../assets/icon/rota.png');
const mapIcon = require('../../assets/icon/map.png');
const eventsIcon = require('../../assets/icon/events.png');
const groupsIcon = require('../../assets/icon/groups.png');
const editIcon = require('../../assets/icon/edit.png');
const star = require('../../assets/icon/stars.png');
const chatbotIcon = require('../../assets/chatbot/chatbot .png');

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(); // Çeviri kancası eklendi

  // JSON'dan dizi olarak alıyoruz
  const subtitleMessages = t('home.subtitles', { returnObjects: true }) as string[];

  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [weatherDescription, setWeatherDescription] = useState('');
  const [usdTryRate, setUsdTryRate] = useState<number | null>(null);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Canlı Hava Durumu ve Döviz Verilerini Çekme
  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      try {
        const [weather, currency] = await Promise.all([
          fetchLiveWeather(),
          fetchUsdTryRate(),
        ]);

        if (!isMounted) return;

        setTemperatureC(weather.temperatureC);
        setWeatherDescription(weather.description);
        setUsdTryRate(currency.usdTry);
      } catch {
        if (!isMounted) return;
        setTemperatureC(null);
        setUsdTryRate(null);
      }
    };

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Günlük Değişen Altyazı Mesajı
  useEffect(() => {
    const today = new Date().getDate();
    // Güvenlik: Eğer dizi yüklenemediyse veya boşsa hatayı önlemek için
    if (subtitleMessages && subtitleMessages.length > 0) {
      const messageIndex = today % subtitleMessages.length;
      setSubtitleIndex(messageIndex);
    }
  }, [subtitleMessages]);

  // Yaklaşan Etkinlikleri API'den Yükleme
  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await getUpcomingEvents();
        if (isMounted) {
          setUpcomingEvents(Array.isArray(data) ? data.slice(0, 2) : []);
        }
      } catch {
        if (isMounted) {
          setUpcomingEvents([]);
        }
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const weatherChipText = useMemo(() => {
    if (temperatureC == null) {
      return t('home.loadingWeather');
    }
    return `☀️ ${Math.round(temperatureC)}° ${weatherDescription}`;
  }, [temperatureC, weatherDescription, t]);

  const currencyChipText = useMemo(() => {
    if (usdTryRate == null) {
      return t('home.loadingCurrency');
    }
    return `$ USD ${usdTryRate.toFixed(2)}`;
  }, [usdTryRate, t]);

  return (
    <View className="flex-1 bg-[#f6f2ee]">
      <Modal visible={chatbotModalOpen} animationType="slide">
        <ChatbotScreen onClose={() => setChatbotModalOpen(false)} />
      </Modal>

      <AppHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-24">
          <View className="relative overflow-hidden bg-[#b10016] pb-7">
            <View className="absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-white/10" />
            <View className="absolute -left-8 bottom-6 h-[90px] w-[90px] rounded-full bg-white/5" />

            <View className="px-5 pt-5">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center">
                    <Image source={star} className="mr-2 h-6 w-6" resizeMode="contain" style={{ tintColor: '#ffffff' }} />
                    <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="text-[28px] font-black leading-[32px] text-white">
                      {t('home.hero.appName')}
                    </ThemedText>
                  </View>
                  <ThemedText lightColor="#ffffff" darkColor="#ffffff" className="mt-1 text-[13px] leading-[18px] text-white/90">
                    {t('home.hero.subtitle')}
                  </ThemedText>
                </View>
              </View>

              <View className="rounded-[26px] border border-white/70 bg-white shadow-sm shadow-black/10">
                <View className="flex-row items-center justify-between px-5 pb-4 pt-4">
                  <View className="flex-1 pr-3">
                    <ThemedText className="text-[27px] font-extrabold text-[#1f1f1f]">
                      {t('home.hero.question')}
                    </ThemedText>
                    <ThemedText className="mt-1 text-[13px] text-[#6f6f6f]">
                      {subtitleMessages[subtitleIndex]}
                    </ThemedText>
                  </View>

                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#fff3f2]">
                    <IconSymbol name="arrow.right" size={20} color="#d32f2f" />
                  </View>
                </View>

                <View className="mx-5 h-[1px] bg-[#f2ece7]" />

                {/* Soft Mavi ve Yeşil Dengeli Üst Chipler */}
                <View className="flex-row flex-wrap px-4 pb-4 pt-3">
                  <View className="mb-2 mr-2 rounded-full border border-[#bae6fd] bg-[#e0f2fe] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#0369a1]">{weatherChipText}</ThemedText>
                  </View>
                  <View className="mb-2 rounded-full border border-[#cfead6] bg-[#f2fbf5] px-3 py-1.5">
                    <ThemedText className="text-[12px] font-bold text-[#1b8f49]">{currencyChipText}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-3 flex-row flex-wrap justify-between px-4">
            <Link href="/explore" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[20px] border border-[#ece5e1] bg-white px-4 pb-4 pt-4 shadow-sm shadow-black/8">
                <View className="mb-4 h-[44px] w-[44px] items-center justify-center rounded-[15px] bg-[#fff4f4]">
                  <Image source={mapIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2 text-base font-extrabold text-[#15324b]">{t('home.navCards.mapTitle')}</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">{t('home.navCards.mapDesc')}</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/rota" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[20px] border border-[#ece5e1] bg-white px-4 pb-4 pt-4 shadow-sm shadow-black/8">
                <View className="mb-4 h-[44px] w-[44px] items-center justify-center rounded-[15px] bg-[#fff6ea]">
                  <Image source={rotaIcon} className="h-6 w-6" resizeMode="contain" style={{ tintColor: '#d08a1f' }} />
                </View>
                <ThemedText className="mb-2 text-base font-extrabold text-[#15324b]">{t('home.navCards.routesTitle')}</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">{t('home.navCards.routesDesc')}</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/events" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[20px] border border-[#ece5e1] bg-white px-4 pb-4 pt-4 shadow-sm shadow-black/8">
                <View className="mb-4 h-[44px] w-[44px] items-center justify-center rounded-[15px] bg-[#edf5ff]">
                  <Image source={eventsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2 text-base font-extrabold text-[#15324b]">{t('home.navCards.eventsTitle')}</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">{t('home.navCards.eventsDesc')}</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/community" asChild>
              <TouchableOpacity className="mb-3 min-h-[140px] w-[48.5%] rounded-[20px] border border-[#ece5e1] bg-white px-4 pb-4 pt-4 shadow-sm shadow-black/8">
                <View className="mb-4 h-[44px] w-[44px] items-center justify-center rounded-[15px] bg-[#f5edff]">
                  <Image source={groupsIcon} className="h-6 w-6" resizeMode="contain" />
                </View>
                <ThemedText className="mb-2 text-base font-extrabold text-[#15324b]">{t('home.navCards.communityTitle')}</ThemedText>
                <ThemedText className="text-xs leading-4 text-[#6d7a88]">{t('home.navCards.communityDesc')}</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>

          {!isAuthenticated && (
            <View className="mx-4 mb-5 mt-2 rounded-[24px] border border-[#eadfcc] bg-[#fbf7f1] p-5 shadow-sm">
              <View className="mb-4 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#b10016]/10">
                  <Image source={editIcon} className="h-5 w-5" resizeMode="contain" style={{ tintColor: '#b10016' }} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-base font-black text-[#111827]">{t('home.guest.title')}</ThemedText>
                  <ThemedText className="mt-0.5 text-[13px] font-medium text-gray-500">
                    {t('home.guest.desc')}
                  </ThemedText>
                </View>
              </View>

              <View className="mb-5 px-1">
                <View className="mb-2 flex-row items-center">
                  <Text className="mr-2 text-[10px] text-[#b10016]">●</Text>
                  <ThemedText className="text-[13px] font-semibold text-gray-700">{t('home.guest.bullet1')}</ThemedText>
                </View>
                <View className="mb-2 flex-row items-center">
                  <Text className="mr-2 text-[10px] text-[#b10016]">●</Text>
                  <ThemedText className="text-[13px] font-semibold text-gray-700">{t('home.guest.bullet2')}</ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Text className="mr-2 text-[10px] text-[#b10016]">●</Text>
                  <ThemedText className="text-[13px] font-semibold text-gray-700">{t('home.guest.bullet3')}</ThemedText>
                </View>
              </View>

              <Link href="/register" asChild>
                <TouchableOpacity className="items-center justify-center rounded-xl bg-[#b10016] py-3.5 shadow-sm shadow-[#b10016]/15" activeOpacity={0.9}>
                  <ThemedText className="text-[14px] font-bold tracking-wide text-white">{t('home.guest.button')}</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          )}

          {/* 📰 1. Premium Tasarımlı Bölüm: Edirne Gündemi / Haberler */}
          <View className="mx-4 mb-4 rounded-[22px] border border-[#e2e8f0] bg-white p-5 shadow-sm shadow-black/5">
            <View className="mb-3.5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#ef4444]/10">
                  <IconSymbol name="newspaper" size={16} color="#ef4444" />
                </View>
                <ThemedText className="text-[16px] font-extrabold text-[#1e293b]">{t('home.news.title')}</ThemedText>
              </View>
              <Link href="/(account)/news" asChild>
                <TouchableOpacity className="rounded-full bg-[#f1f5f9] px-3 py-1">
                  <ThemedText className="text-[12px] font-bold text-[#64748b]">{t('home.news.seeAll')}</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            <Link href="/(account)/news" asChild>
              <TouchableOpacity className="rounded-xl bg-[#f8fafc] border border-[#f1f5f9] p-3.5 flex-row items-center">
                <View className="flex-1 pr-2">
                  <Text className="text-[14px] font-bold text-[#0f172a]" numberOfLines={1}>{t('home.news.cardTitle')}</Text>
                  <Text className="text-[12px] text-[#64748b] mt-1 leading-[16px]">{t('home.news.cardDesc')}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#94a3b8" />
              </TouchableOpacity>
            </Link>
          </View>

          {/* 🏛️ 2. Premium Tasarımlı Bölüm: Yaklaşan Etkinlikler */}
          <View className="mx-4 mb-4 rounded-[22px] border border-[#e2e8f0] bg-white p-5 shadow-sm shadow-black/5">
            <View className="mb-3.5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#dc2626]/10">
                  <IconSymbol name="calendar" size={16} color="#dc2626" />
                </View>
                <ThemedText className="text-[16px] font-extrabold text-[#1e293b]">{t('home.events.title')}</ThemedText>
              </View>
              <Link href="/events" asChild>
                <TouchableOpacity className="rounded-full bg-[#f1f5f9] px-3 py-1">
                  <ThemedText className="text-[12px] font-bold text-[#64748b]">{t('home.events.filter')}</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>

            {eventsLoading ? (
              <ThemedText className="text-[12px] text-[#888] px-1">{t('home.events.syncing')}</ThemedText>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <TouchableOpacity key={event.id} className="mb-2.5 flex-row items-center rounded-[16px] border border-[#f1f5f9] bg-[#f8fafc] p-3">
                  <View className="h-12 w-12 items-center justify-center rounded-[12px] bg-[#fff1f1]">
                    <IconSymbol name="calendar" size={20} color="#d32f2f" />
                  </View>
                  <View className="flex-1 px-3">
                    <View className="mb-1 flex-row items-center gap-1.5">
                      <View className="rounded-full bg-[#dcfce7] px-2 py-0.5 border border-[#bbf7d0]">
                        <ThemedText className="text-[9px] font-bold text-[#16a34a]">
                          {getEventTimingLabel(event)}
                        </ThemedText>
                      </View>
                      <ThemedText className="text-[10px] font-bold text-[#d32f2f]">
                        {getCategoryLabel(event.category)}
                      </ThemedText>
                    </View>
                    <Text className="text-[13px] font-bold text-[#1e293b]" numberOfLines={1}>
                      {event.title || t('home.events.fallbackTitle')}
                    </Text>
                    <ThemedText className="text-[11px] text-[#64748b] mt-0.5">
                      {event.date || t('home.events.fallbackDate')} · {event.time || ''}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText className="text-[12px] text-[#888] px-1">{t('home.events.empty')}</ThemedText>
            )}
          </View>

          {/* 🌷 3. Kültürel Vitrin: Edirne Efsaneleri / Hikayeler */}
          <TouchableOpacity 
            className="mx-4 mb-4 overflow-hidden rounded-[20px] border border-[#f1f5f9] bg-white p-5 shadow-sm shadow-black/5"
            activeOpacity={0.9}
            onPress={() => router.push('/(account)/stories')}
          >
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d97706]" />
            <View className="flex-row items-start justify-between pl-1">
              <View className="flex-1 pr-4">
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#d97706]/10">
                    <IconSymbol name="sparkles" size={14} color="#d97706" />
                  </View>
                  <ThemedText className="text-[14px] font-black uppercase tracking-wider text-[#d97706]">{t('home.stories.tag')}</ThemedText>
                </View>
                <Text className="text-[17px] font-extrabold text-[#1e293b] mb-1.5">{t('home.stories.title')}</Text>
                <Text className="text-[13px] leading-[18px] text-[#64748b]">
                  {t('home.stories.desc')}
                </Text>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] self-center">
                <IconSymbol name="chevron.right" size={16} color="#64748b" />
              </View>
            </View>
          </TouchableOpacity>

          {/* 🏛️ 4. Kültürel Vitrin: Edirne Hakkında Genel Bilgi */}
          <TouchableOpacity 
            className="mx-4 mb-4 overflow-hidden rounded-[20px] border border-[#f1f5f9] bg-white p-5 shadow-sm shadow-black/5"
            activeOpacity={0.9}
            onPress={() => router.push('/(account)/about')}
          >
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#dc2626]" />
            <View className="flex-row items-start justify-between pl-1">
              <View className="flex-1 pr-4">
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#dc2626]/10">
                    <IconSymbol name="building.columns" size={14} color="#dc2626" />
                  </View>
                  <ThemedText className="text-[14px] font-black uppercase tracking-wider text-[#dc2626]">{t('home.about.tag')}</ThemedText>
                </View>
                <Text className="text-[17px] font-extrabold text-[#1e293b] mb-1.5">{t('home.about.title')}</Text>
                <Text className="text-[13px] leading-[18px] text-[#64748b]">
                  {t('home.about.desc')}
                </Text>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] self-center">
                <IconSymbol name="chevron.right" size={16} color="#64748b" />
              </View>
            </View>
          </TouchableOpacity>

          {/* 👥 5. Premium Tasarımlı Bölüm: Topluluk Rotaları */}
          <TouchableOpacity 
            className="mx-4 mb-4 overflow-hidden rounded-[20px] border border-[#f1f5f9] bg-white p-5 shadow-sm shadow-black/5"
            activeOpacity={0.9}
            onPress={() => router.push('/community')}
          >
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9333ea]" />
            <View className="flex-row items-start justify-between pl-1">
              <View className="flex-1 pr-4">
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#9333ea]/10">
                    <IconSymbol name="person.3.fill" size={12} color="#9333ea" />
                  </View>
                  <ThemedText className="text-[14px] font-black uppercase tracking-wider text-[#9333ea]">{t('home.community.tag')}</ThemedText>
                </View>
                <Text className="text-[17px] font-extrabold text-[#1e293b] mb-1.5">{t('home.community.title')}</Text>
                <Text className="text-[13px] leading-[18px] text-[#64748b]">
                  {t('home.community.desc')}
                </Text>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] self-center">
                <IconSymbol name="chevron.right" size={16} color="#64748b" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isAuthenticated && (
        <TouchableOpacity
          onPress={() => setChatbotModalOpen(true)}
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            right: 18,
            bottom: 32,
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: '#b10016',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            zIndex: 20,
          }}
        >
          <Image source={chatbotIcon} className="h-9 w-9" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}