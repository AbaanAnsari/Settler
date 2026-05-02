import { create } from 'zustand';
import { generateId } from '../utils/id';
import { getVoiceNotesFromDb, insertVoiceNoteDb, updateVoiceNoteDb, deleteVoiceNoteDb } from '../database/queries';

export type VoiceNoteTag = 'Expense' | 'Reminder' | 'General';

export interface VoiceNote {
  id: string;
  fileUri: string;
  duration: number; // seconds
  title: string;
  date: string;
  tag?: VoiceNoteTag;
}

interface VoiceNoteState {
  notes: VoiceNote[];
  isLoaded: boolean;
  loadFromDb: () => Promise<void>;
  addNote: (note: Omit<VoiceNote, 'id'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Omit<VoiceNote, 'id'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useVoiceNoteStore = create<VoiceNoteState>((set) => ({
  notes: [],
  isLoaded: false,

  loadFromDb: async () => {
    try {
      const notes = await getVoiceNotesFromDb();
      set({ notes, isLoaded: true });
    } catch (e) {
      console.error('Failed to load voice notes from DB:', e);
      set({ isLoaded: true });
    }
  },

  addNote: async (note) => {
    const newNote: VoiceNote = { id: generateId(), ...note };
    try {
      await insertVoiceNoteDb(newNote);
      set((s) => ({ notes: [newNote, ...s.notes] }));
    } catch (e) {
      console.error('Failed to add voice note:', e);
    }
  },

  updateNote: async (id, updates) => {
    try {
      await updateVoiceNoteDb(id, updates);
      set((s) => ({
        notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      }));
    } catch (e) {
      console.error('Failed to update voice note:', e);
    }
  },

  deleteNote: async (id) => {
    try {
      await deleteVoiceNoteDb(id);
      set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
    } catch (e) {
      console.error('Failed to delete voice note:', e);
    }
  },
}));
