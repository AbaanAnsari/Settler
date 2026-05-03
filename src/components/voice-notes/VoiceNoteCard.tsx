import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { VoiceNote, VoiceNoteTag } from '../../store/voiceNoteStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatDuration, formatRelativeDate } from '../../utils/formatting';

interface VoiceNoteCardProps {
  note: VoiceNote;
  onDeleteConfirmed: () => void;
}

export const VoiceNoteCard = memo(function VoiceNoteCard({ note, onDeleteConfirmed }: VoiceNoteCardProps) {
  const colors = useThemeColors();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handlePlayPause() {
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

  function handleDelete() {
    Alert.alert(
      'Delete',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDeleteConfirmed },
      ]
    );
  }

  const barCount = 24;
  const tagStyle: Record<VoiceNoteTag, { bg: string; text: string }> = {
    Expense: { bg: colors.negativeBg, text: colors.negative },
    Reminder: { bg: 'rgba(251, 191, 36, 0.12)', text: colors.warning },
    General: { bg: colors.surfaceElevated, text: colors.textSecondary },
  };
  const activeTagStyle = note.tag ? tagStyle[note.tag] : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Play button */}
      <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
        <MaterialCommunityIcons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={colors.accent}
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
                  styles.barSpacing,
                  { height, backgroundColor: filled ? colors.accent : colors.surfaceBorder },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.meta}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.9}
          >
            {note.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.duration, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
              {formatDuration(note.duration)}
            </Text>
            <Text style={[styles.dot, styles.metaGap, { color: colors.textMuted }]}>·</Text>
            <Text style={[styles.date, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
              {formatRelativeDate(note.date)}
            </Text>
            {activeTagStyle && note.tag ? (
              <>
                <Text style={[styles.dot, styles.metaGap, { color: colors.textMuted }]}>·</Text>
                <View style={[styles.tag, { backgroundColor: activeTagStyle.bg }]}>
                  <Text style={[styles.tagText, { color: activeTagStyle.text }]} numberOfLines={1} ellipsizeMode="tail">
                    {note.tag}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.trashBtn} onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Delete voice note">
        <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124,111,247,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    marginBottom: 6,
  },
  barSpacing: {
    marginRight: 2,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  meta: {
    minWidth: 0,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  metaGap: {
    marginHorizontal: 4,
  },
  duration: {
    fontSize: FontSize.xs,
    flexShrink: 0,
  },
  dot: {
    fontSize: FontSize.xs,
    flexShrink: 0,
  },
  date: {
    fontSize: FontSize.xs,
    flexShrink: 1,
    minWidth: 0,
  },
  tag: {
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 1,
    minWidth: 0,
  },
  tagText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
  },
  trashBtn: {
    paddingLeft: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
