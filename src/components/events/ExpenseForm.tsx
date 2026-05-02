import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import type { Expense } from '../../store/eventStore';

interface ExpenseFormProps {
  eventId: string;
  suggestedNames?: string[];
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  initial?: Expense;
}

export function ExpenseForm({ eventId, suggestedNames = [], onSubmit, onCancel, initial }: ExpenseFormProps) {
  const [personName, setPersonName] = useState(initial?.personName ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [dateStr, setDateStr] = useState(
    initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
  );

  const isValid = personName.trim() !== '' && amount.trim() !== '' && parseFloat(amount) > 0;

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({
      eventId,
      personName: personName.trim(),
      amount: parseFloat(amount),
      reason: reason.trim(),
      date: new Date(dateStr).toISOString(),
    });
  }

  return (
    <View style={styles.container}>
      {/* Person name */}
      <Text style={styles.label}>Who Paid?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Arjun"
        placeholderTextColor={Colors.textMuted}
        value={personName}
        onChangeText={setPersonName}
        autoFocus
      />
      {/* Quick-fill suggested names */}
      {suggestedNames.length > 0 && (
        <View style={styles.suggestions}>
          {suggestedNames.map((n) => (
            <TouchableOpacity key={n} style={styles.chip} onPress={() => setPersonName(n)}>
              <Text style={styles.chipText}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor={Colors.textMuted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Hotel booking"
        placeholderTextColor={Colors.textMuted}
        value={reason}
        onChangeText={setReason}
        maxLength={80}
      />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-04-25"
        placeholderTextColor={Colors.textMuted}
        value={dateStr}
        onChangeText={setDateStr}
        keyboardType="numbers-and-punctuation"
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.disabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitText}>{initial ? 'Save Changes' : 'Add Expense'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md, color: Colors.text, marginBottom: 2,
  },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.xs },
  chip: {
    backgroundColor: 'rgba(124,111,247,0.15)', borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.accentLight },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder, alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  submitBtn: {
    flex: 2, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    backgroundColor: Colors.accent, alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  submitText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
