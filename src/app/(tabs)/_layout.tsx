import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '../../utils/colors';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TabBarIconProps {
  name: IconName;
  nameOutline: IconName;
  label: string;
  focused: boolean;
}

function TabBarItem({ name, nameOutline, label, focused }: TabBarIconProps) {
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons
        name={focused ? name : nameOutline}
        size={24}
        color={focused ? Colors.accent : Colors.icon}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? Colors.accent : Colors.icon },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="debt"
        options={{
          title: 'Debt',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              name="account-cash"
              nameOutline="account-cash-outline"
              label="Debt"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              name="calendar-star"
              nameOutline="calendar-star-outline"
              label="Events"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="voice-notes"
        options={{
          title: 'Voice Notes',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              name="microphone"
              nameOutline="microphone-outline"
              label="Voice"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
});
