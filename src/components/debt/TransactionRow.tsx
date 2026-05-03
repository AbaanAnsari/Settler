import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TransactionWithBalance } from '../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDateShort } from '../../utils/formatting';

interface TransactionRowProps {
  tx: TransactionWithBalance;
  onPress: () => void;
  onLongPress?: () => void;
  isLast?: boolean;
}

export const TransactionRow = memo(function TransactionRow({ tx, onPress, onLongPress, isLast }: TransactionRowProps) {
  const colors = useThemeColors();
  const isGive = tx.type === 'give';
  const balancePositive = tx.runningBalance >= 0;

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.separator }, isLast && styles.lastRow]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      activeOpacity={0.7}
    >
      {/* Type indicator pill */}
      <View style={[styles.typePill, { backgroundColor: isGive ? colors.positiveBg : colors.negativeBg }]}>
        <Text
          style={[styles.typeText, { color: isGive ? colors.positive : colors.negative }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {isGive ? 'GAVE' : 'GOT'}
        </Text>
      </View>

      {/* Description + Date */}
      <View style={styles.middle}>
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {tx.description}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
          {formatDateShort(tx.date)}
        </Text>
      </View>

      {/* Amount + Running Balance */}
      <View style={styles.right}>
        <Text
          style={[styles.amount, { color: isGive ? colors.positive : colors.negative }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {isGive ? '+' : '-'}{formatCurrency(tx.amount)}
        </Text>
        <Text
          style={[styles.balance, { color: balancePositive ? colors.positive : colors.negative }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
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
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  typeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  middle: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    marginRight: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: 3,
  },
  date: {
    fontSize: FontSize.xs,
  },
  right: {
    alignItems: 'flex-end',
    flexShrink: 0,
    minWidth: 72,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 3,
  },
  balance: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
