import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../../utils/colors';
import { FAB } from '../../../components/ui/FAB';
import { EmptyState } from '../../../components/ui/EmptyState';
import BottomSheet from '../../../components/ui/BottomSheet';
import { TransactionRow } from '../../../components/debt/TransactionRow';
import { TransactionForm } from '../../../components/debt/TransactionForm';
import { useDebtStore, Transaction } from '../../../store/debtStore';
import { computePersonBalance, computeRunningBalance } from '../../../utils/balanceCalc';
import { formatCurrency } from '../../../utils/formatting';

type FilterType = 'all' | 'give' | 'take';
type SortType = 'date' | 'amount';

export default function PersonLedgerScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const { people, getPersonTransactions, addTransaction, updateTransaction, deleteTransaction } = useDebtStore();

  const person = people.find((p) => p.id === personId);
  const rawTransactions = getPersonTransactions(personId ?? '');

  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const txSheetRef = useRef<BottomSheetLib>(null);

  const { net, youGet, youOwe } = computePersonBalance(rawTransactions);
  const withBalance = computeRunningBalance(rawTransactions);

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = filter === 'all' ? withBalance
      : withBalance.filter((t) => t.type === (filter === 'give' ? 'give' : 'take'));

    result = [...result].sort((a, b) => {
      if (sort === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amount - a.amount;
    });
    return result;
  }, [withBalance, filter, sort]);

  const netPositive = net >= 0;

  const handleTxSubmit = useCallback((data: Omit<Transaction, 'id'>) => {
    if (editingTx) {
      updateTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
    txSheetRef.current?.close();
    setEditingTx(null);
  }, [editingTx, updateTransaction, addTransaction]);

  const renderItem = useCallback(({ item, index }: { item: any, index: number }) => (
    <TransactionRow
      tx={item}
      onPress={() => openEditTx(item)}
      isLast={index === filtered.length - 1}
    />
  ), [filtered.length]);

  if (!person) {
    return (
      <SafeAreaView style={styles.root}>
        <Text style={{ color: Colors.text, padding: 16 }}>Person not found.</Text>
      </SafeAreaView>
    );
  }

  function handleSettle() {
    Alert.alert('Settle Up', `Mark all transactions with ${person!.name} as settled? This will clear the balance.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Settle', style: 'destructive',
        onPress: () => {
          rawTransactions.forEach((t) => deleteTransaction(t.id));
        },
      },
    ]);
  }

  function openAddTx() {
    setEditingTx(null);
    txSheetRef.current?.expand();
  }

  function openEditTx(tx: Transaction) {
    setEditingTx(tx);
    txSheetRef.current?.expand();
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Back + Title */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.personName}>{person.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Balance Hero */}
      <View style={styles.hero}>
        <Text style={styles.netLabel}>
          {net === 0 ? 'All settled up' : netPositive ? 'Owes you' : 'You owe'}
        </Text>
        <Text style={[styles.netAmount, { color: netPositive ? Colors.positive : Colors.negative }]}>
          {net === 0 ? '₹0' : formatCurrency(Math.abs(net))}
        </Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroSub}>↑ {formatCurrency(youGet)} given</Text>
          <Text style={styles.heroDot}>·</Text>
          <Text style={styles.heroSub}>↓ {formatCurrency(youOwe)} received</Text>
        </View>
        {rawTransactions.length > 0 && (
          <TouchableOpacity style={styles.settleBtn} onPress={handleSettle}>
            <Text style={styles.settleBtnText}>Settle Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters + Sort */}
      <View style={styles.controlRow}>
        <View style={styles.filterRow}>
          {(['all', 'give', 'take'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'give' ? 'Given' : 'Taken'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSort(sort === 'date' ? 'amount' : 'date')}
        >
          <MaterialCommunityIcons name="sort" size={16} color={Colors.textSecondary} />
          <Text style={styles.sortText}>{sort === 'date' ? 'Date' : 'Amount'}</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <View style={styles.listCard}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              icon="swap-horizontal"
              title="No transactions"
              subtitle="Tap + to add a give or take."
            />
          }
        />
      </View>

      <FAB onPress={openAddTx} label="Add Transaction" icon="plus" />

      <BottomSheet
        ref={txSheetRef}
        title={editingTx ? 'Edit Transaction' : 'Add Transaction'}
        snapPoints={['70%', '90%']}
      >
        <TransactionForm
          personId={personId ?? ''}
          onSubmit={handleTxSubmit}
          onCancel={() => { txSheetRef.current?.close(); setEditingTx(null); }}
          initial={editingTx ?? undefined}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background, paddingTop: Spacing.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  personName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  netLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  netAmount: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold },
  heroRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  heroSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  heroDot: { fontSize: FontSize.xs, color: Colors.textMuted },
  settleBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  settleBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#fff' },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 4,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: Colors.accent },
  filterText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  sortText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  listCard: {
    flex: 1,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
