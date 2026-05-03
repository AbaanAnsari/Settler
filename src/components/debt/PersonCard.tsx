import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatting';
import { computePersonBalance } from '../../utils/balanceCalc';
import type { Person, Transaction } from '../../store/debtStore';

interface PersonCardProps {
  person: Person;
  transactions: Transaction[];
  onPress: () => void;
  onLongPress?: () => void;
}

export const PersonCard = memo(function PersonCard({ person, transactions, onPress, onLongPress }: PersonCardProps) {
  const colors = useThemeColors();
  const { net, youGet, youOwe } = computePersonBalance(transactions);
  const isPositive = net >= 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      activeOpacity={0.75}
    >
      {/* Left: Avatar + Name */}
      <View style={[styles.avatar, { backgroundColor: person.color + '28' }]}>
        <Text style={[styles.avatarText, { color: person.color }]} numberOfLines={1} ellipsizeMode="tail">
          {person.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {person.name}
        </Text>
        <View style={styles.subRow}>
          {youGet > 0 && (
            <Text
              style={[styles.gets, styles.subRowItem, { color: colors.positive }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.9}
            >
              ↑ {formatCurrency(youGet)}
            </Text>
          )}
          {youOwe > 0 && (
            <Text
              style={[styles.owes, styles.subRowItem, { color: colors.negative }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.9}
            >
              ↓ {formatCurrency(youOwe)}
            </Text>
          )}
          {transactions.length === 0 && (
            <Text style={[styles.noTx, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
              No transactions yet
            </Text>
          )}
        </View>
      </View>

      {/* Right: Net balance */}
      <View style={styles.netWrap}>
        <View style={[styles.netBadge, { backgroundColor: isPositive ? colors.positiveBg : colors.negativeBg }]}>
          <Text
            style={[styles.netAmount, { color: isPositive ? colors.positive : colors.negative }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {net === 0 ? 'Settled' : (isPositive ? '+' : '-') + formatCurrency(Math.abs(net))}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  info: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    marginRight: Spacing.sm,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subRowItem: {
    marginRight: Spacing.sm,
  },
  gets: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  owes: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  noTx: {
    fontSize: FontSize.xs,
  },
  netWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
  },
  netBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    maxWidth: 120,
    minWidth: 56,
  },
  netAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  chevron: {
    marginLeft: 4,
  },
});
