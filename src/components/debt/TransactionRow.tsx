import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TransactionWithBalance } from '../../utils/balanceCalc';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDateShort } from '../../utils/formatting';

interface TransactionRowProps {
  tx: TransactionWithBalance;
  onPress: () => void;
  onDeletePress?: () => void;
  isLast?: boolean;
}

export const TransactionRow = memo(function TransactionRow({
  tx,
  onPress,
  onDeletePress,
  isLast,
}: TransactionRowProps) {
  const colors = useThemeColors();
  const isGive = tx.type === 'give';
  const balancePositive = tx.runningBalance >= 0;

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.separator },
        isLast && styles.lastRow,
      ]}
    >
      <TouchableOpacity
        style={styles.contentArea}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Type indicator pill */}
        <View
          style={[
            styles.typePill,
            { backgroundColor: isGive ? colors.positiveBg : colors.negativeBg },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              { color: isGive ? colors.positive : colors.negative },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isGive ? 'GAVE' : 'GOT'}
          </Text>
        </View>

        {/* Description + Date */}
        <View style={styles.middle}>
          <Text
            style={[styles.description, { color: colors.text }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {tx.description}
          </Text>
          <Text
            style={[styles.date, { color: colors.textMuted }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatDateShort(tx.date)}
          </Text>
        </View>

        {/* Amount + Running Balance */}
        <View style={styles.right}>
          <Text
            style={[
              styles.amount,
              { color: isGive ? colors.positive : colors.negative },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {isGive ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </Text>
          <Text
            style={[
              styles.balance,
              { color: balancePositive ? colors.positive : colors.negative },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Bal: {balancePositive ? '' : '-'}
            {formatCurrency(Math.abs(tx.runningBalance))}
          </Text>
        </View>
      </TouchableOpacity>

      {onDeletePress && (
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={onDeletePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Delete transaction"
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },

  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  typePill: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 3,
    minWidth: 44,
    alignItems: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },

  typeText: {
    fontSize: FontSize.xs,
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
    minWidth: 70,
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

  trashBtn: {
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
