import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import { formatCurrency, formatDateShort } from '../../utils/formatting';
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

export function ExpenseRow({ expense, onPress, isLast }: ExpenseRowProps) {
  const color = getAvatarColor(expense.personName);
  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.lastRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: color + '28' }]}>
        <Text style={[styles.avatarText, { color }]}>
          {expense.personName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.person}>{expense.personName}</Text>
        <Text style={styles.reason} numberOfLines={1}>{expense.reason}</Text>
        <Text style={styles.date}>{formatDateShort(expense.date)}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
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
  person: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  reason: { fontSize: FontSize.xs, color: Colors.textSecondary },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
  amount: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
});
