import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize, FontWeight, Spacing, useThemeColors } from '../../utils/colors';
import { FittedText } from './FittedText';

interface FABProps {
  onPress: () => void;
  label?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FAB({ onPress, label = 'Add', icon = 'plus', style }: FABProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.93, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  return (
    <AnimatedTouchable
      style={[
        styles.fab,
        { bottom: insets.bottom + 32, backgroundColor: colors.accent, shadowColor: colors.accent },
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
      {label ? <FittedText style={[styles.label, styles.labelSpacing]} minimumFontScale={0.76}>{label}</FittedText> : null}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.md,
    borderRadius: 28,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
    maxWidth: '64%',
    minHeight: 48,
  },
  label: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  labelSpacing: {
    marginLeft: Spacing.xs + 2,
  },
});
