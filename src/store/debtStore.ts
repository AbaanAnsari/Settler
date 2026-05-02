import { create } from 'zustand';
import { generateId } from '../utils/id';
import {
  getPeopleFromDb, getTransactionsFromDb, insertPersonDb,
  deletePersonDb, updatePersonDb, insertTransactionDb,
  updateTransactionDb, deleteTransactionDb
} from '../database/queries';

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

export interface DebtState {
  people: Person[];
  transactions: Transaction[];
  isLoaded: boolean;

  loadFromDb: () => Promise<void>;

  addPerson: (name: string, avatar?: string) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id'>>) => Promise<void>;

  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const AVATAR_COLORS = [
  '#7C6FF7', '#F87171', '#34D399', '#FBBF24',
  '#60A5FA', '#F472B6', '#A78BFA', '#FB923C',
];

function getColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// Dummy data moved to initialization script if DB is empty

export const useDebtStore = create<DebtState>((set, get) => ({
  people: [],
  transactions: [],
  isLoaded: false,

  loadFromDb: async () => {
    try {
      const people = await getPeopleFromDb();
      const transactions = await getTransactionsFromDb();
      set({ people, transactions, isLoaded: true });
    } catch (e) {
      console.error('Failed to load debt store from DB:', e);
      set({ isLoaded: true });
    }
  },

  addPerson: async (name, avatar) => {
    const newPerson: Person = {
      id: generateId(),
      name,
      avatar,
      color: getColor(get().people.length),
    };
    try {
      await insertPersonDb(newPerson);
      set((s) => ({ people: [...s.people, newPerson] }));
    } catch (e) {
      console.error('Failed to add person:', e);
    }
  },

  deletePerson: async (id) => {
    try {
      await deletePersonDb(id);
      set((s) => ({
        people: s.people.filter((p) => p.id !== id),
        transactions: s.transactions.filter((t) => t.personId !== id),
      }));
    } catch (e) {
      console.error('Failed to delete person:', e);
    }
  },

  updatePerson: async (id, updates) => {
    try {
      await updatePersonDb(id, updates);
      set((s) => ({
        people: s.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    } catch (e) {
      console.error('Failed to update person:', e);
    }
  },

  addTransaction: async (tx) => {
    const newTx: Transaction = { id: generateId(), ...tx };
    try {
      await insertTransactionDb(newTx);
      set((s) => ({
        transactions: [...s.transactions, newTx],
      }));
    } catch (e) {
      console.error('Failed to add transaction:', e);
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      await updateTransactionDb(id, updates);
      set((s) => ({
        transactions: s.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    } catch (e) {
      console.error('Failed to update transaction:', e);
    }
  },

  deleteTransaction: async (id) => {
    try {
      await deleteTransactionDb(id);
      set((s) => ({
        transactions: s.transactions.filter((t) => t.id !== id),
      }));
    } catch (e) {
      console.error('Failed to delete transaction:', e);
    }
  },
}));
