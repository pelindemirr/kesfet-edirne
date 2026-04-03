import Header from '@/components/Header';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const eventCardShadow = {
  shadowColor: '#7a0010',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

const events = [
  {
    id: 1,
    category: 'Festival',
    title: 'Kırkpınar Yağlı Güreş Festivali',
    date: '5-11 Temmuz 2024',
    time: '09:00 - 18:00',
    location: 'Sarayiçi',
    image: require('../../assets/events/kirkpinar.jpg'),
  },
  {
    id: 2,
    category: 'Müzik',
    title: 'Edirne Müzik Festivali',
    date: '15-20 Ağustos 2024',
    time: '16:00 - 23:00',
    location: 'Danışment,Edirne',
    image: require('../../assets/events/fest.jpg'),
  },
];

export default function EventsPage() {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        <Text className="mb-1 mt-2 text-xl font-bold text-[#880000]">Tüm Etkinlikler</Text>
        <Text className="mb-4 text-sm text-[#555]">Edirne'deki güncel etkinlikler</Text>
        {events.map(event => (
          <View key={event.id} style={eventCardShadow} className="mb-4 flex-row overflow-hidden rounded-xl border border-[#eee] bg-white">
            <Image source={event.image} className="h-[90px] w-[90px] rounded-l-xl" />
            <View className="flex-1 justify-center p-3">
              <Text className="mb-0.5 text-[13px] font-bold text-[#d32f2f]">{event.category}</Text>
              <Text className="mb-1 text-base font-bold">{event.title}</Text>
              <Text className="mb-0.5 text-[13px] text-[#444]">📅 {event.date}</Text>
              <Text className="mb-0.5 text-[13px] text-[#444]">⏰ {event.time}</Text>
              <Text className="text-[13px] text-[#444]">📍 {event.location}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
