import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/id';

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Transaction {
  id: string;
  personId: string;
  amount: number;
  type: 'give' | 'take';
  description: string;
  date: string;
}

interface DebtState {
  people: Person[];
  transactions: Transaction[];

  // People
  addPerson: (name: string, avatar?: string) => void;
  deletePerson: (id: string) => void;
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id'>>) => void;

  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;

  // Selectors
  getPersonTransactions: (personId: string) => Transaction[];
}

const AVATAR_COLORS = [
  '#7C6FF7', '#F87171', '#34D399', '#FBBF24',
  '#60A5FA', '#F472B6', '#A78BFA', '#FB923C',
];

function getColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// Dummy Data
const PEOPLE: Person[] = [
  { id: 'p1', name: 'Arjun Sharma', color: AVATAR_COLORS[0] },
  { id: 'p2', name: 'Priya Kapoor', color: AVATAR_COLORS[1] },
  { id: 'p3', name: 'Rahul Verma', color: AVATAR_COLORS[2] },
];

const TRANSACTIONS: Transaction[] = [
  // Arjun
  { id: 't1', personId: 'p1', amount: 1200, type: 'give', description: 'Dinner at Punjab Grill', date: '2026-04-10T19:30:00.000Z' },
  { id: 't2', personId: 'p1', amount: 500, type: 'take', description: 'Movie tickets', date: '2026-04-15T14:00:00.000Z' },
  { id: 't3', personId: 'p1', amount: 3200, type: 'give', description: 'Flight to Mumbai (shared)', date: '2026-04-20T08:00:00.000Z' },
  { id: 't4', personId: 'p1', amount: 800, type: 'take', description: 'Hotel split', date: '2026-04-22T12:00:00.000Z' },

  // Priya
  { id: 't5', personId: 'p2', amount: 650, type: 'take', description: 'Grocery run', date: '2026-04-08T11:00:00.000Z' },
  { id: 't6', personId: 'p2', amount: 2400, type: 'give', description: 'Birthday dinner', date: '2026-04-18T20:00:00.000Z' },
  { id: 't7', personId: 'p2', amount: 300, type: 'give', description: 'Coffee & snacks', date: '2026-04-28T10:30:00.000Z' },

  // Rahul
  { id: 't8', personId: 'p3', amount: 5000, type: 'take', description: 'Bike repair (borrowed)', date: '2026-03-20T09:00:00.000Z' },
  { id: 't9', personId: 'p3', amount: 1500, type: 'give', description: 'Concert tickets', date: '2026-04-05T18:00:00.000Z' },
  { id: 't10', personId: 'p3', amount: 2000, type: 'give', description: 'Goa trip split', date: '2026-04-25T07:00:00.000Z' },
];

export const useDebtStore = create<DebtState>()(
  persist(
    (set, get) => ({
      people: PEOPLE,
      transactions: TRANSACTIONS,

      addPerson: (name, avatar) => {
        const newPerson: Person = {
          id: generateId(),
          name,
          avatar,
          color: getColor(get().people.length),
        };
        set((s) => ({ people: [...s.people, newPerson] }));
      },

      deletePerson: (id) =>
        set((s) => ({
          people: s.people.filter((p) => p.id !== id),
          transactions: s.transactions.filter((t) => t.personId !== id),
        })),

      updatePerson: (id, updates) =>
        set((s) => ({
          people: s.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [...s.transactions, { id: generateId(), ...tx }],
        })),

      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      getPersonTransactions: (personId) =>
        get().transactions.filter((t) => t.personId === personId),
    }),
    {
      name: 'settler-debt',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
