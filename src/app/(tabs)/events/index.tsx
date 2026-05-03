import BottomSheetLib from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventCard } from '../../../components/events/EventCard';
import { EventForm } from '../../../components/events/EventForm';
import BottomSheet from '../../../components/ui/BottomSheet';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { type Event, useEventStore } from '../../../store/eventStore';
import { computeEventSummary } from '../../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../../utils/colors';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const events = useEventStore((state) => state.events);
  const expenses = useEventStore((state) => state.expenses);
  const addEvent = useEventStore((state) => state.addEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const sheetRef = useRef<BottomSheetLib>(null);
  const [formKey, setFormKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const confirmDeleteEvent = useCallback((ev: Event) => {
    Alert.alert(
      'Delete',
      `Delete "${ev.name}"? All expenses for this event will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { void deleteEvent(ev.id); } },
      ]
    );
  }, [deleteEvent]);

  const renderItem = useCallback(({ item }: { item: Event }) => {
    const itemExpenses = expenses.filter((e) => e.eventId === item.id);
    const { total, participants } = computeEventSummary(itemExpenses);
    return (
      <EventCard
        event={item}
        total={total}
        participantCount={participants.length}
        onPress={() => router.push({ pathname: '/events/[eventId]', params: { eventId: item.id } })}
        onDeletePress={() => confirmDeleteEvent(item)}
      />
    );
  }, [expenses, confirmDeleteEvent]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            Events
          </Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.countText, { color: colors.text }]} numberOfLines={1}>
              {events.length}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 150 }]}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-plus"
            title="No events yet"
            subtitle="Create an event to track group expenses and split them automatically."
          />
        }
      />

      {!isSheetOpen && (
        <FAB onPress={() => {
          setFormKey(prev => prev + 1);
          setIsSheetOpen(true);
          sheetRef.current?.expand();
        }} label="New Event" icon="calendar-plus" />
      )}

      <BottomSheet
        ref={sheetRef}
        title="Create Event"
        snapPoints={['62%', '90%']}
        onClose={() => setIsSheetOpen(false)}
      >
        <EventForm
          key={formKey}
          onSubmit={handleAddEvent}
          onCancel={() => sheetRef.current?.close()}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: Spacing.md },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  subtitle: { fontSize: FontSize.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  countBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  countText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  list: { paddingTop: Spacing.xs },
});
