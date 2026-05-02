import React, { useRef, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { Colors, Spacing, FontSize, FontWeight } from '../../../utils/colors';
import { FAB } from '../../../components/ui/FAB';
import { EmptyState } from '../../../components/ui/EmptyState';
import BottomSheet from '../../../components/ui/BottomSheet';
import { PersonCard } from '../../../components/debt/PersonCard';
import { PersonForm } from '../../../components/debt/PersonForm';
import { useDebtStore } from '../../../store/debtStore';
import { formatCurrency } from '../../../utils/formatting';
import { computePersonBalance } from '../../../utils/balanceCalc';
import { router } from 'expo-router';

export default function DebtScreen() {
  const { people, transactions, addPerson, getPersonTransactions } = useDebtStore();
  const bottomSheetRef = useRef<BottomSheetLib>(null);

  // Compute overall summary
  const { totalOwed, totalOwing } = useMemo(() => {
    let owed = 0;
    let owing = 0;
    for (const p of people) {
      const { net } = computePersonBalance(getPersonTransactions(p.id));
      if (net > 0) owed += net;
      else owing += Math.abs(net);
    }
    return { totalOwed: owed, totalOwing: owing };
  }, [people, getPersonTransactions]);

  function openAddPerson() {
    bottomSheetRef.current?.expand();
  }

  const handleAddPerson = useCallback((name: string) => {
    addPerson(name);
    bottomSheetRef.current?.close();
  }, [addPerson]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <PersonCard
      person={item}
      transactions={getPersonTransactions(item.id)}
      onPress={() => router.push(`/debt/${item.id}`)}
    />
  ), [getPersonTransactions]);

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Debt</Text>
        <Text style={styles.subtitle}>{people.length} {people.length === 1 ? 'person' : 'people'}</Text>
      </View>

      {/* Summary Row */}
      {people.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.positiveBg }]}>
            <Text style={styles.summaryLabel}>You get</Text>
            <Text style={[styles.summaryAmount, { color: Colors.positive }]}>
              {formatCurrency(totalOwed)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: Colors.negativeBg }]}>
            <Text style={styles.summaryLabel}>You owe</Text>
            <Text style={[styles.summaryAmount, { color: Colors.negative }]}>
              {formatCurrency(totalOwing)}
            </Text>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="account-group-outline"
            title="No people yet"
            subtitle="Tap the + button to add someone you share expenses with."
          />
        }
      />

      <FAB onPress={openAddPerson} label="Add Person" icon="account-plus" />

      <BottomSheet ref={bottomSheetRef} title="Add Person" snapPoints={['45%']}>
        <PersonForm
          onSubmit={handleAddPerson}
          onCancel={() => bottomSheetRef.current?.close()}
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
  summaryLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  summaryAmount: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  list: { paddingTop: Spacing.xs, paddingBottom: 120 },
});
