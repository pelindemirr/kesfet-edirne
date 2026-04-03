import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
        name="community"
        options={{
          title: 'Topluluk',
          tabBarLabel: 'Topluluk',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menü',
          tabBarLabel: 'Menü',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="line.3.horizontal" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rota"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
