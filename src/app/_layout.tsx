import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDb } from '../database/db';
import { useDebtStore } from '../store/debtStore';
import { useEventStore } from '../store/eventStore';
import { useVoiceNoteStore } from '../store/voiceNoteStore';
import { useThemeColors, useThemeName } from '../utils/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colors = useThemeColors();
  const themeName = useThemeName();
  const loadDebt = useDebtStore((s) => s.loadFromDb);
  const debtLoaded = useDebtStore((s) => s.isLoaded);

  const loadEvent = useEventStore((s) => s.loadFromDb);
  const eventLoaded = useEventStore((s) => s.isLoaded);

  const loadVoice = useVoiceNoteStore((s) => s.loadFromDb);
  const voiceLoaded = useVoiceNoteStore((s) => s.isLoaded);

  useEffect(() => {
    async function init() {
      try {
        await getDb();
        await Promise.all([loadDebt(), loadEvent(), loadVoice()]);
      } catch (e) {
        console.error('Init error:', e);
      }
    }
    init();
  }, [loadDebt, loadEvent, loadVoice]);

  useEffect(() => {
    setBackgroundColorAsync(colors.background).catch((e) => {
      console.error('Failed to update system background:', e);
    });
  }, [colors.background]);

  useEffect(() => {
    async function hide() {
      if (debtLoaded && eventLoaded && voiceLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hide();
  }, [debtLoaded, eventLoaded, voiceLoaded]);

  if (!debtLoaded || !eventLoaded || !voiceLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style={themeName === 'light' ? 'dark' : 'light'} translucent backgroundColor="transparent" />
          <Stack screenOptions={{ headerShown: false }} />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
