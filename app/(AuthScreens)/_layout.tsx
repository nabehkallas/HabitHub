import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0D47A1',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'LogIn',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.right.to.line" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SignUpScreen"
        options={{
          title: 'SignUp',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill.badge.plus" color={color} />,
        }}
      />
    </Tabs>
  );
}
