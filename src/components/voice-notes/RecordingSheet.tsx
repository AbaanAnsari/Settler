import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, Radius, useThemeColors } from '../../utils/colors';
import type { VoiceNoteTag } from '../../store/voiceNoteStore';

interface RecordingSheetProps {
  onSave: (data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) => void;
  onCancel: () => void;
}

const TAGS: VoiceNoteTag[] = ['Expense', 'Reminder', 'General'];

export function RecordingSheet({ onSave, onCancel }: RecordingSheetProps) {
  const colors = useThemeColors();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<VoiceNoteTag>('General');
  const [recorded, setRecorded] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function startRecording() {
    // In a real app, use expo-audio here
    // For now we simulate recording with a timer
    setIsRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRecording(false);
    setRecorded(true);
  }

  function handleCancel() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    Keyboard.dismiss();
    onCancel();
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title for your note.');
      return;
    }
    Keyboard.dismiss();
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
          <View style={[styles.recordingDot, { backgroundColor: colors.negative, shadowColor: colors.negative }]} />
        ) : (
          <MaterialCommunityIcons
            name={recorded ? 'microphone-outline' : 'microphone'}
            size={40}
            color={recorded ? colors.positive : colors.textMuted}
          />
        )}
        <Text style={[styles.timer, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {formatDur(duration)}
        </Text>
        {isRecording && (
          <Text style={[styles.recordingLabel, { color: colors.negative }]} numberOfLines={1} ellipsizeMode="tail">
            Recording...
          </Text>
        )}
        {recorded && !isRecording && (
          <Text style={[styles.doneLabel, { color: colors.positive }]} numberOfLines={1} ellipsizeMode="tail">
            Recording complete
          </Text>
        )}
      </View>

      {/* Record / Stop button */}
      <TouchableOpacity
        style={[
          styles.recordBtn,
          { backgroundColor: colors.accent, shadowColor: colors.accent },
          isRecording && { backgroundColor: colors.negative, shadowColor: colors.negative },
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialCommunityIcons
          name={isRecording ? 'stop' : 'microphone'}
          size={28}
          color="#fff"
        />
        <Text style={[styles.recordBtnText, styles.recordBtnLabel]} numberOfLines={1} ellipsizeMode="tail">
          {isRecording ? 'Stop' : 'Record'}
        </Text>
      </TouchableOpacity>

      {/* Title */}
      {recorded && (
        <>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
          <BottomSheetTextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.text }]}
            placeholder="Name your note..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            maxLength={60}
          />

          {/* Tag */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Tag</Text>
          <View style={styles.tagRow}>
            {TAGS.map((t, idx) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tagChip,
                  idx < TAGS.length - 1 && styles.tagChipSpacing,
                  { backgroundColor: colors.surfaceBorder },
                  tag === t && { backgroundColor: colors.accent },
                ]}
                onPress={() => setTag(t)}
              >
                <Text
                  style={[styles.tagChipText, { color: colors.textSecondary }, tag === t && styles.tagChipTextActive]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.positive }]} onPress={handleSave}>
              <Text style={styles.saveText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {!recorded && (
        <TouchableOpacity style={[styles.cancelBtnSolo, { backgroundColor: colors.surfaceBorder }]} onPress={handleCancel}>
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'stretch' },
  visualizer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  recordingDot: {
    width: 60, height: 60, borderRadius: 30,
    marginBottom: Spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 8,
  },
  timer: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
    marginTop: Spacing.sm,
  },
  recordingLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginTop: Spacing.sm },
  doneLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginTop: Spacing.sm },
  recordBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.full,
    paddingVertical: Spacing.md, marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  recordBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff' },
  recordBtnLabel: { marginLeft: Spacing.sm, flexShrink: 1, minWidth: 0 },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  input: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4, fontSize: FontSize.md,
  },
  tagRow: { flexDirection: 'row', marginTop: Spacing.xs },
  tagChip: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.sm, borderRadius: Radius.md,
    alignItems: 'center',
  },
  tagChipSpacing: {
    marginRight: Spacing.sm,
  },
  tagChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  tagChipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.sm,
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelBtnSolo: {
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  saveBtn: {
    flex: 2,
    minWidth: 0,
    paddingVertical: Spacing.sm + 4, borderRadius: Radius.md,
    alignItems: 'center',
  },
  saveText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
});
