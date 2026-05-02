import React, { useState, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import type { Event } from '../../store/eventStore';

interface EventFormProps {
  onSubmit: (data: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  initial?: Event;
}

export const EventForm = memo(function EventForm({ onSubmit, onCancel, initial }: EventFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [dateStr, setDateStr] = useState(
    initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
  );
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? '');
    setDateStr(initial ? new Date(initial.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
  }, [initial]);

  const isValid = name.trim() !== '';

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ name: name.trim(), date: new Date(dateStr).toISOString() });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Goa Trip 2026"
        placeholderTextColor={Colors.textMuted}
        value={name}
        onChangeText={setName}
        maxLength={60}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{dateStr}</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.calendarContainer}>
          <DateTimePicker
            mode="single"
            date={dateStr}
            onChange={(params) => {
              if (params.date) {
                setDateStr(dayjs(params.date).format('YYYY-MM-DD'));
                setShowPicker(false);
              }
            }}
          />
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.disabled]}
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
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md, color: Colors.text, marginBottom: 2,
  },
  dateInput: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, marginBottom: 2,
  },
  dateText: { fontSize: FontSize.md, color: Colors.text },
  calendarContainer: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, marginTop: Spacing.sm,
    padding: Spacing.sm, overflow: 'hidden',
  },
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
