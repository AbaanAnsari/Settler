import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '../../utils/colors';

type IconName = keyof typeof MaterialIcons.glyphMap;

interface TabBarIconProps {
  name: IconName;
  nameOutline: IconName;
  label: string;
  focused: boolean;
}

function TabBarIcon({ name, nameOutline, focused }: Omit<TabBarIconProps, 'label'>) {
  return (
    <MaterialIcons
      name={focused ? name : nameOutline}
      size={24}
      color={focused ? Colors.accent : Colors.icon}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.icon,
      }}
    >
      <Tabs.Screen
        name="debt/index"
        options={{
          title: 'Debt',
          tabBarLabel: 'Debt',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="account-balance-wallet" nameOutline="account-balance-wallet" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="event" nameOutline="event" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice-notes/index"
        options={{
          title: 'Voice Notes',
          tabBarLabel: 'Voice',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="mic" nameOutline="mic-none" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="debt/[personId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="events/[eventId]"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 95 : 70,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
});
