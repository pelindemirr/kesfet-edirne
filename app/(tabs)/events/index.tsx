import AppHeader from '@/components/layout/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAllEvents, getCategoryLabel, getEventTiming, getEventTimingLabel, type Event, type EventTiming } from '@/services/api';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const categoryImages: Record<string, ImageSourcePropType> = {
  kultur: require('../../../assets/events/kultur.png'),       // .jpg yerine .png yapıldı
  sanat: require('../../../assets/events/sanat.png'),
  gastronomi: require('../../../assets/events/gastronomi.jpeg'), // .jpg yerine .jpeg yapıldı
  spor: require('../../../assets/events/spor.png'),
};

const categoryOptions = [
  { key: 'all', label: 'Tümü' },
  { key: 'kultur', label: 'Kültür' },
  { key: 'sanat', label: 'Sanat' },
  { key: 'gastronomi', label: 'Gastronomi' },
  { key: 'spor', label: 'Spor' },
] as const;

const timingOptions = [
  { key: 'all', label: 'Tümü', subtitle: 'Bütün etkinlikler', icon: 'calendar' as const },
  { key: 'upcoming', label: 'Yaklaşan', subtitle: 'Gelecek tarihli', icon: 'clock' as const },
  { key: 'past', label: 'Geçmiş', subtitle: 'Son 1 aydaki geçmiş etkinlikler', icon: 'chevron.right' as const },
] as const;

function normalizeCategory(category: string | undefined | null) {
  return (category || '')
    .trim()
    .toLowerCase()
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıIİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u');
}

type ParticipationStatus = 'attended' | 'will-attend' | 'will-not-attend';

const participationLabels: Record<ParticipationStatus, string> = {
  attended: 'Katıldım',
  'will-attend': 'Katılıyorum',
  'will-not-attend': 'Katılmıyorum',
};

const statusOptions: Array<{
  key: ParticipationStatus;
  title: string;
  icon: string;
  activeClass: string;
  activeTextClass: string;
}> = [
  {
    key: 'attended',
    title: 'Gidiyorum',
    icon: '✓',
    activeClass: 'border-[#22c55e] bg-[#f0fdf4]',
    activeTextClass: 'text-[#15803d]',
  },
  {
    key: 'will-attend',
    title: 'İlgileniyorum',
    icon: '◔',
    activeClass: 'border-[#f59e0b] bg-[#fef3c7]',
    activeTextClass: 'text-[#b45309]',
  },
  {
    key: 'will-not-attend',
    title: 'Gitmiyorum',
    icon: '✕',
    activeClass: 'border-[#9ca3af] bg-[#f3f4f6]',
    activeTextClass: 'text-[#4b5563]',
  },
];

const participationHintByStatus: Record<ParticipationStatus, string> = {
  attended: 'Etkinliğe katılım durumun kaydedildi.',
  'will-attend': 'Etkinliği takiptesin, kararını sonra verebilirsin.',
  'will-not-attend': 'Sorun değil, diğer etkinliklerde görüşürüz.',
};

const monthToNumber: Record<string, string> = {
  Ocak: '01',
  Şubat: '02',
  Mart: '03',
  Nisan: '04',
  Mayıs: '05',
  Haziran: '06',
  Temmuz: '07',
  Ağustos: '08',
  Eylül: '09',
  Ekim: '10',
  Kasım: '11',
  Aralık: '12',
};

const pad2 = (value: number | string) => String(value).padStart(2, '0');

function resolveCategoryImage(category: string | undefined | null) {
  const normalizedCategory = normalizeCategory(category);
  return categoryImages[normalizedCategory] ?? categoryImages.kultur;
}

// Bir etkinliğin Date nesnesini güvenli şekilde çözen yardımcı fonksiyon
function parseEventDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  try {
    const parts = dateStr.trim().split(' ');
    if (parts.length < 3) return null;

    const dayPart = parts[0];
    const monthText = parts[1];
    const yearRaw = parts[2];

    // "12-15" gibi aralıklı gün varsa ilk günü baz alıyoruz
    const startDayRaw = dayPart.split('-')[0];
    const day = parseInt(startDayRaw, 10);
    const month = parseInt(monthToNumber[monthText] || '01', 10) - 1;
    const year = parseInt(yearRaw, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
  } catch (e) {
    return null;
  }
}

