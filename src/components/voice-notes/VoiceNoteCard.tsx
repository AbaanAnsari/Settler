import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { VoiceNote, VoiceNoteTag } from '../../store/voiceNoteStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../utils/colors';
import { formatDuration, formatRelativeDate } from '../../utils/formatting';
import { FittedText } from '../ui/FittedText';

interface VoiceNoteCardProps {
  note: VoiceNote;
  isPlaying: boolean;
  onTogglePlay: (id: string) => void;
  onDeleteConfirmed: () => void;
}

export const VoiceNoteCard = memo(function VoiceNoteCard({
  note,
  isPlaying,
  onTogglePlay,
  onDeleteConfirmed,
}: VoiceNoteCardProps) {
  const colors = useThemeColors();

  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ▶️ Playback timer (SAFE)
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => Math.min(p + 1 / (note.duration || 30), 1));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, note.duration]);

  // ✅ Handle completion OUTSIDE render cycle
  useEffect(() => {
    if (progress >= 1 && isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;

      onTogglePlay(note.id); // safe here
      setProgress(0);
    }
  }, [progress, isPlaying]);

  function handleDelete() {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDeleteConfirmed },
    ]);
  }

  const elapsed = Math.floor(progress * note.duration);

  // 🎯 Slider seek
  function handleSeek(value: number) {
    setProgress(value);
  }

  const tagStyle: Record<VoiceNoteTag, { bg: string; text: string }> = {
    Expense: { bg: colors.negativeBg, text: colors.negative },
    Reminder: { bg: 'rgba(251, 191, 36, 0.12)', text: colors.warning },
    General: { bg: colors.surfaceElevated, text: colors.textSecondary },
  };

  const activeTag = note.tag ? tagStyle[note.tag] : null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.surfaceBorder,
        },
      ]}
    >
      {/* ▶️ BIG PLAY BUTTON */}
      <TouchableOpacity
        onPress={() => onTogglePlay(note.id)}
        style={styles.playBtn}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={64}
          color={colors.text}
        />
      </TouchableOpacity>

      {/* 📄 CONTENT */}
      <View style={styles.content}>
        <FittedText style={[styles.title, { color: colors.text }]}>
          {note.title}
        </FittedText>

        {/* META */}
        <View style={styles.metaRow}>
          <FittedText style={[styles.metaText, { color: colors.textMuted }]} adjustsFontSizeToFit>
            {formatDuration(note.duration)}
          </FittedText>

          <Text style={[styles.dot,styles.metaGap, { color: colors.textMuted }]}>·</Text>

          <FittedText style={[styles.metaText, { color: colors.textMuted }]}>
            {formatRelativeDate(note.date)}
          </FittedText>

          {activeTag && (
            <>
              <View style={[styles.tag, { backgroundColor: activeTag.bg }]}>
                <FittedText style={[styles.tagText, { color: activeTag.text }]}>
                  {note.tag}
                </FittedText>
              </View>
            </>
          )}
        </View>

        {/* PROGRESS + SLIDER */}
        {isPlaying && (
          <View style={styles.progressContainer}>
            <Slider
              value={progress}
              onValueChange={handleSeek}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceBorder}
              thumbTintColor={colors.accent}
            />

            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: colors.textMuted }]} adjustsFontSizeToFit>
                {formatDuration(elapsed)}
              </Text>
              <Text style={[styles.timeText, { color: colors.textMuted }]} adjustsFontSizeToFit>
                {formatDuration(note.duration)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 🗑 DELETE */}
      <TouchableOpacity
        style={styles.trashbtn}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={26}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },

  playBtn: {
    marginRight: Spacing.md,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  metaText: {
    fontSize: FontSize.sm,
  },

  dot: {
    fontSize: FontSize.xs,
    flexShrink: 0,
  },
  metaGap: {
    marginHorizontal: 4,
  },

  tag: {
    borderRadius: Radius.full,
    marginHorizontal:4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  progressContainer: {
    marginTop: Spacing.md,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  timeText: {
    fontSize: FontSize.sm,
  },

  trashbtn: {
    marginLeft: Spacing.md,
  },
});