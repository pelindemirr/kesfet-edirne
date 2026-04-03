import { Stack } from 'expo-router';
import React from 'react';

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="explore" options={{ headerShown: false }} />
    </Stack>
  );
}
