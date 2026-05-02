import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setBackgroundColorAsync } from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../utils/colors';
import { useDebtStore } from '../store/debtStore';
import { useEventStore } from '../store/eventStore';
import { useVoiceNoteStore } from '../store/voiceNoteStore';
import { getDb } from '../database/db';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadFromDb: loadDebt, isLoaded: debtLoaded } = useDebtStore();
  const { loadFromDb: loadEvent, isLoaded: eventLoaded } = useEventStore();
  const { loadFromDb: loadVoice, isLoaded: voiceLoaded } = useVoiceNoteStore();

  useEffect(() => {
    async function init() {
      await setBackgroundColorAsync(Colors.background);
      await getDb(); // Initialize DB
      await Promise.all([loadDebt(), loadEvent(), loadVoice()]);
    }
    init();
  }, [loadDebt, loadEvent, loadVoice]);

  useEffect(() => {
    if (debtLoaded && eventLoaded && voiceLoaded) {
      SplashScreen.hideAsync();
    }
  }, [debtLoaded, eventLoaded, voiceLoaded]);

  if (!debtLoaded || !eventLoaded || !voiceLoaded) {
    return null; // Or a loading view
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <BottomSheetModalProvider>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
