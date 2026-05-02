import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDateShort } from '../../utils/formatting';
import type { TransactionWithBalance } from '../../utils/balanceCalc';

interface TransactionRowProps {
  tx: TransactionWithBalance;
  onPress: () => void;
  isLast?: boolean;
}

export const TransactionRow = memo(function TransactionRow({ tx, onPress, isLast }: TransactionRowProps) {
  const colors = useThemeColors();
  const isGive = tx.type === 'give';
  const balancePositive = tx.runningBalance >= 0;

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.separator }, isLast && styles.lastRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Type indicator pill */}
      <View style={[styles.typePill, { backgroundColor: isGive ? colors.positiveBg : colors.negativeBg }]}>
        <Text style={[styles.typeText, { color: isGive ? colors.positive : colors.negative }]}>
          {isGive ? 'GAVE' : 'GOT'}
        </Text>
      </View>

      {/* Description + Date */}
      <View style={styles.middle}>
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>{tx.description}</Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formatDateShort(tx.date)}</Text>
      </View>

      {/* Amount + Running Balance */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isGive ? colors.positive : colors.negative }]}>
          {isGive ? '+' : '-'}{formatCurrency(tx.amount)}
        </Text>
        <Text style={[styles.balance, { color: balancePositive ? colors.positive : colors.negative }]}>
          Bal: {balancePositive ? '' : '-'}{formatCurrency(Math.abs(tx.runningBalance))}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
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
  },
  date: {
    fontSize: FontSize.xs,
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
