import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { TransactionForm } from '../../components/debt/TransactionForm';
import { TransactionRow } from '../../components/debt/TransactionRow';
import BottomSheet from '../../components/ui/BottomSheet';
import { EmptyState } from '../../components/ui/EmptyState';
import { FAB } from '../../components/ui/FAB';
import { Transaction, useDebtStore } from '../../store/debtStore';
import { selectPersonTransactions } from '../../store/selectors';
import { computePersonBalance, computeRunningBalance, TransactionWithBalance } from '../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatting';

type FilterType = 'all' | 'give' | 'take';
type SortType = 'date' | 'amount';

export default function PersonLedgerScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const people = useDebtStore((state) => state.people);
  const addTransaction = useDebtStore((state) => state.addTransaction);
  const updateTransaction = useDebtStore((state) => state.updateTransaction);
  const deleteTransaction = useDebtStore((state) => state.deleteTransaction);

  const person = people.find((p) => p.id === personId);

  // ✅ safer selector usage
  const rawTransactions = useDebtStore(
    useShallow((state) => selectPersonTransactions(personId ?? '')(state))
  );

  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const txSheetRef = useRef<BottomSheetLib>(null);

  const { net, youGet, youOwe } = computePersonBalance(rawTransactions);
  const withBalance = useMemo(() => computeRunningBalance(rawTransactions), [rawTransactions]);

  const filtered = useMemo(() => {
    let result = filter === 'all'
      ? withBalance
      : withBalance.filter((t) => t.type === filter);

    result = [...result].sort((a, b) => {
      if (sort === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amount - a.amount;
    });

    return result;
  }, [withBalance, filter, sort]);

  const netPositive = net >= 0;
  const personName = person?.name ?? 'this person';

  const handleTxSubmit = useCallback((data: Omit<Transaction, 'id'>) => {
    if (editingTx) {
      updateTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
    txSheetRef.current?.close();
    setEditingTx(null);
  }, [editingTx, updateTransaction, addTransaction]);

  const handleSettle = useCallback(() => {
    if (!person) return;
    Alert.alert(
      'Settle Up',
      `Mark all transactions with ${personName} as settled?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          style: 'destructive',
          onPress: () => rawTransactions.forEach((t) => deleteTransaction(t.id)),
        },
      ]
    );
  }, [deleteTransaction, person, personName, rawTransactions]);

  const openAddTx = useCallback(() => {
    setEditingTx(null);
    setFormKey((prev) => prev + 1);
    setIsSheetOpen(true);
    txSheetRef.current?.expand();
  }, []);

  const openEditTx = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setFormKey((prev) => prev + 1);
    setIsSheetOpen(true);
    txSheetRef.current?.expand();
  }, []);

  const confirmDeleteTransaction = useCallback((tx: Transaction) => {
    Alert.alert(
      'Delete',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { void deleteTransaction(tx.id); } },
      ]
    );
  }, [deleteTransaction]);

  const renderItem = useCallback(({ item, index }: { item: TransactionWithBalance; index: number }) => (
    <TransactionRow
      tx={item}
      onPress={() => openEditTx(item)}
      onDeletePress={() => confirmDeleteTransaction(item)}
      isLast={index === filtered.length - 1}
    />
  ), [filtered.length, openEditTx, confirmDeleteTransaction]);

  if (!person) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.personName, { color: colors.text }]}>Person not found</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.personName, { color: colors.text, flex: 1, minWidth: 0, textAlign: 'center' }]} numberOfLines={2} ellipsizeMode="tail">
          {person.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text
          style={[styles.netLabel, { color: colors.textSecondary, textAlign: 'center' }]}
        >
          {net === 0 ? 'All settled up' : netPositive ? 'Owes you' : 'You owe'}
        </Text>
        <Text
          style={[styles.netAmount, { color: netPositive ? colors.positive : colors.negative }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {net === 0 ? '₹0' : formatCurrency(Math.abs(net))}
        </Text>
        <View style={styles.heroRow}>
          <View style={[styles.heroStat, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.heroStatLabel, { color: colors.textSecondary, textAlign: 'center' }]}
            >
              You get
            </Text>
            <Text
              style={[styles.heroStatValue, { color: colors.positive }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {formatCurrency(youGet)}
            </Text>
          </View>
          <View style={[styles.heroStat, styles.heroStatSecond, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.heroStatLabel, { color: colors.textSecondary, textAlign: 'center' }]}
            >
              You owe
            </Text>
            <Text
              style={[styles.heroStatValue, { color: colors.negative }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {formatCurrency(youOwe)}
            </Text>
          </View>
        </View>

        {rawTransactions.length > 0 && (
          <TouchableOpacity style={[styles.settleBtn, { backgroundColor: colors.accent }]} onPress={handleSettle}>
            <Text style={styles.settleBtnText}>Settle Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.controlRow}>
        <View style={[styles.filterRow, { backgroundColor: colors.surface }]}>
          {(['all', 'give', 'take'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive, filter === f && { backgroundColor: colors.accent }]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[styles.filterText, { color: colors.textSecondary }, filter === f && styles.filterTextActive]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {f === 'all' ? 'All' : f === 'give' ? 'Given' : 'Taken'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sortRow}>
          {(['date', 'amount'] as SortType[]).map((s, idx) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sortChip,
                idx === 0 && { marginRight: Spacing.sm },
                { borderColor: colors.surfaceBorder },
                sort === s && { backgroundColor: colors.surfaceElevated, borderColor: colors.accentDark },
              ]}
              onPress={() => setSort(s)}
            >
              <Text
                style={[styles.sortText, { color: colors.textSecondary }, sort === s && { color: colors.accentLight }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {s === 'date' ? 'Recent first' : 'Amount high'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 150,
          }}
          ListEmptyComponent={
            <EmptyState
              icon="swap-horizontal"
              title="No transactions"
              subtitle="Tap + to add one"
            />
          }
        />
      </View>

      {!isSheetOpen && (
        <FAB
          onPress={openAddTx}
          label="Add"
          icon="plus"
        />
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={txSheetRef}
        title={editingTx ? 'Edit Transaction' : 'Add Transaction'}
        snapPoints={['82%', '96%']}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingTx(null);
        }}
      >
        <TransactionForm
          key={formKey}
          personId={personId ?? ''}
          onSubmit={handleTxSubmit}
          onCancel={() => {
            txSheetRef.current?.close();
          }}
          initial={editingTx ?? undefined}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  personName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  netLabel: {
    fontSize: FontSize.sm,
  },
  netAmount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
  },
  heroRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.md,
  },
  heroStat: {
    flex: 1,
    minWidth: 72,
    flexShrink: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  heroStatSecond: {
    marginLeft: Spacing.sm,
  },
  heroStatLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  heroStatValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  heroSub: {
    fontSize: FontSize.xs,
  },
  settleBtn: {
    marginTop: Spacing.lg,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  settleBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
  },
  sortRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  filterChip: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingVertical: 6,
  },
  filterChipActive: {
    borderRadius: Radius.sm,
  },
  filterText: {
    fontSize: FontSize.xs,
  },
  filterTextActive: {
    color: '#fff',
  },
  sortChip: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingVertical: 7,
  },
  sortText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  listCard: {
    flex: 1,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
