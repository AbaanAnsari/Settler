import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatting';
import { computePersonBalance } from '../../utils/balanceCalc';
import type { Person, Transaction } from '../../store/debtStore';

interface PersonCardProps {
  person: Person;
  transactions: Transaction[];
  onPress: () => void;
}

export function PersonCard({ person, transactions, onPress }: PersonCardProps) {
  const { net, youGet, youOwe } = computePersonBalance(transactions);
  const isPositive = net >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Left: Avatar + Name */}
      <View style={[styles.avatar, { backgroundColor: person.color + '28' }]}>
        <Text style={[styles.avatarText, { color: person.color }]}>
          {person.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{person.name}</Text>
        <View style={styles.subRow}>
          {youGet > 0 && (
            <Text style={styles.gets}>↑ {formatCurrency(youGet)}</Text>
          )}
          {youOwe > 0 && (
            <Text style={styles.owes}>↓ {formatCurrency(youOwe)}</Text>
          )}
          {transactions.length === 0 && (
            <Text style={styles.noTx}>No transactions yet</Text>
          )}
        </View>
      </View>

      {/* Right: Net balance */}
      <View style={styles.netWrap}>
        <View style={[styles.netBadge, isPositive ? styles.netPosBg : styles.netNegBg]}>
          <Text style={[styles.netAmount, { color: isPositive ? Colors.positive : Colors.negative }]}>
            {net === 0 ? 'Settled' : (isPositive ? '+' : '-') + formatCurrency(Math.abs(net))}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  subRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gets: {
    fontSize: FontSize.xs,
    color: Colors.positive,
    fontWeight: FontWeight.medium,
  },
  owes: {
    fontSize: FontSize.xs,
    color: Colors.negative,
    fontWeight: FontWeight.medium,
  },
  noTx: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  netWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 2,
  },
  netBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  netPosBg: { backgroundColor: Colors.positiveBg },
  netNegBg: { backgroundColor: Colors.negativeBg },
  netAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  chevron: {
    marginLeft: 2,
  },
});
