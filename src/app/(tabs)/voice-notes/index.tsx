import BottomSheetLib from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import BottomSheet from '../../../components/ui/BottomSheet';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { FittedText } from '../../../components/ui/FittedText';
import { RecordingSheet } from '../../../components/voice-notes/RecordingSheet';
import { VoiceNoteCard } from '../../../components/voice-notes/VoiceNoteCard';

import { useVoiceNoteStore, type VoiceNote, VoiceNoteTag } from '../../../store/voiceNoteStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../../utils/colors';
import { toISOString } from '../../../utils/formatting';

export default function VoiceNotesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const { notes, addNote, deleteVoiceNote } = useVoiceNoteStore();

  const sheetRef = useRef<BottomSheetLib>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTogglePlay = useCallback((id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => setPlayingId(null);
    }, [])
  );

  const handleSave = useCallback(
    (data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) => {
      addNote({
        ...data,
        date: toISOString(),
      });
      sheetRef.current?.close();
    },
    [addNote]
  );

  const renderItem = useCallback(
    ({ item }: { item: VoiceNote }) => (
      <VoiceNoteCard
        note={item}
        isPlaying={playingId === item.id}
        onTogglePlay={handleTogglePlay}
        onDeleteConfirmed={() => {
          void deleteVoiceNote(item.id);
        }}
      />
    ),
    [deleteVoiceNote, playingId, handleTogglePlay]
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
        <FittedText
          style={[styles.title, { color: colors.text }]}
          minimumFontScale={0.76}
        >
          Voice Notes
        </FittedText>

        <View
          style={[
            styles.countBadge,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <FittedText
            style={[styles.countText, { color: colors.text }]}
            minimumFontScale={0.8}
          >
            {notes.length}
          </FittedText>
        </View>
      </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
          Record quick context while splitting later
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 150 },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="microphone-outline"
            title="No voice notes"
            subtitle="Tap the button to record an expense note or reminder."
          />
        }
      />

      {/* FAB */}
      {!isSheetOpen && (
        <FAB
          onPress={() => {
            setPlayingId(null);
            setIsSheetOpen(true);
            sheetRef.current?.expand();
          }}
          label="Record"
          icon="microphone"
        />
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        title="New Voice Note"
        snapPoints={['55%', '85%']}
        onClose={() => setIsSheetOpen(false)}
      >
        <RecordingSheet
          onSave={handleSave}
          onCancel={() => sheetRef.current?.close()}
        />
      </BottomSheet>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Spacing.md,
  },

  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },

  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },

  countText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  list: {
    paddingTop: Spacing.xs,
  },
});
