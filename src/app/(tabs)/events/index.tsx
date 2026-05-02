import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { Colors, Spacing, FontSize, FontWeight } from '../../../utils/colors';
import { FAB } from '../../../components/ui/FAB';
import { EmptyState } from '../../../components/ui/EmptyState';
import BottomSheet from '../../../components/ui/BottomSheet';
import { EventCard } from '../../../components/events/EventCard';
import { EventForm } from '../../../components/events/EventForm';
import { useEventStore } from '../../../store/eventStore';
import { computeEventSummary } from '../../../utils/balanceCalc';
import { router } from 'expo-router';

export default function EventsScreen() {
  const { events, addEvent, getEventSummary } = useEventStore();
  const sheetRef = useRef<BottomSheetLib>(null);

  // Sort events newest first, stable
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return dateDiff !== 0 ? dateDiff : a.id.localeCompare(b.id);
    });
  }, [events]);

  const handleAddEvent = useCallback((data: { name: string; date: string }) => {
    addEvent(data);
    sheetRef.current?.close();
  }, [addEvent]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const { total, participants } = getEventSummary(item.id);
    return (
      <EventCard
        event={item}
        total={total}
        participantCount={participants.length}
        onPress={() => router.push(`/events/${item.id}`)}
      />
    );
  }, [getEventSummary]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>{events.length} {events.length === 1 ? 'event' : 'events'}</Text>
      </View>

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-plus"
            title="No events yet"
            subtitle="Create an event to track group expenses and split them automatically."
          />
        }
      />

      <FAB onPress={() => sheetRef.current?.expand()} label="New Event" icon="calendar-plus" />

      <BottomSheet ref={sheetRef} title="Create Event" snapPoints={['48%']}>
        <EventForm
          onSubmit={handleAddEvent}
          onCancel={() => sheetRef.current?.close()}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background, paddingTop: Spacing.md },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted },
  list: { paddingTop: Spacing.xs, paddingBottom: 120 },
});
