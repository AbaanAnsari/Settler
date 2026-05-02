import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../utils/colors';
import { formatDuration, formatRelativeDate } from '../../utils/formatting';
import type { VoiceNote, VoiceNoteTag } from '../../store/voiceNoteStore';

interface VoiceNoteCardProps {
  note: VoiceNote;
  onDelete: () => void;
}

const TAG_COLORS: Record<VoiceNoteTag, { bg: string; text: string }> = {
  Expense: { bg: Colors.negativeBg, text: Colors.negative },
  Reminder: { bg: 'rgba(251, 191, 36, 0.12)', text: Colors.warning },
  General: { bg: Colors.surfaceElevated, text: Colors.textSecondary },
};

export function VoiceNoteCard({ note, onDelete }: VoiceNoteCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handlePlayPause() {
    if (!note.fileUri) {
      Alert.alert('No Recording', 'This is sample data. Record a new note to play it back.');
      return;
    }
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Simulate progress for demo purposes
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return p + 1 / (note.duration || 30);
        });
      }, 1000);
    }
  }

  const barCount = 24;
  const tagStyle = note.tag ? TAG_COLORS[note.tag] : null;

  return (
    <View style={styles.card}>
      {/* Play button */}
      <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
        <MaterialCommunityIcons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={Colors.accent}
        />
      </TouchableOpacity>

      {/* Waveform + metadata */}
      <View style={styles.content}>
        <View style={styles.waveform}>
          {Array.from({ length: barCount }).map((_, i) => {
            const height = 4 + (Math.sin(i * 0.8 + 1) * 0.5 + 0.5) * 20;
            const filled = i / barCount <= progress;
            return (
              <View
                key={i}
                style={[
                  styles.bar,
                  { height, backgroundColor: filled ? Colors.accent : Colors.surfaceBorder },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.duration}>{formatDuration(note.duration)}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.date}>{formatRelativeDate(note.date)}</Text>
            {tagStyle && note.tag ? (
              <>
                <Text style={styles.dot}>·</Text>
                <View style={[styles.tag, { backgroundColor: tagStyle.bg }]}>
                  <Text style={[styles.tagText, { color: tagStyle.text }]}>{note.tag}</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124,111,247,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 6 },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 28,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  meta: { gap: 2 },
  title: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  duration: { fontSize: FontSize.xs, color: Colors.textMuted },
  dot: { fontSize: FontSize.xs, color: Colors.textMuted },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
  tag: {
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: FontWeight.semibold },
  deleteBtn: {
    padding: 6,
  },
});
