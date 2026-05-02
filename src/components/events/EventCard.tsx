import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Event } from '../../store/eventStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface EventCardProps {
  event: Event;
  total: number;
  participantCount: number;
  onPress: () => void;
}

export const EventCard = memo(function EventCard({ event, total, participantCount, onPress }: EventCardProps) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="calendar-star" size={24} color={colors.accent} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{event.name}</Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formatDate(event.date)}</Text>
        <View style={styles.pills}>
          <View style={[styles.pill, { backgroundColor: colors.surfaceElevated }]}>
            <MaterialCommunityIcons name="account-group-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.pillText, { color: colors.textMuted }]}>{participantCount} people</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.total, { color: colors.text }]}>{formatCurrency(total)}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
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
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(124, 111, 247, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  date: {
    fontSize: FontSize.xs,
  },
  pills: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: Radius.full,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: FontSize.xs,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
    minWidth: 96,
  },
  total: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
