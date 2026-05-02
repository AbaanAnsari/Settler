import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import type { VoiceNoteTag } from '../../store/voiceNoteStore';

interface RecordingSheetProps {
  onSave: (data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) => void;
  onCancel: () => void;
}

const TAGS: VoiceNoteTag[] = ['Expense', 'Reminder', 'General'];

export function RecordingSheet({ onSave, onCancel }: RecordingSheetProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<VoiceNoteTag>('General');
  const [recorded, setRecorded] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  function startRecording() {
    // In a real app, use expo-audio here
    // For now we simulate recording with a timer
    setIsRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecorded(true);
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title for your note.');
      return;
    }
    onSave({
      title: title.trim(),
      duration,
      fileUri: '', // Real URI from expo-audio would go here
      tag,
    });
  }

  function formatDur(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      {/* Recording visualizer */}
      <View style={styles.visualizer}>
        {isRecording ? (
          <View style={styles.recordingDot} />
        ) : (
          <MaterialCommunityIcons
            name={recorded ? 'microphone-outline' : 'microphone'}
            size={40}
            color={recorded ? Colors.positive : Colors.textMuted}
          />
        )}
        <Text style={styles.timer}>{formatDur(duration)}</Text>
        {isRecording && <Text style={styles.recordingLabel}>Recording...</Text>}
        {recorded && !isRecording && <Text style={styles.doneLabel}>Recording complete</Text>}
      </View>

      {/* Record / Stop button */}
      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.stopBtn]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialCommunityIcons
          name={isRecording ? 'stop' : 'microphone'}
          size={28}
          color="#fff"
        />
        <Text style={styles.recordBtnText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>

      {/* Title */}
      {recorded && (
        <>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Name your note..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            maxLength={60}
          />

          {/* Tag */}
          <Text style={styles.label}>Tag</Text>
          <View style={styles.tagRow}>
            {TAGS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tagChip, tag === t && styles.tagChipActive]}
                onPress={() => setTag(t)}
              >
                <Text style={[styles.tagChipText, tag === t && styles.tagChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {!recorded && (
        <TouchableOpacity style={styles.cancelBtnSolo} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm, alignItems: 'stretch' },
  visualizer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  recordingDot: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.negative,
    shadowColor: Colors.negative, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 8,
  },
  timer: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, color: Colors.text, fontVariant: ['tabular-nums'] },
  recordingLabel: { fontSize: FontSize.sm, color: Colors.negative, fontWeight: FontWeight.medium },
  doneLabel: { fontSize: FontSize.sm, color: Colors.positive, fontWeight: FontWeight.medium },
  recordBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.accent, borderRadius: Radius.full,
    paddingVertical: Spacing.md, marginHorizontal: Spacing.lg,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  stopBtn: { backgroundColor: Colors.negative, shadowColor: Colors.negative },
  recordBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff' },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md, color: Colors.text,
  },
  tagRow: { flexDirection: 'row', gap: Spacing.sm },
  tagChip: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder, alignItems: 'center',
  },
  tagChipActive: { backgroundColor: Colors.accent },
  tagChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  tagChipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder, alignItems: 'center',
  },
  cancelBtnSolo: {
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceBorder, alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  saveBtn: {
    flex: 2, paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    backgroundColor: Colors.positive, alignItems: 'center',
  },
  saveText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
