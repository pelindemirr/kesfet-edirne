import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tüm Etkinlikler</Text>
        <Text style={styles.subtitle}>Edirne'deki güncel etkinlikler</Text>
        {events.map(event => (
          <View key={event.id} style={styles.card}>
            <Image source={event.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardCategory}>{event.category}</Text>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardInfo}>📅 {event.date}</Text>
              <Text style={styles.cardInfo}>⏰ {event.time}</Text>
              <Text style={styles.cardInfo}>📍 {event.location}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
    color: '#880000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardCategory: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
});
