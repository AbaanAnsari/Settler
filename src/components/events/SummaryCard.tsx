import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatting';
import type { PersonEventSummary } from '../../utils/balanceCalc';

interface SummaryCardProps {
  summaries: PersonEventSummary[];
  total: number;
}

const AVATAR_COLORS = ['#7C6FF7', '#F87171', '#34D399', '#FBBF24', '#60A5FA', '#F472B6'];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const SummaryCard = memo(function SummaryCard({ summaries, total }: SummaryCardProps) {
  const colors = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          Balance Summary
        </Text>
        <View style={styles.totalBadge}>
          <Text
            style={[styles.totalText, { color: colors.accentLight }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Total {formatCurrency(total)}
          </Text>
        </View>
      </View>

      {summaries.map((s) => {
        const color = getAvatarColor(s.personName);
        const isPositive = s.net >= 0;
        return (
          <View key={s.personName} style={[styles.row, { borderBottomColor: colors.separator }]}>
            <View style={[styles.avatar, { backgroundColor: color + '28' }]}>
              <Text style={[styles.avatarText, { color }]} numberOfLines={1} ellipsizeMode="tail">
                {s.personName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
                {s.personName}
              </Text>
              <Text
                style={[styles.paid, { color: colors.textMuted }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                Paid {formatCurrency(s.totalPaid)} · Share {formatCurrency(s.equalShare)}
              </Text>
            </View>
            <View style={[styles.netBadge, { backgroundColor: isPositive ? colors.positiveBg : colors.negativeBg }]}>
              <Text
                style={[styles.netText, { color: isPositive ? colors.positive : colors.negative }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {s.net === 0 ? 'Settled' : (isPositive ? '+' : '') + formatCurrency(s.net)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.sm,
  },
  totalBadge: {
    backgroundColor: 'rgba(124, 111, 247, 0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    flexShrink: 0,
    maxWidth: '55%',
  },
  totalText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  avatarText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  info: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    marginRight: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 3,
  },
  paid: { fontSize: FontSize.xs },
  netBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    flexShrink: 0,
    minWidth: 64,
    maxWidth: 120,
  },
  netText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
});
