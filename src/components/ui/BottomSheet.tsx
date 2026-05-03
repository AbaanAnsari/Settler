import React, { forwardRef, ReactNode, useCallback, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import BottomSheetLib, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import { FittedText } from './FittedText';

interface BottomSheetProps {
  snapPoints?: (string | number)[];
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const BottomSheet = forwardRef<BottomSheetLib, BottomSheetProps>(
  ({ snapPoints = ['55%', '90%'], title, children, onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const bottomSheetRef = useRef<BottomSheetLib>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetLib);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    return (
      <BottomSheetLib
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.background, { backgroundColor: colors.surfaceElevated }]}
        handleIndicatorStyle={[styles.handle, { backgroundColor: colors.surfaceBorder }]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onChange={(index) => {
          if (index === -1) {
            Keyboard.dismiss();
            onClose?.();
          }
        }}
      >
        <BottomSheetScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: insets.bottom + Spacing.xxl },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {title || onClose ? (
            <View style={styles.header}>
              {title ? <FittedText style={[styles.title, { color: colors.text }]} minimumFontScale={0.78}>{title}</FittedText> : <View />}
              {onClose ? (
                <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.close()}
                  style={[styles.closeBtn, { backgroundColor: colors.surfaceBorder }]}
                >
                  <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {children}
        </BottomSheetScrollView>
      </BottomSheetLib>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
export default BottomSheet;

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  handle: {
    width: 40,
    height: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.sm,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