function getTimingTone(timing: EventTiming) {
  if (timing === 'past') {
    return 'border-[#fca5a5] bg-[#fff1f2] text-[#991b1b]';
  }
  return 'border-[#34d399] bg-[#ecfdf5] text-[#065f46]';
}

function normalizeEventDateAndTime(event: Event) {
  return {
    date: event.date || 'Tarih bilgisi yok',
    time: event.time || 'Saat bilgisi yok',
  };
}

// 🗓️ ETKİNLİĞİN SON 1 AY İÇİNDE OLUP OLMADIĞINI KONTROL EDEN METOD
function isWithinLastMonthOrUpcoming(event: Event): boolean {
  const eventDate = parseEventDate(event.date);
  if (!eventDate) return true; // Tarih çözülemezse filtre dışı bırakma güvenle göster

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Etkinlik gelecek tarihliyse (yaklaşan) her zaman göster
  if (eventDate >= today) return true;

  // Geçmiş tarihliyse, bugünden tam 1 ay öncesinin tarih sınırını hesapla
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  return eventDate >= oneMonthAgo;
}

function buildGoogleCalendarUrl(event: Event) {
  const [dayPart, monthTextRaw, yearRaw] = event.date.split(' ');
  const [startDayRaw, endDayRaw] = (dayPart || '').split('-');

  const month = monthToNumber[monthTextRaw] || '01';
  const year = /^\d{4}$/.test(yearRaw || '') ? yearRaw : String(new Date().getFullYear());
  const startDay = pad2(startDayRaw || '01');
  const endDay = pad2(endDayRaw || startDayRaw || '01');

  const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  const startHour = pad2(timeMatch?.[1] || '09');
  const startMinute = pad2(timeMatch?.[2] || '00');
  const endHour = pad2(timeMatch?.[3] || '18');
  const endMinute = pad2(timeMatch?.[4] || '00');

  const dates = `${year}${month}${startDay}T${startHour}${startMinute}00/${year}${month}${endDay}T${endHour}${endMinute}00`;
  const details = `Kategori: ${getCategoryLabel(event.category)}\nEtkinlik: ${event.title}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(dates)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location)}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participationByEvent, setParticipationByEvent] = useState<Record<number, ParticipationStatus>>({});
  const [savedToGoogleByEvent, setSavedToGoogleByEvent] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryOptions)[number]['key']>('all');
  const [selectedTiming, setSelectedTiming] = useState<(typeof timingOptions)[number]['key']>('all');

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllEvents();
        if (!isMounted) return;

        // 🔄 Burada gelen veriyi ilk aşamada son 1 ayı kapsayacak şekilde ön filtrelemeden geçiriyoruz
        const validEvents = data.filter(isWithinLastMonthOrUpcoming);
        setEvents(validEvents);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : 'Etkinlikler yüklenemedi.');
        setEvents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const timingCounts = useMemo(() => {
    return events.reduce(
      (accumulator, event) => {
        const timing = getEventTiming(event);
        accumulator.all += 1;
        accumulator[timing] += 1;
        return accumulator;
      },
      { all: 0, upcoming: 0, past: 0 } as Record<(typeof timingOptions)[number]['key'], number>,
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = selectedCategory === 'all' || normalizeCategory(event.category) === selectedCategory;
      const eventTiming = getEventTiming(event);
      const matchesTiming = selectedTiming === 'all' || selectedTiming === eventTiming;

      return matchesCategory && matchesTiming;
    });
  }, [events, selectedCategory, selectedTiming]);

  const filteredCountText = useMemo(() => {
    return `${filteredEvents.length} güncel etkinlik listeleniyor`;
  }, [filteredEvents.length]);

  const closeModal = () => setSelectedEvent(null);

  const setParticipationStatus = (status: ParticipationStatus) => {
    if (!selectedEvent) return;
    setParticipationByEvent((prev) => ({
      ...prev,
      [selectedEvent.id]: status,
    }));
  };

  const handleSaveToGoogleCalendar = async () => {
    if (!selectedEvent) return;

    const url = buildGoogleCalendarUrl(selectedEvent);
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) return;

    await Linking.openURL(url);
    setSavedToGoogleByEvent((prev) => ({
      ...prev,
      [selectedEvent.id]: true,
    }));
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-24 pt-4">
          <Text className="mb-1 mt-2 text-xl font-bold text-[#880000]">Tüm Etkinlikler</Text>
          <Text className="mb-4 text-sm text-[#555]">Edirne'de gerçekleşen ve gelecek tüm etkinlikler</Text>

          {/* Filtre Butonları */}
          <View className="mb-3">
            <View className="flex-row items-center space-x-2">
              {timingOptions.map((option) => {
                const isSelected = selectedTiming === option.key;
                const count = timingCounts[option.key];

                return (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setSelectedTiming(option.key)}
                    className={`flex-row items-center rounded-full border px-3 py-2 ${isSelected ? 'bg-[#880000] border-[#880000]' : 'bg-white border-[#eef2f2]'}`}
                  >
                    <IconSymbol name={option.icon} size={16} color={isSelected ? '#ffffff' : '#880000'} />
                    <Text className={`ml-2 text-[12px] font-semibold ${isSelected ? 'text-white' : 'text-[#2f1b1b]'}`}>{option.label}</Text>

                    <View className={`ml-2 rounded-full px-2 py-0.5 ${isSelected ? 'bg-white/20' : 'bg-[#fff5f5]'}`}>
                      <Text className={`text-[11px] ${isSelected ? 'text-white' : 'text-[#9f1239]'}`}>{count}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mb-3 flex-row flex-wrap gap-2">
            {categoryOptions.map((option) => {
              const isSelected = selectedCategory === option.key;

              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setSelectedCategory(option.key)}
                  className={`rounded-full border px-4 py-2 ${isSelected ? 'border-[#880000] bg-[#880000]' : 'border-[#e5e7eb] bg-white'}`}
                >
                  <Text className={`text-[12px] font-semibold ${isSelected ? 'text-white' : 'text-[#4b5563]'}`}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="mb-4 text-[12px] text-[#7a7a7a] font-medium">{filteredCountText}</Text>

          {error && (
            <View className="mb-4 rounded-xl border border-[#f3c7c7] bg-[#fff5f5] px-4 py-3">
              <Text className="text-[13px] font-semibold text-[#b42318]">Veri alınamadı</Text>
              <Text className="mt-1 text-[12px] text-[#7a2e2e]">{error}</Text>
            </View>
          )}

          {!loading && filteredEvents.length === 0 && !error && (
            <View className="rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafafa] px-4 py-8">
              <Text className="text-center text-[14px] font-semibold text-[#374151]">Etkinlik bulunamadı</Text>
              <Text className="mt-1 text-center text-[12px] text-[#6b7280]">Uygun güncel etkinlik bulunmuyor.</Text>
            </View>
          )}

          {filteredEvents.map((event) => {
            const currentStatus = participationByEvent[event.id];
            const savedToGoogle = savedToGoogleByEvent[event.id];
            const normalizedDateTime = normalizeEventDateAndTime(event);
            const timingLabel = getEventTimingLabel(event);
            const timingTone = getTimingTone(timingLabel === 'Geçmiş' ? 'past' : 'upcoming');

            return (
              <TouchableOpacity
                key={event.id}
                onPress={() => setSelectedEvent(event)}
                className="mb-4 flex-row overflow-hidden rounded-[22px] border border-[#eee] bg-white shadow-lg shadow-black/10"
                activeOpacity={0.85}
              >
                <Image source={resolveCategoryImage(event.category)} className="h-[146px] w-[140px] rounded-l-[22px]" />
                <View className="flex-1 justify-center p-3">
                  <View className="mb-1 flex-row items-center justify-between gap-2">
                    <Text className="text-[13px] font-bold text-[#d32f2f]">{getCategoryLabel(event.category)}</Text>
                    <View className="flex-row items-center gap-1.5">
                      <View className={`rounded-full border px-2 py-1 ${timingTone}`}>
                        <Text className="text-[10px] font-semibold">{timingLabel}</Text>
                      </View>
                      {savedToGoogle && (
                        <View className="rounded-full bg-[#ecfeff] px-2 py-1">
                          <Text className="text-[10px] font-semibold text-[#0e7490]">Google'a kayıtlı</Text>
                        </View>
                      )}
                      {currentStatus && (
                        <View className="rounded-full bg-[#fef2f2] px-2 py-1">
                          <Text className="text-[11px] font-semibold text-[#b91c1c]">{participationLabels[currentStatus]}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text className="mb-1 text-base font-bold text-[#111827]">{event.title}</Text>
                  <Text className="mb-0.5 text-[13px] text-[#4b5563]">Tarih: {normalizedDateTime.date}</Text>
                  <Text className="mb-0.5 text-[13px] text-[#4b5563]">Saat: {normalizedDateTime.time}</Text>
                  <Text className="text-[13px] text-[#4b5563]">Konum: {event.location}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Detay Modalı */}
      <Modal visible={selectedEvent !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/45 px-5">
          <View className="w-full max-w-[380px] rounded-[24px] bg-white p-4 shadow-xl shadow-black/20">
            {selectedEvent ? (
              <>
                <Image source={resolveCategoryImage(selectedEvent.category)} className="mb-3 h-[170px] w-full rounded-[18px]" />

                <View className="flex-row flex-wrap items-center gap-2">
                  <View className="rounded-full bg-[#fff1f2] px-2.5 py-1">
                    <Text className="text-[11px] font-bold text-[#d32f2f]">{getCategoryLabel(selectedEvent.category)}</Text>
                  </View>
                  <View className={`rounded-full border px-2.5 py-1 ${getTimingTone(getEventTiming(selectedEvent))}`}>
                    <Text className="text-[11px] font-bold">{getEventTimingLabel(selectedEvent)}</Text>
                  </View>
                </View>
                <Text className="mt-1 text-[21px] font-extrabold text-[#111827]">{selectedEvent.title}</Text>

                <View className="mt-3 gap-1.5 rounded-[18px] bg-[#f9fafb] p-3">
                  <Text className="text-[13px] text-[#374151]">Tarih: {normalizeEventDateAndTime(selectedEvent).date}</Text>
                  <Text className="text-[13px] text-[#374151]">Saat: {normalizeEventDateAndTime(selectedEvent).time}</Text>
                  <Text className="text-[13px] text-[#374151]">Konum: {selectedEvent.location}</Text>
                </View>

                <Text className="mb-2 mt-4 text-[14px] font-semibold text-[#111827]">Katılım durumunuz</Text>

                <View className="flex-row items-center justify-between gap-2">
                  {statusOptions.map((option) => {
                    const isSelected = participationByEvent[selectedEvent.id] === option.key;

                    return (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() => setParticipationStatus(option.key)}
                        className={`flex-1 rounded-full border px-2.5 py-2 ${isSelected ? option.activeClass : 'border-[#d1d5db] bg-white'}`}
                      >
                        <View className="flex-row items-center justify-center gap-1.5">
                          <Text className={`text-[14px] font-bold ${isSelected ? option.activeTextClass : 'text-[#6b7280]'}`}>{option.icon}</Text>
                          <Text className={`text-[11px] font-semibold ${isSelected ? option.activeTextClass : 'text-[#6b7280]'}`}>{option.title}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text className="mt-2 text-center text-[12px] text-[#6b7280]">
                  {participationByEvent[selectedEvent.id]
                    ? participationHintByStatus[participationByEvent[selectedEvent.id]]
                    : 'Katılım durumunu seçerek etkinliği kolayca takip et.'}
                </Text>

                <TouchableOpacity
                  onPress={handleSaveToGoogleCalendar}
                  className="mt-4 flex-row items-center justify-center gap-2 rounded-full border border-[#f0b7bf] bg-[#faf6f7] py-3"
                >
                  <IconSymbol name="calendar" size={14} color="#9f1239" />
                  <Text className="text-center text-[14px] font-semibold text-[#9f1239]">Takvime Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={closeModal} className="mt-4 rounded-xl bg-[#111827] py-3">
                  <Text className="text-center text-[14px] font-bold text-white">Kapat</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}