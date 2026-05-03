import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Spacing, useThemeColors } from '../../utils/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: number;
}

export function Card({ children, style, elevated = false, padding = Spacing.md }: CardProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        {
          padding,
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderColor: colors.surfaceBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
});
