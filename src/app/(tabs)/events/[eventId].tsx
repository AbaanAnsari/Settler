import React, { useRef, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  SectionList, TouchableOpacity, ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../../utils/colors';
import { FAB } from '../../../components/ui/FAB';
import { EmptyState } from '../../../components/ui/EmptyState';
import BottomSheet from '../../../components/ui/BottomSheet';
import { ExpenseRow } from '../../../components/events/ExpenseRow';
import { ExpenseForm } from '../../../components/events/ExpenseForm';
import { SummaryCard } from '../../../components/events/SummaryCard';
import { useEventStore, Expense } from '../../../store/eventStore';
import { computeEventSummary } from '../../../utils/balanceCalc';
import { formatDate, formatCurrency } from '../../../utils/formatting';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { events, addExpense, updateExpense, deleteExpense, getEventExpenses } = useEventStore();

  const event = events.find((e) => e.id === eventId);
  const expenses = getEventExpenses(eventId ?? '');
  const { total, participants, perPerson } = computeEventSummary(expenses);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const sheetRef = useRef<BottomSheetLib>(null);

  if (!event) {
    return (
      <SafeAreaView style={styles.root}>
        <Text style={{ color: Colors.text, padding: 16 }}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function openAddExpense() {
    setEditingExpense(null);
    sheetRef.current?.expand();
  }

  function openEditExpense(expense: Expense) {
    setEditingExpense(expense);
    sheetRef.current?.expand();
  }

  function handleSubmit(data: Omit<Expense, 'id'>) {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    sheetRef.current?.close();
    setEditingExpense(null);
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
          <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(total)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{participants.length}</Text>
            <Text style={styles.statLabel}>People</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(participants.length > 0 ? total / participants.length : 0)}</Text>
            <Text style={styles.statLabel}>Per person</Text>
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
          <Text style={styles.sectionTitle}>Expense Entries</Text>
          <View style={styles.ledgerCard}>
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

        <View style={{ height: 120 }} />
      </ScrollView>

      <FAB onPress={openAddExpense} label="Add Expense" icon="plus" />

      <BottomSheet
        ref={sheetRef}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        snapPoints={['75%', '95%']}
      >
        <ExpenseForm
          eventId={eventId ?? ''}
          suggestedNames={participants}
          onSubmit={handleSubmit}
          onCancel={() => { sheetRef.current?.close(); setEditingExpense(null); }}
          initial={editingExpense ?? undefined}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  topBarCenter: { flex: 1, alignItems: 'center' },
  eventName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  eventDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  scrollContent: { paddingBottom: Spacing.xl },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 4,
  },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  section: { marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  ledgerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
});
