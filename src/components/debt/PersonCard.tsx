import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Person, Transaction } from '../../store/debtStore';
import { computePersonBalance } from '../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatting';

interface PersonCardProps {
  person: Person;
  transactions: Transaction[];
  onPress: () => void;
  onDeletePress?: () => void;
}

export const PersonCard = memo(function PersonCard({ person, transactions, onPress, onDeletePress }: PersonCardProps) {
  const colors = useThemeColors();
  const { net, youGet, youOwe } = computePersonBalance(transactions);
  const isPositive = net >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.contentArea}
        onPress={onPress}
        activeOpacity={0.75}
      >
      {/* Left: Avatar + Name */}
      <View style={[styles.avatar, { backgroundColor: person.color + '28' }]}>
        <Text style={[styles.avatarText, { color: person.color }]} numberOfLines={1} ellipsizeMode="tail">
          {person.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">
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
      </TouchableOpacity>

      {onDeletePress && (
        <TouchableOpacity style={styles.trashBtn} onPress={onDeletePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Delete person">
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
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
  netBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    minWidth: 56,
    flexShrink: 0,
  },
  netAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  trashBtn: {
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
