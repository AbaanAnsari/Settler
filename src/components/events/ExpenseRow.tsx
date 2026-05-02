import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDate } from '../../utils/formatting';
import type { Expense } from '../../store/eventStore';

interface ExpenseRowProps {
  expense: Expense;
  onPress: () => void;
  isLast?: boolean;
}

const AVATAR_COLORS = ['#7C6FF7', '#F87171', '#34D399', '#FBBF24', '#60A5FA', '#F472B6'];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const ExpenseRow = memo(function ExpenseRow({ expense, onPress, isLast }: ExpenseRowProps) {
  const colors = useThemeColors();
  const color = getAvatarColor(expense.personName);
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.separator }, isLast && styles.lastRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: color + '28' }]}>
        <Text style={[styles.avatarText, { color }]}>
          {expense.personName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.person, { color: colors.text }]}>{expense.personName}</Text>
        <Text style={[styles.reason, { color: colors.textSecondary }]} numberOfLines={1}>{expense.reason}</Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formatDate(expense.date)}</Text>
      </View>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(expense.amount)}</Text>
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
  lastRow: { borderBottomWidth: 0 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  info: { flex: 1, gap: 3 },
  person: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  reason: { fontSize: FontSize.xs },
  date: { fontSize: FontSize.xs },
  amount: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
