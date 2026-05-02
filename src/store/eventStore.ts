import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/id';

export interface Event {
  id: string;
  name: string;
  date: string;
}

export interface Expense {
  id: string;
  eventId: string;
  personName: string;
  amount: number;
  reason: string;
  date: string;
}

interface EventState {
  events: Event[];
  expenses: Expense[];

  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id'>>) => void;
  deleteExpense: (id: string) => void;

  getEventExpenses: (eventId: string) => Expense[];
}

// Dummy Data
const EVENTS: Event[] = [
  { id: 'e1', name: 'Goa Trip 2026', date: '2026-04-25T00:00:00.000Z' },
  { id: 'e2', name: 'Rohan\'s Birthday Dinner', date: '2026-04-18T00:00:00.000Z' },
];

const EXPENSES: Expense[] = [
  // Goa Trip
  { id: 'ex1', eventId: 'e1', personName: 'Arjun', amount: 8500, reason: 'Flight tickets (booked for all)', date: '2026-04-24T08:00:00.000Z' },
  { id: 'ex2', eventId: 'e1', personName: 'Priya', amount: 4200, reason: 'Hotel (2 nights)', date: '2026-04-25T14:00:00.000Z' },
  { id: 'ex3', eventId: 'e1', personName: 'Rahul', amount: 2800, reason: 'Food & drinks', date: '2026-04-26T19:00:00.000Z' },
  { id: 'ex4', eventId: 'e1', personName: 'Sneha', amount: 1200, reason: 'Sightseeing & cabs', date: '2026-04-27T11:00:00.000Z' },

  // Birthday Dinner
  { id: 'ex5', eventId: 'e2', personName: 'Priya', amount: 3600, reason: 'Restaurant bill', date: '2026-04-18T21:00:00.000Z' },
  { id: 'ex6', eventId: 'e2', personName: 'Arjun', amount: 1400, reason: 'Cake & decorations', date: '2026-04-18T19:00:00.000Z' },
  { id: 'ex7', eventId: 'e2', personName: 'Rahul', amount: 800, reason: 'Drinks', date: '2026-04-18T20:00:00.000Z' },
];

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: EVENTS,
      expenses: EXPENSES,

      addEvent: (event) =>
        set((s) => ({ events: [...s.events, { id: generateId(), ...event }] })),

      updateEvent: (id, updates) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteEvent: (id) =>
        set((s) => ({
          events: s.events.filter((e) => e.id !== id),
          expenses: s.expenses.filter((ex) => ex.eventId !== id),
        })),

      addExpense: (expense) =>
        set((s) => ({ expenses: [...s.expenses, { id: generateId(), ...expense }] })),

      updateExpense: (id, updates) =>
        set((s) => ({
          expenses: s.expenses.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)),
        })),

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((ex) => ex.id !== id) })),

      getEventExpenses: (eventId) =>
        get().expenses.filter((ex) => ex.eventId === eventId),
    }),
    {
      name: 'settler-events',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
