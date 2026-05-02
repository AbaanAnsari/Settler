import React, { useState, useEffect, memo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';

interface PersonFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  initial?: { name: string };
}

export const PersonForm = memo(function PersonForm({ onSubmit, onCancel, initial }: PersonFormProps) {
  const [name, setName] = useState(initial?.name ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
  }, [initial]);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Priya Kapoor"
        placeholderTextColor={Colors.textMuted}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        maxLength={40}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, !name.trim() && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Text style={styles.submitText}>{initial ? 'Save Changes' : 'Add Person'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
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
