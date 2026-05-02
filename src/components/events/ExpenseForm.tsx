import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import type { Expense } from '../../store/eventStore';
import { DateField } from '../ui/DateField';

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
      <Text style={[styles.label, { color: colors.textSecondary }]}>Who Paid?</Text>
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
            <TouchableOpacity key={n} style={styles.chip} onPress={() => setPersonName(n)}>
              <Text style={[styles.chipText, { color: colors.accentLight }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={[styles.label, { color: colors.textSecondary }]}>Amount (₹)</Text>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="0.00"
        placeholderTextColor={colors.textMuted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Reason</Text>
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
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, !isValid && styles.disabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitText}>{initial ? 'Save Changes' : 'Add Expense'}</Text>
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
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.xs },
  chip: {
    backgroundColor: 'rgba(124,111,247,0.15)', borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
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
