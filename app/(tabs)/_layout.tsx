import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';
import { HapticTab } from '../../components/haptic-tab';
import { COLORS } from '../../styles/colors';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: Platform.OS === 'ios' ? 10 : 5,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Нүүр',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Зээл',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Хэтэвч',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профайл',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

// Tab Bar Icon Component - ЗАСАГДСАН ХУВИЛБАР
function TabBarIcon(props: { name: string; color: string }) {
  const iconMap: { [key: string]: string } = {
    'home': '🏠',
    'home-outline': '🏠',
    'cash': '💰',
    'cash-outline': '💰',
    'wallet': '💳',
    'wallet-outline': '💳',
    'person': '👤',
    'person-outline': '👤',
  };

  return (
    <Text style={{ fontSize: 24 }}>
      {iconMap[props.name] || '?'}
    </Text>
  );
}