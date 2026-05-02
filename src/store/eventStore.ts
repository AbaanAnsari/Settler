import { create } from 'zustand';
import { generateId } from '../utils/id';
import {
  getEventsFromDb, getExpensesFromDb, insertEventDb, updateEventDb, deleteEventDb,
  insertExpenseDb, updateExpenseDb, deleteExpenseDb
} from '../database/queries';

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

export interface PersonEventSummary {
  personName: string;
  totalPaid: number;
  equalShare: number;
  net: number; // positive = should receive, negative = owes
}

interface EventState {
  events: Event[];
  expenses: Expense[];
  isLoaded: boolean;

  loadFromDb: () => Promise<void>;

  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id'>>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  getEventExpenses: (eventId: string) => Expense[];
  getEventSummary: (eventId: string) => { total: number; participants: string[]; perPerson: PersonEventSummary[] };
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  expenses: [],
  isLoaded: false,

  loadFromDb: async () => {
    try {
      const events = await getEventsFromDb();
      const expenses = await getExpensesFromDb();
      set({ events, expenses, isLoaded: true });
    } catch (e) {
      console.error('Failed to load event store from DB:', e);
    }
  },

  addEvent: async (event) => {
    const newEvent: Event = { id: generateId(), ...event };
    try {
      await insertEventDb(newEvent);
      set((s) => ({ events: [...s.events, newEvent] }));
    } catch (e) {
      console.error('Failed to add event:', e);
    }
  },

  updateEvent: async (id, updates) => {
    try {
      await updateEventDb(id, updates);
      set((s) => ({
        events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));
    } catch (e) {
      console.error('Failed to update event:', e);
    }
  },

  deleteEvent: async (id) => {
    try {
      await deleteEventDb(id);
      set((s) => ({
        events: s.events.filter((e) => e.id !== id),
        expenses: s.expenses.filter((ex) => ex.eventId !== id),
      }));
    } catch (e) {
      console.error('Failed to delete event:', e);
    }
  },

  addExpense: async (expense) => {
    const newExpense: Expense = { id: generateId(), ...expense };
    try {
      await insertExpenseDb(newExpense);
      set((s) => ({ expenses: [...s.expenses, newExpense] }));
    } catch (e) {
      console.error('Failed to add expense:', e);
    }
  },

  updateExpense: async (id, updates) => {
    try {
      await updateExpenseDb(id, updates);
      set((s) => ({
        expenses: s.expenses.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)),
      }));
    } catch (e) {
      console.error('Failed to update expense:', e);
    }
  },

  deleteExpense: async (id) => {
    try {
      await deleteExpenseDb(id);
      set((s) => ({ expenses: s.expenses.filter((ex) => ex.id !== id) }));
    } catch (e) {
      console.error('Failed to delete expense:', e);
    }
  },

  getEventExpenses: (eventId) =>
    get().expenses.filter((ex) => ex.eventId === eventId),

  getEventSummary: (eventId) => {
    const expenses = get().expenses.filter((ex) => ex.eventId === eventId);
    if (expenses.length === 0) {
      return { total: 0, participants: [], perPerson: [] };
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const participantSet = new Set(expenses.map((e) => e.personName));
    const participants = Array.from(participantSet);
    const equalShare = total / participants.length;
    // Round to 2 decimals
    const roundedShare = Math.round(equalShare * 100) / 100;

    const paidMap: Record<string, number> = {};
    for (const p of participants) paidMap[p] = 0;
    for (const e of expenses) paidMap[e.personName] += e.amount;

    const perPerson: PersonEventSummary[] = participants.map((name) => {
      const net = paidMap[name] - roundedShare;
      return {
        personName: name,
        totalPaid: paidMap[name],
        equalShare: roundedShare,
        net: Math.round(net * 100) / 100, // round net balance
      };
    });

    return { total, participants, perPerson };
  },
}));
