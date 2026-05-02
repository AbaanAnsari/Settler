import BottomSheetLib from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '../../../components/ui/BottomSheet';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { RecordingSheet } from '../../../components/voice-notes/RecordingSheet';
import { VoiceNoteCard } from '../../../components/voice-notes/VoiceNoteCard';
import { useVoiceNoteStore, VoiceNoteTag } from '../../../store/voiceNoteStore';
import { FontSize, FontWeight, Radius, Spacing, useThemeColors } from '../../../utils/colors';
import { toISOString } from '../../../utils/formatting';

export default function VoiceNotesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { notes, addNote, deleteNote } = useVoiceNoteStore();
  const sheetRef = useRef<BottomSheetLib>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSave = useCallback((data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) => {
    addNote({
      ...data,
      date: toISOString(),
    });
    sheetRef.current?.close();
  }, [addNote]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this voice note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  }, [deleteNote]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <VoiceNoteCard note={item} onDelete={() => handleDelete(item.id)} />
  ), [handleDelete]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Voice Notes</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.countText, { color: colors.text }]}>{notes.length}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 150 }]}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="microphone-outline"
            title="No voice notes"
            subtitle="Tap the button to record an expense note or reminder."
          />
        }
      />

      {!isSheetOpen && (
        <FAB onPress={() => {
          setIsSheetOpen(true);
          sheetRef.current?.expand();
        }} label="Record" icon="microphone" />
      )}

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
  root: { flex: 1, paddingTop: Spacing.md },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  subtitle: { fontSize: FontSize.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  countText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  list: { paddingTop: Spacing.xs },
});
