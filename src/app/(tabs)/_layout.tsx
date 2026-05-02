import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize, FontWeight, useThemeColors } from '../../utils/colors';

type IconName = keyof typeof MaterialIcons.glyphMap;

interface TabBarIconProps {
  name: IconName;
  nameOutline: IconName;
  label: string;
  focused: boolean;
  color: string;
}

function TabBarIcon({ name, nameOutline, focused, color }: Omit<TabBarIconProps, 'label'>) {
  return (
    <MaterialIcons
      name={focused ? name : nameOutline}
      size={24}
      color={color}
    />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            height: 58 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.icon,
      }}
    >
      <Tabs.Screen
        name="debt/index"
        options={{
          title: 'Debt',
          tabBarLabel: 'Debt',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="account-balance-wallet" nameOutline="account-balance-wallet" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="event" nameOutline="event" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice-notes/index"
        options={{
          title: 'Voice Notes',
          tabBarLabel: 'Voice',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="mic" nameOutline="mic" focused={focused} color={color} />
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
    borderTopWidth: 1,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
});
