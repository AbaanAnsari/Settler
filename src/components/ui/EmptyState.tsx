import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../utils/colors';
import { FittedText } from './FittedText';

interface EmptyStateProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EmptyState({ icon = 'inbox-outline', title, subtitle, children }: EmptyStateProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceElevated }]}>
        <MaterialCommunityIcons name={icon} size={52} color={colors.textMuted} />
      </View>
      <FittedText style={[styles.title, { color: colors.text }]} numberOfLines={2} minimumFontScale={0.78}>
        {title}
      </FittedText>
      {subtitle ? (
        <FittedText style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={3} minimumFontScale={0.82}>
          {subtitle}
        </FittedText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
});
