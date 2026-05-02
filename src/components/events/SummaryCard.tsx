import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
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

export function SummaryCard({ summaries, total }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Balance Summary</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>Total {formatCurrency(total)}</Text>
        </View>
      </View>

      {summaries.map((s) => {
        const color = getAvatarColor(s.personName);
        const isPositive = s.net >= 0;
        return (
          <View key={s.personName} style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: color + '28' }]}>
              <Text style={[styles.avatarText, { color }]}>
                {s.personName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{s.personName}</Text>
              <Text style={styles.paid}>Paid {formatCurrency(s.totalPaid)} · Share {formatCurrency(s.equalShare)}</Text>
            </View>
            <View style={[styles.netBadge, isPositive ? styles.posBg : styles.negBg]}>
              <Text style={[styles.netText, { color: isPositive ? Colors.positive : Colors.negative }]}>
                {s.net === 0 ? 'Settled' : (isPositive ? '+' : '') + formatCurrency(s.net)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  totalBadge: {
    backgroundColor: 'rgba(124, 111, 247, 0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  totalText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accentLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  info: { flex: 1, gap: 3 },
  name: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  paid: { fontSize: FontSize.xs, color: Colors.textMuted },
  netBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  posBg: { backgroundColor: Colors.positiveBg },
  negBg: { backgroundColor: Colors.negativeBg },
  netText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
