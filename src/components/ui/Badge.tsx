import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../utils/colors';
import { FittedText } from './FittedText';

interface BadgeProps {
  value: string;
  type?: 'positive' | 'negative' | 'neutral' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  style?: TextStyle;
  textStyle?: TextStyle;
}

export function Badge({ value, type = 'neutral', size = 'md', style, textStyle }: BadgeProps) {
  const colors = useThemeColors();
  const bg = {
    positive: colors.positiveBg,
    negative: colors.negativeBg,
    neutral: colors.surfaceElevated,
    accent: 'rgba(124, 111, 247, 0.15)',
  }[type];

  const color = {
    positive: colors.positive,
    negative: colors.negative,
    neutral: colors.textSecondary,
    accent: colors.accentLight,
  }[type];

  const fontSize = { sm: FontSize.xs, md: FontSize.sm, lg: FontSize.md }[size];
  const paddingH = { sm: Spacing.xs, md: Spacing.sm, lg: Spacing.sm + 4 }[size];
  const paddingV = { sm: 2, md: 4, lg: 6 }[size];

  return (
    <FittedText
      style={[
        styles.base,
        { backgroundColor: bg, color, fontSize, paddingHorizontal: paddingH, paddingVertical: paddingV },
        style,
        textStyle,
      ]}
      minimumFontScale={0.76}
    >
      {value}
    </FittedText>
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
