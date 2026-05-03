import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { memo, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Expense } from '../../store/eventStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { DateField } from '../ui/DateField';
import { FittedText } from '../ui/FittedText';

interface ExpenseFormProps {
  eventId: string;
  suggestedNames?: string[];
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  initial?: Expense;
}

export const ExpenseForm = memo(function ExpenseForm({ eventId, suggestedNames = [], onSubmit, onCancel, initial }: ExpenseFormProps) {
  const colors = useThemeColors();
  const [personName, setPersonName] = useState(initial?.personName ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [dateStr, setDateStr] = useState(
    initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
  );

  useEffect(() => {
    setPersonName(initial?.personName ?? '');
    setAmount(initial ? String(initial.amount) : '');
    setReason(initial?.reason ?? '');
    setDateStr(initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
  }, [initial]);

  const numAmount = Number(amount);
  const isValid = personName.trim() !== '' && amount.trim() !== '' && !isNaN(numAmount) && numAmount > 0;

  function handleSubmit() {
    if (!isValid) return;
    Keyboard.dismiss();
    onSubmit({
      eventId,
      personName: personName.trim(),
      amount: numAmount,
      reason: reason.trim(),
      date: new Date(dateStr).toISOString(),
    });
  }

  function handleCancel() {
    Keyboard.dismiss();
    onCancel();
  }

  return (
    <View style={styles.container}>
      {/* Person name */}
      <FittedText style={[styles.label, { color: colors.textSecondary }]} minimumFontScale={0.82}>Who Paid?</FittedText>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="e.g. Arjun"
        placeholderTextColor={colors.textMuted}
        value={personName}
        onChangeText={setPersonName}
      />
      {/* Quick-fill suggested names */}
      {suggestedNames.length > 0 && (
        <View style={styles.suggestions}>
          {suggestedNames.map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.chip}
              onPress={() => setPersonName(n)}
            >
              <FittedText style={[styles.chipText, { color: colors.accentLight }]} minimumFontScale={0.78}>
                {n}
              </FittedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FittedText style={[styles.label, { color: colors.textSecondary }]} minimumFontScale={0.82}>Amount (Rs)</FittedText>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="0.00"
        placeholderTextColor={colors.textMuted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <FittedText style={[styles.label, { color: colors.textSecondary }]} minimumFontScale={0.82}>Reason</FittedText>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="e.g. Hotel booking"
        placeholderTextColor={colors.textMuted}
        value={reason}
        onChangeText={setReason}
        maxLength={80}
      />

      <DateField value={dateStr} onChange={setDateStr} />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
          <FittedText style={[styles.cancelText, { color: colors.textSecondary }]} minimumFontScale={0.78}>Cancel</FittedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, !isValid && styles.disabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <FittedText style={styles.submitText} minimumFontScale={0.74}>{initial ? 'Save Changes' : 'Add Expense'}</FittedText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4, marginBottom: 4,
  },
  input: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md, marginBottom: Spacing.sm,
  },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.xs },
  chip: {
    backgroundColor: 'rgba(124,111,247,0.15)', borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, flexShrink: 1 },
  actions: { flexDirection: 'row', marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.sm,
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  submitBtn: {
    flex: 2,
    minWidth: 0,
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  submitText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
