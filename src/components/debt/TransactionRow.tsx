import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import { formatCurrency, formatDateShort } from '../../utils/formatting';
import type { TransactionWithBalance } from '../../utils/balanceCalc';

interface TransactionRowProps {
  tx: TransactionWithBalance;
  onPress: () => void;
  isLast?: boolean;
}

export function TransactionRow({ tx, onPress, isLast }: TransactionRowProps) {
  const isGive = tx.type === 'give';
  const balancePositive = tx.runningBalance >= 0;

  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.lastRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Type indicator pill */}
      <View style={[styles.typePill, isGive ? styles.givePill : styles.takePill]}>
        <Text style={[styles.typeText, { color: isGive ? Colors.positive : Colors.negative }]}>
          {isGive ? 'GAVE' : 'GOT'}
        </Text>
      </View>

      {/* Description + Date */}
      <View style={styles.middle}>
        <Text style={styles.description} numberOfLines={1}>{tx.description}</Text>
        <Text style={styles.date}>{formatDateShort(tx.date)}</Text>
      </View>

      {/* Amount + Running Balance */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isGive ? Colors.positive : Colors.negative }]}>
          {isGive ? '+' : '-'}{formatCurrency(tx.amount)}
        </Text>
        <Text style={[styles.balance, { color: balancePositive ? Colors.positive : Colors.negative }]}>
          Bal: {balancePositive ? '' : '-'}{formatCurrency(Math.abs(tx.runningBalance))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    gap: Spacing.sm,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  typePill: {
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 44,
    alignItems: 'center',
  },
  givePill: { backgroundColor: Colors.positiveBg },
  takePill: { backgroundColor: Colors.negativeBg },
  typeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  description: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 3,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  balance: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
