import BottomSheetLib from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList, StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonCard } from '../../../components/debt/PersonCard';
import { PersonForm } from '../../../components/debt/PersonForm';
import BottomSheet from '../../../components/ui/BottomSheet';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { useDebtStore } from '../../../store/debtStore';
import { computePersonBalance } from '../../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../../utils/colors';
import { formatCurrency } from '../../../utils/formatting';

export default function DebtScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const people = useDebtStore((state) => state.people);
  const transactions = useDebtStore((state) => state.transactions);
  const addPerson = useDebtStore((state) => state.addPerson);
  const bottomSheetRef = useRef<BottomSheetLib>(null);
  const [formKey, setFormKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Compute overall summary
  const { totalOwed, totalOwing } = useMemo(() => {
    let owed = 0;
    let owing = 0;
    for (const p of people) {
      const pTxs = transactions.filter(t => t.personId === p.id);
      const { net } = computePersonBalance(pTxs);
      if (net > 0) owed += net;
      else owing += Math.abs(net);
    }
    return { totalOwed: owed, totalOwing: owing };
  }, [people, transactions]);

  function openAddPerson() {
    setFormKey(prev => prev + 1);
    setIsSheetOpen(true);
    bottomSheetRef.current?.expand();
  }

  const handleAddPerson = useCallback((name: string) => {
    addPerson(name);
    bottomSheetRef.current?.close();
  }, [addPerson]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <PersonCard
      person={item}
      transactions={transactions.filter((t) => t.personId === item.id)}
      onPress={() => router.push(`/debt/${item.id}`)}
    />
  ), [transactions]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Debt</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.countText, { color: colors.text }]}>{people.length}</Text>
          </View>
        </View>
      </View>

      {/* Summary Row */}
      {people.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.positiveBg }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>You get</Text>
            <Text style={[styles.summaryAmount, { color: colors.positive }]}>
              {formatCurrency(totalOwed)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.negativeBg }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>You owe</Text>
            <Text style={[styles.summaryAmount, { color: colors.negative }]}>
              {formatCurrency(totalOwing)}
            </Text>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 150 }]}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="No people yet"
            subtitle="Tap the + button to add someone you share expenses with."
          />
        }
      />

      {!isSheetOpen && (
        <FAB onPress={openAddPerson} label="Add Person" icon="account-plus" />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        title="Add Person"
        snapPoints={['58%', '90%']}
        onClose={() => setIsSheetOpen(false)}
      >
        <PersonForm
          key={formKey}
          onSubmit={handleAddPerson}
          onCancel={() => bottomSheetRef.current?.close()}
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
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  subtitle: { fontSize: FontSize.sm },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: 4,
  },
  summaryLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  summaryAmount: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  countText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  list: { paddingTop: Spacing.xs },
});
