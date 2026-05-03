import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import type { Transaction } from '../../store/debtStore';
import { DateField } from '../ui/DateField';

interface TransactionFormProps {
  personId: string;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initial?: Transaction;
}

type TxType = 'give' | 'take';

export const TransactionForm = memo(function TransactionForm({ personId, onSubmit, onCancel, initial }: TransactionFormProps) {
  const colors = useThemeColors();
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [type, setType] = useState<TxType>(initial?.type ?? 'give');
  const [dateStr, setDateStr] = useState(
    initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
  );

  useEffect(() => {
    setAmount(initial ? String(initial.amount) : '');
    setDescription(initial?.description ?? '');
    setType(initial?.type ?? 'give');
    setDateStr(initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
  }, [initial]);

  const numAmount = Number(amount);
  const isValid = amount.trim() !== '' && !isNaN(numAmount) && numAmount > 0 && description.trim() !== '';

  function handleSubmit() {
    if (!isValid) return;
    Keyboard.dismiss();
    onSubmit({
      personId,
      amount: numAmount,
      description: description.trim(),
      type,
      date: new Date(dateStr).toISOString(),
    });
  }

  function handleCancel() {
    Keyboard.dismiss();
    onCancel();
  }

  return (
    <View style={styles.container}>
      {/* Type Toggle */}
      <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <TouchableOpacity
          style={[styles.toggleBtn, type === 'give' && { backgroundColor: colors.positive }]}
          onPress={() => setType('give')}
        >
          <Text style={[styles.toggleText, { color: colors.textSecondary }, type === 'give' && styles.toggleActiveText]}>
            I Gave
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, type === 'take' && { backgroundColor: colors.negative }]}
          onPress={() => setType('take')}
        >
          <Text style={[styles.toggleText, { color: colors.textSecondary }, type === 'take' && styles.toggleActiveText]}>
            I Got
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>Amount (₹)</Text>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="0.00"
        placeholderTextColor={colors.textMuted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      {/* Description */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
      <BottomSheetTextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
        placeholder="e.g. Dinner at Punjab Grill"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        returnKeyType="done"
        maxLength={80}
      />

      <DateField value={dateStr} onChange={setDateStr} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, !isValid && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitText}>{initial ? 'Save Changes' : 'Add Transaction'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  toggleRow: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  toggleText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  toggleActiveText: { color: '#fff' },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 4,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
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
  submitDisabled: { opacity: 0.4 },
  submitText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
