import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { Image, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const events = [
  {
    id: 1,
    category: 'Festival',
    title: 'Kirkpinar Yagli Gures Festivali',
    date: '5-11 Temmuz 2024',
    time: '09:00 - 18:00',
    location: 'Sarayici',
    image: require('../../../assets/events/kirkpinar.jpg'),
  },
  {
    id: 2,
    category: 'Muzik',
    title: 'Edirne Muzik Festivali',
    date: '15-20 Agustos 2024',
    time: '16:00 - 23:00',
    location: 'Danisment, Edirne',
    image: require('../../../assets/events/fest.jpg'),
  },
];

type ParticipationStatus = 'attended' | 'will-attend' | 'will-not-attend';

const participationLabels: Record<ParticipationStatus, string> = {
  attended: 'Katildim',
  'will-attend': 'Katilacagim',
  'will-not-attend': 'Katilmayacagim',
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
    title: 'Ilgileniyorum',
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
  attended: 'Etkinlige katilim durumun kaydedildi.',
  'will-attend': 'Etkinligi takiptesin, kararini sonra verebilirsin.',
  'will-not-attend': 'Sorun degil, diger etkinliklerde gorusuruz.',
};

const monthToNumber: Record<string, string> = {
  Ocak: '01',
  Subat: '02',
  Mart: '03',
  Nisan: '04',
  Mayis: '05',
  Haziran: '06',
  Temmuz: '07',
  Agustos: '08',
  Eylul: '09',
  Ekim: '10',
  Kasim: '11',
  Aralik: '12',
};

const pad2 = (value: number | string) => String(value).padStart(2, '0');

function buildGoogleCalendarUrl(event: (typeof events)[number]) {
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
  const details = `Kategori: ${event.category}\nEtkinlik: ${event.title}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(dates)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location)}`;
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[number] | null>(null);
  const [participationByEvent, setParticipationByEvent] = useState<Record<number, ParticipationStatus>>({});
  const [savedToGoogleByEvent, setSavedToGoogleByEvent] = useState<Record<number, boolean>>({});

  const closeModal = () => setSelectedEvent(null);

  const setParticipationStatus = (status: ParticipationStatus) => {
    if (!selectedEvent) {
      return;
    }

    setParticipationByEvent((prev) => ({
      ...prev,
      [selectedEvent.id]: status,
    }));
  };

  const handleSaveToGoogleCalendar = async () => {
    if (!selectedEvent) {
      return;
    }

    const url = buildGoogleCalendarUrl(selectedEvent);
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return;
    }

    await Linking.openURL(url);
    setSavedToGoogleByEvent((prev) => ({
      ...prev,
      [selectedEvent.id]: true,
    }));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="px-4 pb-24 pt-4">
          <Text className="mb-1 mt-2 text-xl font-bold text-[#880000]">Tum Etkinlikler</Text>
          <Text className="mb-4 text-sm text-[#555]">Edirne'deki guncel etkinlikler</Text>
          {events.map((event) => {
            const currentStatus = participationByEvent[event.id];
            const savedToGoogle = savedToGoogleByEvent[event.id];

            return (
              <TouchableOpacity
                key={event.id}
                onPress={() => setSelectedEvent(event)}
                className="mb-4 flex-row overflow-hidden rounded-xl border border-[#eee] bg-white shadow-lg shadow-black/10"
                activeOpacity={0.85}
              >
                <Image source={event.image} className="h-[140px] w-[140px] rounded-l-xl" />
                <View className="flex-1 justify-center p-3">
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="text-[13px] font-bold text-[#d32f2f]">{event.category}</Text>
                    <View className="flex-row items-center gap-1.5">
                      {savedToGoogle ? (
                        <View className="rounded-full bg-[#ecfeff] px-2 py-1">
                          <Text className="text-[10px] font-semibold text-[#0e7490]">Google'a kayitli</Text>
                        </View>
                      ) : null}
                      {currentStatus ? (
                        <View className="rounded-full bg-[#fef2f2] px-2 py-1">
                          <Text className="text-[11px] font-semibold text-[#b91c1c]">{participationLabels[currentStatus]}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text className="mb-1 text-base font-bold">{event.title}</Text>
                  <Text className="mb-0.5 text-[13px] text-[#444]">Tarih: {event.date}</Text>
                  <Text className="mb-0.5 text-[13px] text-[#444]">Saat: {event.time}</Text>
                  <Text className="text-[13px] text-[#444]">Konum: {event.location}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selectedEvent !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/45 px-5">
          <View className="w-full max-w-[380px] rounded-2xl bg-white p-4">
            {selectedEvent ? (
              <>
                <Image source={selectedEvent.image} className="mb-3 h-[160px] w-full rounded-xl" />

                <Text className="text-[12px] font-bold text-[#d32f2f]">{selectedEvent.category}</Text>
                <Text className="mt-1 text-[21px] font-extrabold text-[#111827]">{selectedEvent.title}</Text>

                <View className="mt-3 gap-1.5 rounded-xl bg-[#f9fafb] p-3">
                  <Text className="text-[13px] text-[#374151]">Tarih: {selectedEvent.date}</Text>
                  <Text className="text-[13px] text-[#374151]">Saat: {selectedEvent.time}</Text>
                  <Text className="text-[13px] text-[#374151]">Konum: {selectedEvent.location}</Text>
                </View>

                <Text className="mb-2 mt-4 text-[14px] font-semibold text-[#111827]">Katilim durumunuz</Text>

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
                    : 'Katilim durumunu secerek etkinligi kolayca takip et.'}
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