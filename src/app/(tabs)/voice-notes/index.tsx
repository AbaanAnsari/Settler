import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { Colors, Spacing, FontSize, FontWeight } from '../../../utils/colors';
import { FAB } from '../../../components/ui/FAB';
import { EmptyState } from '../../../components/ui/EmptyState';
import BottomSheet from '../../../components/ui/BottomSheet';
import { VoiceNoteCard } from '../../../components/voice-notes/VoiceNoteCard';
import { RecordingSheet } from '../../../components/voice-notes/RecordingSheet';
import { useVoiceNoteStore, VoiceNoteTag } from '../../../store/voiceNoteStore';
import { toISOString } from '../../../utils/formatting';

export default function VoiceNotesScreen() {
  const { notes, addNote, deleteNote } = useVoiceNoteStore();
  const sheetRef = useRef<BottomSheetLib>(null);

  function handleSave(data: { title: string; duration: number; fileUri: string; tag?: VoiceNoteTag }) {
    addNote({
      ...data,
      date: toISOString(),
    });
    sheetRef.current?.close();
  }

  function handleDelete(id: string) {
    Alert.alert('Delete Note', 'Are you sure you want to delete this voice note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Notes</Text>
        <Text style={styles.subtitle}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <VoiceNoteCard note={item} onDelete={() => handleDelete(item.id)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="microphone-outline"
            title="No voice notes"
            subtitle="Tap the button to record an expense note or reminder."
          />
        }
      />

      <FAB onPress={() => sheetRef.current?.expand()} label="Record" icon="microphone" />

      <BottomSheet ref={sheetRef} title="New Voice Note" snapPoints={['55%', '85%']}>
        <RecordingSheet
          onSave={handleSave}
          onCancel={() => sheetRef.current?.close()}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted },
  list: { paddingTop: Spacing.xs, paddingBottom: 120 },
});
