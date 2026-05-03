import React from 'react';
import { Text, TextProps } from 'react-native';

type FittedTextProps = TextProps & {
  minimumFontScale?: number;
};

export function FittedText({
  children,
  numberOfLines = 1,
  minimumFontScale = 0.82,
  ellipsizeMode = 'tail',
  ...props
}: FittedTextProps) {
  return (
    <Text
      {...props}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      adjustsFontSizeToFit
      minimumFontScale={minimumFontScale}
      maxFontSizeMultiplier={1.25}
    >
      {children}
    </Text>
  );
}
