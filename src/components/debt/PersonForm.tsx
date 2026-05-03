import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { memo, useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { FittedText } from '../ui/FittedText';

interface PersonFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  initial?: { name: string };
}

export const PersonForm = memo(function PersonForm({ onSubmit, onCancel, initial }: PersonFormProps) {
  const colors = useThemeColors();
  const [name, setName] = useState(initial?.name ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
  }, [initial]);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    Keyboard.dismiss();
    onSubmit(trimmed);
    setName('');
  }

  function handleCancel() {
    Keyboard.dismiss();
    onCancel();
  }

  return (
    <View style={styles.container}>
      <FittedText style={[styles.label, { color: colors.textSecondary }]} minimumFontScale={0.82}>Name</FittedText>
      <BottomSheetTextInput
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text },
        ]}
        placeholder="e.g. Priya Kapoor"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        maxLength={40}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
          <FittedText style={[styles.cancelText, { color: colors.textSecondary }]} minimumFontScale={0.78}>Cancel</FittedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, !name.trim() && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <FittedText style={styles.submitText} minimumFontScale={0.76}>{initial ? 'Save Changes' : 'Add Person'}</FittedText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  submitBtn: {
    flex: 2,
    minWidth: 0,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: '#fff',
  },
});
