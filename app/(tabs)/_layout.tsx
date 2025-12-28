import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
           
        }}
      />
      <Stack.Screen
        name="add-habit"
        options={{
          title: 'Add Habit',
        }}
      />
    </Stack>
  );
}
