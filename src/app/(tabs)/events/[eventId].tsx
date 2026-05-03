import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { ExpenseForm } from '../../../components/events/ExpenseForm';
import { ExpenseRow } from '../../../components/events/ExpenseRow';
import { SummaryCard } from '../../../components/events/SummaryCard';
import BottomSheet from '../../../components/ui/BottomSheet';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { Expense, useEventStore } from '../../../store/eventStore';
import { selectEventExpenses } from '../../../store/selectors';
import { computeEventSummary } from '../../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../../utils/colors';
import { formatCurrency, formatDate } from '../../../utils/formatting';

export default function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const events = useEventStore((state) => state.events);
  const addExpense = useEventStore((state) => state.addExpense);
  const updateExpense = useEventStore((state) => state.updateExpense);

  const event = events.find((e) => e.id === eventId);
  const expenses = useEventStore(useShallow(selectEventExpenses(eventId ?? '')));
  const { total, participants, perPerson } = useMemo(() => computeEventSummary(expenses), [expenses]);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetRef = useRef<BottomSheetLib>(null);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return dateDiff !== 0 ? dateDiff : a.id.localeCompare(b.id);
    });
  }, [expenses]);

  const handleSubmit = useCallback((data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    sheetRef.current?.close();
    setEditingExpense(null);
  }, [editingExpense, updateExpense, addExpense]);

  if (!event) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <Text style={{ color: colors.text, padding: 16 }}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  function openAddExpense() {
    setEditingExpense(null);
    setFormKey(prev => prev + 1);
    setIsSheetOpen(true);
    sheetRef.current?.expand();
  }

  function openEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setFormKey(prev => prev + 1);
    setIsSheetOpen(true);
    sheetRef.current?.expand();
  }

  React.useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={[styles.eventName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            {event.name}
          </Text>
          <Text style={[styles.eventDate, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
            {formatDate(event.date)}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardFirst, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.statValue, { color: colors.text }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.8}
            >
              {formatCurrency(total)}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.textMuted }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.85}
            >
              Total
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.statValue, { color: colors.text }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.8}
            >
              {participants.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.textMuted }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.85}
            >
              People
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.statValue, { color: colors.text }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.75}
            >
              {formatCurrency(participants.length > 0 ? total / participants.length : 0)}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.textMuted }]}
              adjustsFontSizeToFit
              numberOfLines={1}
              ellipsizeMode="tail"
              minimumFontScale={0.85}
            >
              Per person
            </Text>
          </View>
        </View>

        {/* Summary */}
        {perPerson.length > 0 && (
          <View style={styles.section}>
            <SummaryCard summaries={perPerson} total={total} />
          </View>
        )}

        {/* Expense Ledger */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            Expense Entries
          </Text>
          <View style={[styles.ledgerCard, { backgroundColor: colors.surface }]}>
            {sortedExpenses.length === 0 ? (
              <EmptyState
                icon="receipt"
                title="No expenses yet"
                subtitle="Tap + to log who paid what."
              />
            ) : (
              sortedExpenses.map((expense, index) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onPress={() => openEditExpense(expense)}
                  isLast={index === sortedExpenses.length - 1}
                />
              ))
            )}
          </View>
        </View>

        <View style={{ height: insets.bottom + 150 }} />
      </ScrollView>

      {!isSheetOpen && (
        <FAB onPress={openAddExpense} label="Add Expense" icon="plus" />
      )}

      <BottomSheet
        ref={sheetRef}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        snapPoints={['86%', '96%']}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingExpense(null);
        }}
      >
        <ExpenseForm
          key={formKey}
          eventId={eventId ?? ''}
          suggestedNames={participants}
          onSubmit={handleSubmit}
          onCancel={() => { sheetRef.current?.close(); }}
          initial={editingExpense ?? undefined}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: Spacing.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  topBarCenter: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: Spacing.xs },
  eventName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  eventDate: { fontSize: FontSize.xs, marginTop: 2 },
  scrollContent: { paddingBottom: Spacing.xl },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardFirst: {
    marginRight: Spacing.sm,
  },
  statCardMid: {
    marginRight: Spacing.sm,
  },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 4, textAlign: 'center' },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  section: { marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  ledgerCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
