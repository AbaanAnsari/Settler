import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../../utils/colors';

interface BadgeProps {
  value: string;
  type?: 'positive' | 'negative' | 'neutral' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  style?: TextStyle;
  textStyle?: TextStyle;
}

export function Badge({ value, type = 'neutral', size = 'md', style, textStyle }: BadgeProps) {
  const bg = {
    positive: Colors.positiveBg,
    negative: Colors.negativeBg,
    neutral: Colors.surfaceElevated,
    accent: 'rgba(124, 111, 247, 0.15)',
  }[type];

  const color = {
    positive: Colors.positive,
    negative: Colors.negative,
    neutral: Colors.textSecondary,
    accent: Colors.accentLight,
  }[type];

  const fontSize = { sm: FontSize.xs, md: FontSize.sm, lg: FontSize.md }[size];
  const paddingH = { sm: Spacing.xs, md: Spacing.sm, lg: Spacing.sm + 4 }[size];
  const paddingV = { sm: 2, md: 4, lg: 6 }[size];

  return (
    <Text
      style={[
        styles.base,
        { backgroundColor: bg, color, fontSize, paddingHorizontal: paddingH, paddingVertical: paddingV },
        style,
        textStyle,
      ]}
    >
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    fontWeight: FontWeight.semibold,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
