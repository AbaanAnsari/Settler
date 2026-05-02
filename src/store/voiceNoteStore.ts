import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/id';

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
  addNote: (note: Omit<VoiceNote, 'id'>) => void;
  updateNote: (id: string, updates: Partial<Omit<VoiceNote, 'id'>>) => void;
  deleteNote: (id: string) => void;
}

// Dummy data — placeholder URIs since real recordings need device
const NOTES: VoiceNote[] = [
  {
    id: 'vn1',
    fileUri: '',
    duration: 47,
    title: 'Grocery bill reminder',
    date: '2026-04-28T10:15:00.000Z',
    tag: 'Reminder',
  },
  {
    id: 'vn2',
    fileUri: '',
    duration: 132,
    title: 'Goa trip expense recap',
    date: '2026-04-27T21:30:00.000Z',
    tag: 'Expense',
  },
  {
    id: 'vn3',
    fileUri: '',
    duration: 23,
    title: 'Quick note — Arjun owes ₹2k',
    date: '2026-04-25T09:00:00.000Z',
    tag: 'General',
  },
];

export const useVoiceNoteStore = create<VoiceNoteState>()(
  persist(
    (set) => ({
      notes: NOTES,

      addNote: (note) =>
        set((s) => ({ notes: [{ id: generateId(), ...note }, ...s.notes] })),

      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    {
      name: 'settler-voice-notes',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
