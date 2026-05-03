import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, useThemeColors } from '../../utils/colors';
import type { VoiceNoteTag } from '../../store/voiceNoteStore';
import { FittedText } from '../ui/FittedText';

interface RecordingSheetProps {
  onSave: (data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) => void;
  onCancel: () => void;
}

const TAGS: VoiceNoteTag[] = ['Expense', 'Reminder', 'General'];

export function RecordingSheet({ onSave, onCancel }: RecordingSheetProps) {
  const colors = useThemeColors();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<VoiceNoteTag>('General');
  const [recorded, setRecorded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function resetState() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    setIsRecording(false);
    setIsPaused(false);
    setRecorded(false);
    setDuration(0);
    setTitle('');
    setTag('General');
  }

  function startRecording() {
    resetState();
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }

  function pauseRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPaused(true);
  }

  function resumeRecording() {
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    setIsRecording(false);
    setIsPaused(false);
    setRecorded(true);
  }

  function handleMainAction() {
    if (!isRecording) return startRecording();
    if (isPaused) return resumeRecording();
    return pauseRecording();
  }

  function handleCancel() {
    resetState();
    Keyboard.dismiss();
    onCancel();
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title.');
      return;
    }

    Keyboard.dismiss();

    onSave({
      title: title.trim(),
      duration,
      fileUri: '',
      tag,
    });

    resetState();
  }

  function formatDur(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  const mainIcon = !isRecording
    ? 'microphone'
    : isPaused
    ? 'play'
    : 'pause';

  const mainColor = !isRecording
    ? colors.accent
    : isPaused
    ? colors.accent
    : colors.warning ?? colors.accent;

  return (
    <View style={styles.container}>

      {/* TIMER */}
      <View style={styles.centerBlock}>
        <FittedText style={[styles.timer, { color: colors.text }]} minimumFontScale={0.72}>
          {formatDur(duration)}
        </FittedText>

        <FittedText style={[
          styles.status,
          {
            color: isRecording
              ? isPaused
                ? colors.accent
                : colors.negative
              : recorded
              ? colors.positive
              : colors.textMuted,
          }
        ]} minimumFontScale={0.82}>
          {!isRecording && !recorded && 'Ready to record'}
          {isRecording && !isPaused && 'Recording...'}
          {isPaused && 'Paused'}
          {recorded && 'Recording complete'}
        </FittedText>
      </View>

      {/* MAIN BUTTON */}
      {!recorded && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: mainColor }
          ]}
          onPress={handleMainAction}
        >
          <MaterialCommunityIcons name={mainIcon} size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* STOP BUTTON */}
      {isRecording && (
        <TouchableOpacity
          style={[styles.stopBtn, { borderColor: colors.negative }]}
          onPress={stopRecording}
        >
          <FittedText style={[styles.stopText, { color: colors.negative }]} minimumFontScale={0.78}>
            Stop Recording
          </FittedText>
        </TouchableOpacity>
      )}

      {/* AFTER RECORD */}
      {recorded && (
        <View style={styles.afterBlock}>
          <BottomSheetTextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
                color: colors.text,
              },
            ]}
            placeholder="Name your note..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <View style={styles.tagRow}>
            {TAGS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tagChip,
                  { backgroundColor: tag === t ? colors.accent : colors.surfaceBorder },
                ]}
                onPress={() => setTag(t)}
              >
                <FittedText style={[styles.tagText, { color: tag === t ? '#fff' : colors.textSecondary }]} minimumFontScale={0.76}>
                  {t}
                </FittedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: colors.surfaceBorder }]}
              onPress={handleCancel}
            >
              <FittedText style={[styles.actionText, { color: colors.textSecondary }]} minimumFontScale={0.78}>Discard</FittedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.positive }]}
              onPress={handleSave}
            >
              <FittedText style={[styles.actionText, { color: '#fff' }]} minimumFontScale={0.78}>Save</FittedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },

  topBar: {
    width: '100%',
    alignItems: 'flex-end',
    padding: Spacing.md,
  },

  centerBlock: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    width: '100%',
  },

  timer: {
    fontSize: 42,
    fontWeight: '700',
  },

  status: {
    marginTop: 6,
    fontSize: 14,
  },

  fab: {
    width: 80,
    height: 80,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  stopBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },

  stopText: {
    fontWeight: '600',
  },

  afterBlock: {
    width: '100%',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: FontSize.md,
  },

  tagRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },

  tagChip: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 0,
  },

  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    minWidth: 0,
  },

  saveBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 0,
  },

  actionText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
