import { Stack } from 'expo-router';
import React from 'react';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="my-routes/index" />
      <Stack.Screen name="profile-settings/index" />
    </Stack>
  );
}
