import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Event } from '../../store/eventStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { FittedText } from '../ui/FittedText';

interface EventCardProps {
  event: Event;
  total: number;
  participantCount: number;
  onPress: () => void;
  onDeletePress?: () => void;
}

export const EventCard = memo(function EventCard({ event, total, participantCount, onPress, onDeletePress }: EventCardProps) {
  const colors = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <TouchableOpacity
        style={styles.contentArea}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="calendar-star" size={24} color={colors.accent} />
        </View>
        <View style={styles.info}>
          <FittedText style={[styles.name, { color: colors.text }]} numberOfLines={2} minimumFontScale={0.82}>
            {event.name}
          </FittedText>
          <FittedText style={[styles.date, { color: colors.textMuted }]} minimumFontScale={0.82}>
            {formatDate(event.date)}
          </FittedText>
          <View style={styles.pills}>
            <View style={[styles.pill, { backgroundColor: colors.surfaceElevated }]}>
              <MaterialCommunityIcons name="account-group-outline" size={12} color={colors.textMuted} style={styles.pillIcon} />
              <FittedText style={[styles.pillText, { color: colors.textMuted }]} minimumFontScale={0.8}>
                {participantCount}
              </FittedText>
            </View>
          </View>
        </View>
        <View style={styles.right}>
          <Text
            style={[styles.total, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {formatCurrency(total)}
          </Text>
        </View>
      </TouchableOpacity>

      {onDeletePress && (
        <TouchableOpacity style={styles.trashBtn} onPress={onDeletePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Delete event">
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
    borderWidth: 1,
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(124, 111, 247, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
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
  date: {
    fontSize: FontSize.xs,
    marginBottom: 2,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: 11,
    paddingVertical: 3,
  },
  pillIcon: {
    marginRight: 4,
  },
  pillText: {
    fontSize: FontSize.xs,
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 72,
    flexShrink: 0,
  },
  total: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'right',
  },
  trashBtn: {
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
