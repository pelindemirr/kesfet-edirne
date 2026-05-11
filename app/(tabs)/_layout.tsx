import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const mapIcon = require('../../assets/icon/map.png');
const eventsIcon = require('../../assets/icon/events.png');
const edit = require('../../assets/icon/edit.png');

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 4 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarLabel: 'Anasayfa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="community-route-detail/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="route-detail/index"
        options={{
          href: null,
        }}
      />
    
      <Tabs.Screen
        name="rota/index"
        options={{
          title: 'Rota',
          tabBarLabel: 'Rota',
          tabBarIcon: ({ color }) => (
            <Image source={mapIcon} style={{ width: 22, height: 22, tintColor: color }} resizeMode="contain" />
          ),
        }}
      />
       <Tabs.Screen
        name="events/index"
        options={{
          title: 'Etkinlikler',
          tabBarLabel: 'Etkinlikler',
          tabBarIcon: ({ color }) => (
            <Image source={eventsIcon} style={{ width: 22, height: 22, tintColor: color }} resizeMode="contain" />
          ),
        }}
      />
      <Tabs.Screen
        name="menu/index"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Image source={edit} style={{ width: 22, height: 22, tintColor: color }} resizeMode="contain" />
          ),
        }}
      />
     
    </Tabs>
  );
}
