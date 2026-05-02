import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import { formatDate, formatCurrency } from '../../utils/formatting';
import type { Event } from '../../store/eventStore';

interface EventCardProps {
  event: Event;
  total: number;
  participantCount: number;
  onPress: () => void;
}

export const EventCard = memo(function EventCard({ event, total, participantCount, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="calendar-star" size={24} color={Colors.accent} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.date}>{formatDate(event.date)}</Text>
        <View style={styles.pills}>
          <View style={styles.pill}>
            <MaterialCommunityIcons name="account-group-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.pillText}>{participantCount} people</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>{formatCurrency(total)}</Text>
        <Text style={styles.totalLabel}>total</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
    color: Colors.text,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
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
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  total: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  totalLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
