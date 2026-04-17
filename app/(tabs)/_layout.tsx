import { Tabs } from 'expo-router';
import React from 'react';
import { TodayIcon, HistoryIcon } from 'lucide-react-native';

import { COLORS } from '@/src/constants/AppTheme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
            height: 60,
            paddingBottom: 8,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <DropletsIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <HistoryIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

// Simple wrapper for icons to avoid import issues in this step
const DropletsIcon = ({ color, size }: { color: string, size: number }) => {
    const { Droplets } = require('lucide-react-native');
    return <Droplets color={color} size={size} />;
};
const HistoryIcon = ({ color, size }: { color: string, size: number }) => {
    const { History } = require('lucide-react-native');
    return <History color={color} size={size} />;
};
