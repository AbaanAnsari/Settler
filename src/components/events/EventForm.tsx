import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { memo, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Event } from '../../store/eventStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { DateField } from '../ui/DateField';

interface EventFormProps {
  onSubmit: (data: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  initial?: Event;
}

export const EventForm = memo(function EventForm({ onSubmit, onCancel, initial }: EventFormProps) {
  const colors = useThemeColors();
  const [name, setName] = useState(initial?.name ?? '');
  const [dateStr, setDateStr] = useState(
    initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
  );

  useEffect(() => {
    setName(initial?.name ?? '');
    setDateStr(initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
  }, [initial]);

  const isValid = name.trim() !== '';

  function handleSubmit() {
    if (!isValid) return;
    Keyboard.dismiss();
    onSubmit({ name: name.trim(), date: new Date(dateStr).toISOString() });
  }

  function handleCancel() {
    Keyboard.dismiss();
    onCancel();
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Event Name</Text>
      <BottomSheetTextInput
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text },
        ]}
        placeholder="e.g. Goa Trip 2026"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
        maxLength={60}
      />

      <DateField value={dateStr} onChange={setDateStr} />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, !isValid && styles.disabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitText}>{initial ? 'Save Changes' : 'Create Event'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  input: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md, marginBottom: 2,
  },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  submitBtn: {
    flex: 2, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  submitText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
